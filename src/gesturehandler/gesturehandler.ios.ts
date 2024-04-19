import { Utils, View } from '@nativescript/core';
import { GestureEventData, GestureTypes } from '@nativescript/core/ui/gestures';
import { getClass } from '@nativescript/core/utils/types';
import {
    FlingGestureHandlerOptions,
    ForceTouchGestureHandlerOptions,
    HandlerOptions,
    LongPressGestureHandlerOptions,
    NativeViewGestureHandlerOptions,
    PanGestureHandlerOptions,
    PinchGestureHandlerOptions,
    RotationGestureHandlerOptions,
    TapGestureHandlerOptions
} from './gesturehandler';
import {
    BaseGestureRootView,
    BaseNative,
    GestureHandlerStateEvent,
    GestureHandlerTouchEvent,
    GestureState,
    GestureStateEventData,
    GestureTouchEventData,
    HandlerType,
    ManagerBase,
    OptionsTypeMap,
    TypeMap,
    ViewDisposeEvent,
    ViewInitEvent,
    install as installBase,
    nativeProperty
} from './gesturehandler.common';
import { observe as gestureObserve } from './gestures_override';
export { GestureState, GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureStateEventData, GestureTouchEventData, HandlerType, ViewInitEvent, ViewDisposeEvent };

export enum FlingDirection {
    DIRECTION_LEFT = UISwipeGestureRecognizerDirection.Left,
    DIRECTION_UP = UISwipeGestureRecognizerDirection.Up,
    DIRECTION_DOWN = UISwipeGestureRecognizerDirection.Down,
    DIRECTION_RIGHT = UISwipeGestureRecognizerDirection.Right
}

let installed = false;
let installedOverrides = false;
export function install(overrideNGestures = false) {
    if (!installed) {
        installed = true;
        installBase(overrideNGestures);
    }

    if (overrideNGestures === true && !installedOverrides) {
        installedOverrides = true;
        const NSView = require('@nativescript/core/ui/core/view').View;
        NSView.prototype._observe = function (type: GestureTypes, callback: (args: GestureEventData) => void, thisArg?: any): void {
            if (!this._gestureObservers[type]) {
                this._gestureObservers[type] = [];
            }

            this._gestureObservers[type].push(gestureObserve(this, type, callback, thisArg));
            // if (type & GestureTypes.touch && this.isLoaded && !this.touchListenerIsSet) {
            //     this.setOnTouchListener();
            // }
        };
    }
}
function toJsObject(objCObj) {
    if (objCObj === null || typeof objCObj !== 'object') {
        return objCObj;
    }
    let node, key, i, l;
    const oKeyArr = objCObj.allKeys;

    if (oKeyArr === undefined && objCObj.count !== undefined) {
        // array
        node = [];
        for (i = 0, l = objCObj.count; i < l; i++) {
            key = objCObj.objectAtIndex(i);
            node.push(toJsObject(key));
        }
    } else if (oKeyArr !== undefined) {
        // object
        node = {};
        for (i = 0, l = oKeyArr.count; i < l; i++) {
            key = oKeyArr.objectAtIndex(i);
            const val = objCObj.valueForKey(key);

            // Firestore can store nulls
            if (val === null) {
                node[key] = null;
                continue;
            }
            node[key] = getValueForClass(val);
        }
    } else {
        node = getValueForClass(objCObj);
    }

    return node;
}

function getValueForClass(val) {
    switch (getClass(val)) {
        case 'NSArray':
        case 'NSMutableArray':
            return toJsObject(val);
        case 'NSDictionary':
        case 'NSMutableDictionary':
            return toJsObject(val);
        case 'String':
            return String(val);
        case 'Boolean':
            return val;
        case 'Number':
        case 'NSDecimalNumber':
            return Number(String(val));
        case 'Date':
            return new Date(val);

        default:
            console.log(
                "Please report this at https://github.com/farfromrefug/@nativescript-community/gesturehandler/issues: iOS toJsObject is missing a converter for class '" +
                    getClass(val) +
                    "'. Casting to String as a fallback."
            );
            return String(val);
    }
}

export class GestureRootView extends BaseGestureRootView {}

