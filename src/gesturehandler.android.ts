import {
    applyMixins,
    BaseNative,
    GestureHandlerStateEvent,
    GestureHandlerTouchEvent,
    GestureState,
    GestureStateEventData,
    GestureTouchEventData,
    HandlerType,
    install as installBase,
    Manager as ManagerBase,
    nativeProperty,
    OptionsTypeMap,
    TypeMap,
    ViewDisposeEvent,
    ViewInitEvent,
} from './gesturehandler.common';

import { observe as gestureObserve } from './gestures_override';
import { View } from '@nativescript/core/ui/core/view';
import { layout } from '@nativescript/core/utils/utils';
import { android as androidApp } from '@nativescript/core/application';
import {
    FlingGestureHandlerOptions,
    HandlerOptions,
    LongPressGestureHandlerOptions,
    NativeViewGestureHandlerOptions,
    PanGestureHandlerOptions,
    PinchGestureHandlerOptions,
    RotationGestureHandlerOptions,
    TapGestureHandlerOptions,
} from './gesturehandler';
import { Page } from '@nativescript/core/ui/page';
import { GestureTypes, GestureEventData } from '@nativescript/core/ui/gestures';
export { GestureState, GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureStateEventData, GestureTouchEventData, HandlerType, ViewInitEvent, ViewDisposeEvent };

let PageLayout: typeof com.nativescript.gesturehandler.PageLayout;
class PageGestureExtended extends Page {
    nativeView: com.nativescript.gesturehandler.PageLayout;
    initNativeView() {
        this.nativeView.initialize();
    }
    disposeNativeView() {
        this.nativeView.tearDown();
    }
    get registry() {
        return this.nativeView && this.nativeView.registry();
    }
}
let installed = false;
export function install(overrideNGestures = false) {
    if (installed) {
        return;
    }
    installed = true;
    installBase();
    const NSPage = require('@nativescript/core/ui/page').Page;
    NSPage.prototype.createNativeView = function () {
        if (!PageLayout) {
            PageLayout = com.nativescript.gesturehandler.PageLayout;
        }
        const layout = new PageLayout(this._context);
        this.gestureRegistry = layout.registry;
        return layout;
    };
    applyMixins(NSPage, [PageGestureExtended]);
    if (overrideNGestures === true) {
        const NSView = require('@nativescript/core/ui/core/view').View;
        NSView.prototype._observe = function (type: GestureTypes, callback: (args: GestureEventData) => void, thisArg?: any): void {
            console.log('overriden observe');
            if (!this._gestureObservers[type]) {
                this._gestureObservers[type] = [];
            }

            this._gestureObservers[type].push(gestureObserve(this, type, callback, thisArg));
            if (type & GestureTypes.touch && this.isLoaded && !this.touchListenerIsSet) {
                this.setOnTouchListener();
            }
        };
        NSView.prototype.setOnTouchListener = function () {
            if (!this.nativeViewProtected || !this.getGestureObservers(GestureTypes.touch)) {
                return;
            }
            // do not set noop listener that handles the event (disabled listener) if IsUserInteractionEnabled is
            // false as we might need the ability for the event to pass through to a parent view
            this.touchListener =
                this.touchListener ||
                new android.view.View.OnTouchListener({
                    onTouch: (view: android.view.View, event: android.view.MotionEvent) => {
                        console.log('overriden onTouch', !!this.handleGestureTouch);
                        this.handleGestureTouch(event);

                        let nativeView = this.nativeViewProtected;
                        if (!nativeView || !nativeView.onTouchEvent) {
                            return false;
                        }

                        return nativeView.onTouchEvent(event);
                    },
                });
            this.nativeViewProtected.setOnTouchListener(this.touchListener);

            this.touchListenerIsSet = true;

            if (this.nativeViewProtected.setClickable) {
                this.nativeViewProtected.setClickable(this.isUserInteractionEnabled);
            }
        };
    }
}

const KEY_HIT_SLOP_LEFT = 'left';
const KEY_HIT_SLOP_TOP = 'top';
const KEY_HIT_SLOP_RIGHT = 'right';
const KEY_HIT_SLOP_BOTTOM = 'bottom';
const KEY_HIT_SLOP_VERTICAL = 'vertical';
const KEY_HIT_SLOP_HORIZONTAL = 'horizontal';
const KEY_HIT_SLOP_WIDTH = 'width';
const KEY_HIT_SLOP_HEIGHT = 'height';

