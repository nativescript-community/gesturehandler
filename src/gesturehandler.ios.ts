import {
    BaseNative,
    GestureHandlerStateEvent,
    GestureHandlerTouchEvent,
    GestureState,
    GestureStateEventData,
    GestureTouchEventData,
    HandlerType,
    install,
    Manager as ManagerBase,
    nativeProperty,
    OptionsTypeMap,
    TypeMap,
    ViewDisposeEvent,
    ViewInitEvent
} from './gesturehandler.common';
import { View } from '@nativescript/core/ui/core/view';
import { getClass } from '@nativescript/core/utils/types';
import { HandlerOptions,  } from './gesturehandler';
export { GestureState, GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureStateEventData, GestureTouchEventData, HandlerType, install, ViewInitEvent, ViewDisposeEvent };

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
                "Please report this at https://github.com/farfromrefug/nativescript-gesturehandler-febase/issues: iOS toJsObject is missing a converter for class '" +
                    getClass(val) +
                    "'. Casting to String as a fallback."
            );
            return String(val);
    }
}

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
        const impl = <HandlerDelegate>HandlerDelegate.new();
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
                    ios: view,
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
                    ios: view,
                    extraData: toJsObject(extraData),
                    view: view.nsView ? view.nsView.get() : null
                }
            });
        }
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
    attachToView(view: View) {
        const tag = this.native.tag;
        this.delegate = HandlerDelegate.initWithOwner(new WeakRef(this));
        this.native.delegate = this.delegate;
        this.manager.get().attachGestureHandler(tag, view);
    }
    detachFromView(view: View) {
        const tag = this.native.tag;
        this.delegate = this.native.delegate = null;
        this.manager.get().detachGestureHandler(tag, view);
    }
    getTag() {
        return this.native.tag;
    }
    setTag(value) {
        // cant change tag on ios
    }
    getView() {
        return null;
    }
    cancel() {
        this.native.reset();
    }
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
        const result = new Handler(config, nHandler);
        result.manager = new WeakRef(this);
        return result as any;
    }

    viewListeners = new Map<View, Map<number, { init: () => void; dispose: () => void }>>();
    attachGestureHandler(handlerTag: number, view: View) {
        if (view.nativeView) {
            this.manager.attachGestureHandlerToView(handlerTag, view.nativeView);
        }
        const onInit = () => {
            // console.log('attachGestureHandlerToView', handlerTag, view.nativeView);
            this.manager.attachGestureHandlerToView(handlerTag, view.nativeView);
        };
        const onDispose = () => this.manager.dropGestureHandler(handlerTag);
        view.on(ViewInitEvent, onInit, this);
        view.on(ViewDisposeEvent, onDispose, this);
        let viewListeners = this.viewListeners.get(view);
        if (!viewListeners) {
            viewListeners = new Map();
            this.viewListeners.set(view, viewListeners);
        }
        viewListeners.set(handlerTag, {
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