@NativeClass
export class HandlerDelegate extends NSObject implements GestureHandlerDelegate {
    public static ObjCProtocols = [GestureHandlerDelegate];
    private _owner: WeakRef<Handler<any, any>>;
    static new(): HandlerDelegate {
        return super.new() as HandlerDelegate;
    }
    // public initWithOwner(owner: WeakRef<Handler<any, any>>): HandlerDelegate {
    //     this._owner = owner;
    //     return this;
    // }

    public static initWithOwner(owner: WeakRef<Handler<any, any>>): HandlerDelegate {
        const impl = HandlerDelegate.new();
        impl._owner = owner;
        return impl;
    }
    gestureHandlerDidChangeStatePrevStateExtraDataView(
        handler: GestureHandler,
        state: GestureHandlerState,
        prevState: GestureHandlerState,
        extraData: NSDictionary<any, any>,
        view: UIView & { nsView?: WeakRef<View> }
    ): void {
        const owner = this._owner && this._owner.get();
        if (owner) {
            owner.notify({
                eventName: GestureHandlerStateEvent,
                object: owner,
                data: {
                    state,
                    prevState,
                    ios: handler,
                    extraData: toJsObject(extraData),
                    view: view.nsView ? view.nsView.get() : null
                }
            });
        }
    }
    gestureHandlerTouchEventOnViewStateExtraData(handler: GestureHandler, view: UIView & { nsView?: WeakRef<View> }, state: GestureHandlerState, extraData: NSDictionary<any, any>): void {
        const owner = this._owner && this._owner.get();
        if (owner) {
            owner.notify({
                eventName: GestureHandlerTouchEvent,
                object: owner,
                data: {
                    state,
                    ios: handler,
                    extraData: toJsObject(extraData),
                    view: view.nsView ? view.nsView.get() : null
                }
            });
        }
    }
    gestureHandlerShouldActivateForEvent(handler: GestureHandler, extraData: NSDictionary<any, any>) {
        const owner = this._owner && this._owner.get();
        if (owner && owner.options && owner.options.shouldStartGesture) {
            return owner.options.shouldStartGesture(toJsObject(extraData));
        }
        return true;
    }
}

export class Handler<T extends GestureHandler, U extends HandlerOptions> extends BaseNative<T, U> {
    manager: WeakRef<Manager>;
    delegate: HandlerDelegate;
    @nativeProperty enabled: boolean;
    @nativeProperty shouldCancelWhenOutside: boolean;
    createNative() {
        return null;
    }
    attachedView: View;
    nativeGetterKey = 'nativeView';
    attachToView(view: View) {
        if (view === this.attachedView) {
            return;
        }
        if (this.attachedView) {
            this.detachFromView(this.attachedView);
        }
        this.attachedView = view;
        this.delegate = HandlerDelegate.initWithOwner(new WeakRef(this));
        this.native.delegate = this.delegate;
        this.manager.get().attachGestureHandler(this, view);
    }
    detachFromView(view?: View) {
        if ((view && view !== this.attachedView) || !this.attachedView) {
            return;
        }

        if (!this.attachedView) {
            return;
        }
        const tag = this.native.tag;
        this.delegate = this.native.delegate = null;
        this.manager.get().detachGestureHandler(tag, this.attachedView);
        this.attachedView = null;
    }
    getTag() {
        return this.native.tag;
    }
    setTag(value) {
        // cant change tag on ios
    }
    getView() {
        return this.attachedView;
    }
    cancel() {
        this.native.cancel();
    }
}

export class TapHandler extends Handler<TapGestureHandler, TapGestureHandlerOptions> {
    @nativeProperty numberOfTaps: number;
    @nativeProperty maxDurationMs: number;
    @nativeProperty maxDelayMs: number;
    @nativeProperty maxDeltaX: number;
    @nativeProperty maxDeltaY: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) maxDist: number;
    @nativeProperty minPointers: number;
}

export class PanHandler extends Handler<PanGestureHandler, PanGestureHandlerOptions> {
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) minDist: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) activeOffsetXStart: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) activeOffsetXEnd: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) failOffsetXStart: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) failOffsetXEnd: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) activeOffsetYStart: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) activeOffsetYEnd: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) failOffsetYStart: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) failOffsetYEnd: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) minVelocity: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) minVelocityX: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) minVelocityY: number;
    @nativeProperty minPointers: number;
    @nativeProperty maxPointers: number;
    @nativeProperty({ nativeSetterName: 'setAverageTouches' }) avgTouches: number;
    @nativeProperty numberOfPointers: number;
}