export abstract class Handler<T extends com.swmansion.gesturehandler.GestureHandler<any>, U extends HandlerOptions> extends BaseNative<T, U> {
    @nativeProperty({
        nativeSetterName: 'setHitSlop',
        nativegetterName: 'getHitSlop',
        converter: {
            toNative(value) {
                const HIT_SLOP_NONE = com.swmansion.gesturehandler.GestureHandler.HIT_SLOP_NONE;
                if (typeof value === 'number') {
                    const hitSlop = layout.toDevicePixels(value);
                    return [hitSlop, hitSlop, hitSlop, hitSlop, HIT_SLOP_NONE, HIT_SLOP_NONE];
                } else {
                    let left = HIT_SLOP_NONE,
                        top = HIT_SLOP_NONE,
                        right = HIT_SLOP_NONE,
                        bottom = HIT_SLOP_NONE;
                    let width = HIT_SLOP_NONE,
                        height = HIT_SLOP_NONE;
                    if (value.hasOwnProperty(KEY_HIT_SLOP_HORIZONTAL)) {
                        const horizontalPad = layout.toDevicePixels(value[KEY_HIT_SLOP_HORIZONTAL]);
                        left = right = horizontalPad;
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_VERTICAL)) {
                        const verticalPad = layout.toDevicePixels(value[KEY_HIT_SLOP_VERTICAL]);
                        top = bottom = verticalPad;
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_LEFT)) {
                        left = layout.toDevicePixels(value[KEY_HIT_SLOP_LEFT]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_TOP)) {
                        top = layout.toDevicePixels(value[KEY_HIT_SLOP_TOP]);
                    }
                    if (value.hasKey(KEY_HIT_SLOP_RIGHT)) {
                        right = layout.toDevicePixels(value[KEY_HIT_SLOP_RIGHT]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_BOTTOM)) {
                        bottom = layout.toDevicePixels(value[KEY_HIT_SLOP_BOTTOM]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_WIDTH)) {
                        width = layout.toDevicePixels(value[KEY_HIT_SLOP_WIDTH]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_HEIGHT)) {
                        height = layout.toDevicePixels(value[KEY_HIT_SLOP_HEIGHT]);
                    }
                    return [left, top, right, bottom, width, height];
                }
            },
        },
    })
    hitSlop;
    @nativeProperty enabled: boolean;
    @nativeProperty shouldCancelWhenOutside: boolean;
    manager: WeakRef<Manager>;
    touchListener: com.swmansion.gesturehandler.OnTouchEventListener<T>;

    getExtraData(handler: T) {
        const numberOfPointers = handler.getNumberOfPointers();
        const positions = [];
        for (let index = 0; index < numberOfPointers; index++) {
            positions.push(handler.getXAtIndex(index));
            positions.push(handler.getYAtIndex(index));
        }
        return {
            // x: layout.toDeviceIndependentPixels(handler.getX()),
            // y: layout.toDeviceIndependentPixels(handler.getY()),
            positions,
            numberOfPointers,
        };
    }
    initNativeView(native: T, options: U) {
        super.initNativeView(native, options);
        this.native.setTag(this.tag);
        this.touchListener = new com.swmansion.gesturehandler.OnTouchEventListener({
            onTouchEvent: this.onTouchEvent.bind(this),
            onStateChange: this.onStateChange.bind(this),
        });
        native.setOnTouchEventListener(this.touchListener);
        this.manager.get().configureInteractions(this, options);
    }
    disposeNativeView() {
        this.native.setInteractionController(null);
        this.native.setOnTouchEventListener(null);
        this.touchListener = null;
        super.disposeNativeView();
    }
    onTouchEvent(handler: T, event: android.view.MotionEvent) {
        const view = handler.getView() as any;
        this.notify({
            eventName: GestureHandlerTouchEvent,
            object: this,
            data: {
                state: handler.getState(),
                android: view,
                extraData: this.getExtraData(handler),
                view: view.nsView ? view.nsView.get() : null,
            },
        });
    }
    onStateChange(handler: T, state: number, prevState: number) {
        const view = handler.getView() as any;
        this.notify({
            eventName: GestureHandlerStateEvent,
            object: this,
            data: {
                state,
                prevState,
                android: view,
                extraData: this.getExtraData(handler),
                view: view.nsView ? view.nsView.get() : null,
            },
        });
    }

    tag: number = 0;
    setTag(tag: number) {
        this.tag = tag;
        if (this.native) {
            this.native.setTag(tag);
        }
    }
    getTag() {
        return this.tag;
        // return this.getNative().getTag();
    }
    getView() {
        return this.getNative().getView();
    }
    cancel() {
        return this.getNative().cancel();
    }

    attachToView(view: View) {
        this.manager.get().attachGestureHandler(this, view);
    }
    detachFromView(view: View) {
        this.manager.get().detachGestureHandler(this, view);
    }
}

export class TapGestureHandler extends Handler<com.swmansion.gesturehandler.TapGestureHandler, TapGestureHandlerOptions> {
    @nativeProperty numberOfTaps: number;
    @nativeProperty maxDurationMs: number;
    @nativeProperty maxDelayMs: number;
    @nativeProperty({ nativeSetterName: 'setMaxDx' }) maxDeltaX: number;
    @nativeProperty({ nativeSetterName: 'setMaxDy' }) maxDeltaY: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) maxDist: number;
    @nativeProperty({ nativeSetterName: 'setMinNumberOfPointers' }) minPointers: number;
    createNative(options) {
        return new com.swmansion.gesturehandler.TapGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.TapGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            x: layout.toDeviceIndependentPixels(handler.getLastRelativePositionX()),
            y: layout.toDeviceIndependentPixels(handler.getLastRelativePositionY()),
            absoluteX: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionX()),
            absoluteY: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionY()),
        });
    }
}

export class PanGestureHandler extends Handler<com.swmansion.gesturehandler.PanGestureHandler, PanGestureHandlerOptions> {
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minDist: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetXStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetXEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetXStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetXEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetYStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetYEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetYStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetYEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minVelocity: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minVelocityX: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minVelocityY: number;
    @nativeProperty minPointers: number;
    @nativeProperty maxPointers: number;
    @nativeProperty({ nativeSetterName: 'setAverageTouches' }) avgTouches: number;
    @nativeProperty numberOfPointers: number;
    createNative(options) {
        const context = androidApp.context as android.content.Context;
        return new com.swmansion.gesturehandler.PanGestureHandler(context);
    }
    getExtraData(handler: com.swmansion.gesturehandler.PanGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            x: layout.toDeviceIndependentPixels(handler.getLastRelativePositionX()),
            y: layout.toDeviceIndependentPixels(handler.getLastRelativePositionY()),
            absoluteX: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionX()),
            absoluteY: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionY()),
            translationX: layout.toDeviceIndependentPixels(handler.getTranslationX()),
            translationY: layout.toDeviceIndependentPixels(handler.getTranslationY()),
            velocityX: layout.toDeviceIndependentPixels(handler.getVelocityX()),
            velocityY: layout.toDeviceIndependentPixels(handler.getVelocityY()),
        });
    }
}

export class PinchGestureHandler extends Handler<com.swmansion.gesturehandler.PinchGestureHandler, PinchGestureHandlerOptions> {
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minSpan: number;
    createNative(options) {
        return new com.swmansion.gesturehandler.PinchGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.PinchGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            scale: handler.getScale(),
            focalX: layout.toDeviceIndependentPixels(handler.getFocalPointX()),
            focalY: layout.toDeviceIndependentPixels(handler.getFocalPointY()),
            velocity: handler.getVelocity(),
        });
    }
}

function directionToString(direction: number) {
    switch (direction) {
        case com.swmansion.gesturehandler.GestureHandler.DIRECTION_RIGHT:
            return 'right';
        case com.swmansion.gesturehandler.GestureHandler.DIRECTION_UP:
            return 'up';
        case com.swmansion.gesturehandler.GestureHandler.DIRECTION_DOWN:
            return 'down';
        default:
            return 'left';
    }
}

function directionFromString(direction: string) {
    switch (direction) {
        case 'right':
            return com.swmansion.gesturehandler.GestureHandler.DIRECTION_RIGHT;
        case 'up':
            return com.swmansion.gesturehandler.GestureHandler.DIRECTION_UP;
        case 'down':
            return com.swmansion.gesturehandler.GestureHandler.DIRECTION_DOWN;
        default:
            return com.swmansion.gesturehandler.GestureHandler.DIRECTION_LEFT;
    }
}

export class FlingGestureHandler extends Handler<com.swmansion.gesturehandler.FlingGestureHandler, TapGestureHandlerOptions> {
    @nativeProperty numberOfPointers: number;
    @nativeProperty({ converter: { fromNative: directionToString, toNative: directionFromString } }) direction: string;
    createNative(options) {
        return new com.swmansion.gesturehandler.FlingGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.FlingGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            direction: directionToString(handler.getRecognizedDirection()),
        });
    }
}
export class LongPressGestureHandler extends Handler<com.swmansion.gesturehandler.LongPressGestureHandler, LongPressGestureHandlerOptions> {
    @nativeProperty minDurationMs: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) maxDist: number;
    createNative(options) {
        const context = androidApp.context as android.content.Context;
        return new com.swmansion.gesturehandler.LongPressGestureHandler(context);
    }
    // getExtraData(handler: com.swmansion.gesturehandler.LongPressGestureHandler) {
    //     return Object.assign(super.getExtraData(handler), {
    //         x: layout.toDeviceIndependentPixels(handler.getLastRelativePositionX()),
    //         y: layout.toDeviceIndependentPixels(handler.getLastRelativePositionY()),
    //         absoluteX: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionX()),
    //         absoluteY: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionY())
    //     });
    // }
}
export class RotationGestureHandler extends Handler<com.swmansion.gesturehandler.RotationGestureHandler, RotationGestureHandlerOptions> {
    createNative(options) {
        return new com.swmansion.gesturehandler.RotationGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.RotationGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            rotation: handler.getRotation(),
            anchorX: layout.toDeviceIndependentPixels(handler.getAnchorX()),
            anchorY: layout.toDeviceIndependentPixels(handler.getAnchorY()),
            velocity: handler.getVelocity(),
        });
    }
}