export class PinchHandler extends Handler<PinchGestureHandler, PinchGestureHandlerOptions> {
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) minSpan: number;
}

export class FlingHandler extends Handler<FlingGestureHandler, FlingGestureHandlerOptions> {
    @nativeProperty numberOfPointers: number;
    @nativeProperty direction: number;
}
export class ForceTouchGestureHandler extends Handler<ForceTouchHandler, ForceTouchGestureHandlerOptions> {
    @nativeProperty minForce: number;
    @nativeProperty maxForce: number;
}
export class LongPressHandler extends Handler<LongPressGestureHandler, LongPressGestureHandlerOptions> {
    @nativeProperty minDurationMs: number;
    @nativeProperty({ converter: { fromNative: Utils.layout.toDevicePixels } }) maxDist: number;
}
export class RotationHandler extends Handler<RotationGestureHandler, RotationGestureHandlerOptions> {}

export class NativeViewHandler extends Handler<NativeViewGestureHandler, NativeViewGestureHandlerOptions> {
    @nativeProperty shouldActivateOnStart: boolean;
    @nativeProperty disallowInterruption: boolean;
}
export class Manager extends ManagerBase {
    _manager: GestureHandlerManager;
    get manager() {
        if (!this._manager) {
            this._manager = GestureHandlerManager.alloc().init();
        }
        return this._manager;
    }

    static sManager: Manager;
    static getInstance() {
        if (!Manager.sManager) {
            Manager.sManager = new Manager();
        }
        return Manager.sManager;
    }
    createGestureHandler<T extends HandlerType>(handlerName: T, handlerTag: number, config?: OptionsTypeMap[T]): TypeMap[T] {
        const nHandler = this.manager.createGestureHandlerTagConfig(handlerName, handlerTag, config ? NSDictionary.dictionaryWithDictionary(config as any) : null);
        let result: Handler<any, any>;
        switch (handlerName) {
            case 'tap':
                result = new TapHandler(config, nHandler);
                break;
            case 'pan':
                result = new PanHandler(config, nHandler);
                break;
            case 'fling':
                result = new FlingHandler(config, nHandler);
                break;
            case 'longPress':
                result = new LongPressHandler(config, nHandler);
                break;
            case 'nativeView':
                result = new NativeViewHandler(config, nHandler);
                break;
            case 'pinch':
                result = new PinchHandler(config, nHandler);
                break;
            case 'rotation':
                result = new RotationHandler(config, nHandler);
                break;
            case 'forceTouch':
                result = new ForceTouchGestureHandler(config, nHandler);
                break;
            default:
                result = new Handler(config, nHandler);
                break;
        }
        result.manager = new WeakRef(this);
        return result as any;
    }

    viewListeners = new Map<View, Map<number, { init: () => void; dispose: () => void }>>();
    attachGestureHandler(handler: Handler<any, any>, view: View) {
        this.manager.registerGestureHandler(handler.native);
        const tag = handler.native.tag;
        if (view.nativeView) {
            this.manager.attachGestureHandlerToView(tag, view[handler.nativeGetterKey]);
        }
        const onInit = () => {
            // we need to ensure the handler is registered
            // in case it was dropped in dispose
            this.manager.registerGestureHandler(handler.native);
            this.manager.attachGestureHandlerToView(tag, view[handler.nativeGetterKey]);
        };
        const onDispose = () => this.manager.dropGestureHandler(tag);
        view.on(ViewInitEvent, onInit, this);
        view.on(ViewDisposeEvent, onDispose, this);
        let viewListeners = this.viewListeners.get(view);
        if (!viewListeners) {
            viewListeners = new Map();
            this.viewListeners.set(view, viewListeners);
        }
        viewListeners.set(tag, {
            init: onInit,
            dispose: onDispose
        });
    }
    detachGestureHandler(handlerTag: number, view: View) {
        if (view.nativeView) {
            this.manager.dropGestureHandler(handlerTag);
        }
        if (view) {
            const viewListeners = this.viewListeners.get(view);
            if (viewListeners) {
                const listeners = viewListeners.get(handlerTag);
                if (listeners) {
                    view.off(ViewInitEvent, listeners.init, this);
                    view.off(ViewDisposeEvent, () => listeners.dispose, this);
                    viewListeners.delete(handlerTag);
                    if (viewListeners.size === 0) {
                        this.viewListeners.delete(view);
                    }
                }
            }
        }
    }
}