export class NativeViewGestureHandler extends Handler<com.swmansion.gesturehandler.NativeViewGestureHandler, NativeViewGestureHandlerOptions> {
    @nativeProperty shouldActivateOnStart: boolean;
    @nativeProperty disallowInterruption: boolean;
    createNative(options) {
        return new com.swmansion.gesturehandler.NativeViewGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.NativeViewGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            pointerInside: handler.isWithinBounds(),
        });
    }
}

export class Manager extends ManagerBase {
    _interactionManager: com.nativescript.gesturehandler.GestureHandlerInteractionController;
    configureInteractions<T extends com.swmansion.gesturehandler.GestureHandler<any>, U extends HandlerOptions>(handler: Handler<T, U>, options: U = {} as any) {
        this.interactionManager.configureInteractions(handler.getNative(), options.waitFor, options.simultaneousHandlers);
    }
    get interactionManager() {
        if (!this._interactionManager) {
            // initGestureHandlerInteractionController();
            this._interactionManager = new com.nativescript.gesturehandler.GestureHandlerInteractionController();
        }
        return this._interactionManager;
    }

    static sManager: Manager;
    static getInstance() {
        if (!Manager.sManager) {
            Manager.sManager = new Manager();
        }
        return Manager.sManager;
    }
    createGestureHandler<T extends HandlerType>(handlerName: T, handlerTag: number, config?: OptionsTypeMap[T]): TypeMap[T] {
        let handler: Handler<any, any> = null;
        switch (handlerName) {
            case 'tap':
                handler = new TapGestureHandler(config);
                break;
            case 'pan':
                handler = new PanGestureHandler(config);
                break;
            case 'nativeView':
                handler = new NativeViewGestureHandler(config);
                break;
            case 'pinch':
                handler = new PinchGestureHandler(config);
                break;
            case 'fling':
                handler = new FlingGestureHandler(config);
                break;
            case 'rotation':
                handler = new RotationGestureHandler(config);
                break;
            case 'longPress':
                handler = new LongPressGestureHandler(config);
                break;
        }
        if (handler) {
            handler.manager = new WeakRef(this);
            handler.setTag(handlerTag);
        }
        return handler as any;
    }
    attachGestureHandlerToView(handler: Handler<any, any>, view: View) {
        const nHandler = handler.getNative();
        if (nHandler) {
            const page = view.page as PageGestureExtended;
            if (page) {
                const registry = page.registry;
                if (registry) {
                    registry.registerHandler(nHandler);
                    registry.attachHandlerToView(nHandler.getTag(), view.nativeView);
                }
            } else {
                throw new Error('a page is needed to attach a gesture');
            }
        }
    }

    detachGestureHandlerFromView(handler: Handler<any, any>, view: View) {
        const nHandler = handler.getNative();
        if (nHandler) {
            const registry = view.page && (view.page as PageGestureExtended).registry;
            if (registry) {
                registry.dropHandler(handler.getNative());
            }
        }
    }

    viewListeners = new Map<View, Map<number, { init: () => void; dispose: () => void }>>();
    attachGestureHandler(handler: Handler<any, any>, view: View) {
        if (view.nativeView) {
            this.attachGestureHandlerToView(handler, view);
        }
        const onInit = () => this.attachGestureHandlerToView(handler, view);
        const onDispose = () => this.detachGestureHandlerFromView(handler, view);
        view.on(ViewInitEvent, onInit, this);
        view.on(ViewDisposeEvent, onDispose, this);
        let viewListeners = this.viewListeners.get(view);
        if (!viewListeners) {
            viewListeners = new Map();
            this.viewListeners.set(view, viewListeners);
        }
        viewListeners.set(handler.getTag(), {
            init: onInit,
            dispose: onDispose,
        });
    }
    detachGestureHandler(handler: Handler<any, any>, view: View) {
        if (view) {
            const viewListeners = this.viewListeners.get(view);
            if (viewListeners) {
                const listeners = viewListeners.get(handler.getTag());
                if (listeners) {
                    view.off(ViewInitEvent, listeners.init, this);
                    view.off(ViewDisposeEvent, () => listeners.dispose, this);
                    viewListeners.delete(handler.getTag());
                    if (viewListeners.size === 0) {
                        this.viewListeners.delete(view);
                    }
                }
            }
        }
        this.detachGestureHandlerFromView(handler, view);
    }
}
