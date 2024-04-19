/* eslint-disable no-redeclare */
import Observable from '@nativescript-community/observable';
import { EventData, GridLayout } from '@nativescript/core';
import { CssProperty, Style, View, booleanConverter } from '@nativescript/core/ui';
import {
    FlingGestureHandler,
    FlingGestureHandlerOptions,
    ForceTouchGestureHandler,
    ForceTouchGestureHandlerOptions,
    Handler,
    LongPressGestureHandler,
    LongPressGestureHandlerOptions,
    Manager,
    NativePropertyOptions,
    NativeViewGestureHandler,
    NativeViewGestureHandlerOptions,
    PanGestureHandler,
    PanGestureHandlerOptions,
    PinchGestureHandler,
    PinchGestureHandlerOptions,
    RotationGestureHandler,
    RotationGestureHandlerOptions,
    TapGestureHandler,
    TapGestureHandlerOptions
} from './gesturehandler';

export const GestureHandlerStateEvent = 'GestureHandlerStateEvent';
export const GestureHandlerTouchEvent = 'GestureHandlerTouchEvent';
export const ROOT_GESTURE_HANDLER_TAG = -12345;

export enum HandlerType {
    PAN = 'pan',
    TAP = 'tap',
    FLING = 'fling',
    LONG_PRESS = 'longPress',
    NATIVE_VIEW = 'nativeView',
    PINCH = 'pinch',
    ROTATION = 'rotation',
    FORCE_TOUCH = 'forceTouch'
}

export interface OptionsTypeMap {
    [HandlerType.TAP]: TapGestureHandlerOptions;
    [HandlerType.LONG_PRESS]: LongPressGestureHandlerOptions;
    [HandlerType.PINCH]: PinchGestureHandlerOptions;
    [HandlerType.FLING]: FlingGestureHandlerOptions;
    [HandlerType.PAN]: PanGestureHandlerOptions;
    [HandlerType.ROTATION]: RotationGestureHandlerOptions;
    [HandlerType.NATIVE_VIEW]: NativeViewGestureHandlerOptions;
    [HandlerType.FORCE_TOUCH]: ForceTouchGestureHandlerOptions;
}
export interface TypeMap {
    [HandlerType.TAP]: TapGestureHandler;
    [HandlerType.LONG_PRESS]: LongPressGestureHandler;
    [HandlerType.PINCH]: PinchGestureHandler;
    [HandlerType.FLING]: FlingGestureHandler;
    [HandlerType.PAN]: PanGestureHandler;
    [HandlerType.ROTATION]: RotationGestureHandler;
    [HandlerType.NATIVE_VIEW]: NativeViewGestureHandler;
    [HandlerType.FORCE_TOUCH]: ForceTouchGestureHandler;
}

function createGetter(key: string, options: NativePropertyOptions) {
    const nativeGetterName = ((__ANDROID__ ? options.android : options.ios) || options).nativeGetterName || 'get' + key.charAt(0).toUpperCase() + key.slice(1);
    const converter = options.converter;
    return function () {
        let result;
        if (this.native && this.native[nativeGetterName]) {
            result = this.native[nativeGetterName]();
        } else {
            result = this.options[key] || options.defaultValue;
        }
        result = converter && converter.fromNative ? converter.fromNative.call(this, result, key) : result;
        return result;
    };
}
function createSetter(key, options: NativePropertyOptions) {
    const nativeSetterName = ((__ANDROID__ ? options.android : options.ios) || options).nativeSetterName || 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    return function (newVal) {
        this.options[key] = newVal;
        if (this.native && this.native[nativeSetterName]) {
            const actualVal = options.converter && options.converter.toNative ? options.converter.toNative.call(this, newVal, key) : newVal;
            (this.native[nativeSetterName] as Function).call(this.native, actualVal);
        }
    };
}

function nativePropertyGenerator(target: Object, key: string, options?: NativePropertyOptions) {
    Object.defineProperty(target, key, {
        get: createGetter(key, options),
        set: createSetter(key, options),
        enumerable: true,
        configurable: true
    });
}
export function nativeProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function nativeProperty(options: NativePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function nativeProperty(...args) {
    if (args.length === 1) {
        /// this must be a factory
        return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator(target, key, args[0] || {});
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator(args[startIndex], args[startIndex + 1], options || {});
    }
}
export abstract class BaseNative<T, U extends {}> extends Observable {
    constructor(
        public options?: U,
        native?: T
    ) {
        super();
        if (native) {
            this.native = native;
        }
    }
    native: T;
    initNativeView(native: T, options: U) {
        for (const key in options) {
            (this as any)[key] = options[key];
        }
    }
    disposeNativeView() {
        this.native = null;
    }
    getNative() {
        if (!this.native) {
            this.native = this.createNative(this.options);
            this.initNativeView(this.native, this.options);
        }
        return this.native;
    }
    abstract createNative(options: U): T;
}

export abstract class ManagerBase extends Observable {
    abstract createGestureHandler<T extends HandlerType>(handlerName: T, handlerTag: number, config?: OptionsTypeMap[T]): TypeMap[T];
}

export enum GestureState {
    UNDETERMINED,
    FAILED,
    BEGAN,
    CANCELLED,
    ACTIVE,
    END
}

export interface GestureStateEventData extends EventData {
    object: Handler<any, any>;
    data: {
        state: GestureState;
        prevState: GestureState;
        ios?: any; // native View
        android?: any; // native View
        view: View;
        extraData: {
            [k: string]: number;
        };
    };
}
export interface GestureTouchEventData extends EventData {
    object: Handler<any, any>;
    data: {
        state: GestureState;
        ios?: any; // native View
        android?: any; // native View
        view?: View; // native View
        extraData: {
            [k: string]: number;
        };
    };
}

export class BaseGestureRootView extends GridLayout {}

export function applyMixins(
    derivedCtor: any,
    baseCtors: any[],
    options?: {
        after?: boolean;
        override?: boolean;
        omit?: (string | symbol)[];
    }
) {
    const omits = options && options.omit ? options.omit : [];
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (omits.indexOf(name) !== -1) {
                return;
            }
            const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);

            if (name === 'constructor') return;
            if (descriptor && (!descriptor.writable || !descriptor.configurable || descriptor.get || descriptor.set)) {
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            } else {
                const oldImpl = derivedCtor.prototype[name];
                if (!oldImpl) {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                } else {
                    derivedCtor.prototype[name] = function (...args) {
                        if (options) {
                            if (!!options.override) {
                                return baseCtor.prototype[name].apply(this, args);
                            } else if (!!options.after) {
                                oldImpl.apply(this, args);
                                return baseCtor.prototype[name].apply(this, args);
                            } else {
                                baseCtor.prototype[name].apply(this, args);
                                return oldImpl.apply(this, args);
                            }
                        } else {
                            baseCtor.prototype[name].apply(this, args);
                            return oldImpl.apply(this, args);
                        }
                    };
                }
            }
        });
        Object.getOwnPropertySymbols(baseCtor.prototype).forEach((symbol) => {
            if (omits.indexOf(symbol) !== -1) {
                return;
            }
            const oldImpl: Function = derivedCtor.prototype[symbol];
            if (!oldImpl) {
                derivedCtor.prototype[symbol] = baseCtor.prototype[symbol];
            } else {
                derivedCtor.prototype[symbol] = function (...args) {
                    if (options) {
                        if (!!options.override) {
                            return baseCtor.prototype[symbol].apply(this, args);
                        } else if (!!options.after) {
                            oldImpl.apply(this, args);
                            return baseCtor.prototype[symbol].apply(this, args);
                        } else {
                            baseCtor.prototype[symbol].apply(this, args);
                            return oldImpl.apply(this, args);
                        }
                    } else {
                        baseCtor.prototype[symbol].apply(this, args);
                        return oldImpl.apply(this, args);
                    }
                };
            }
        });
    });
}

export const exclusiveTouchProperty = new CssProperty<Style, boolean>({
    name: 'exclusiveTouch',
    cssName: 'exclusive-touch',
    defaultValue: false,
    valueConverter: booleanConverter
});
export const disallowInterceptTouchProperty = new CssProperty<Style, boolean>({
    name: 'disallowInterceptTouch',
    cssName: 'disallow-intercept-touch',
    defaultValue: false,
    valueConverter: booleanConverter
});
export const ViewInitEvent = 'ViewInitEvent';
export const ViewDisposeEvent = 'ViewDisposeEvent';

let NATIVE_GESTURE_TAG = 74000;
class ViewGestureExtended extends View {
    exclusiveTouchGestureHandler: NativeViewGestureHandler;

    set exclusiveTouch(value) {
        this.style['exclusiveTouch'] = value;
    }
    get exclusiveTouch() {
        return this.style['exclusiveTouch'];
    }
    initNativeView() {
        if (this.nativeView) {
            this.nativeView.nsView = new WeakRef(this);
        }
        this.notify({ eventName: ViewInitEvent, object: this });
    }
    disposeNativeView() {
        if (this.nativeView) {
            this.nativeView.nsView = null;
        }
        if (this.exclusiveTouchGestureHandler) {
            this.exclusiveTouchGestureHandler.detachFromView();
            this.exclusiveTouchGestureHandler = null;
        }
        this.notify({ eventName: ViewDisposeEvent, object: this });
    }
    [exclusiveTouchProperty.setNative](value: boolean) {
        if (value) {
            if (!this.exclusiveTouchGestureHandler) {
                const gestureHandler = Manager.getInstance().createGestureHandler(HandlerType.NATIVE_VIEW, NATIVE_GESTURE_TAG++, {
                    disallowInterruption: true,
                    shouldActivateOnStart: false,
                    shouldCancelWhenOutside: false
                });
                this.exclusiveTouchGestureHandler = gestureHandler as any;
            }
            this.exclusiveTouchGestureHandler.attachToView(this);
        } else if (this.exclusiveTouchGestureHandler) {
            this.exclusiveTouchGestureHandler.detachFromView();
        }
    }
    onTouch(event) {
        if (__ANDROID__) {
            const mask = event.android.getActionMasked();
            if (mask === 0 /* android.view.MotionEvent.ACTION_DOWN */) {
                this.nativeViewProtected.requestDisallowInterceptTouchEvent(true);
            } else if (mask === 3 /* android.view.MotionEvent.ACTION_CANCEL */ || mask === 1 /* android.view.MotionEvent.ACTION_UP */) {
                this.nativeViewProtected.requestDisallowInterceptTouchEvent(false);
            }
        }
    }
    disallowInterceptTouchEventRegistered = false;
    [disallowInterceptTouchProperty.setNative](value) {
        if (__ANDROID__) {
            if (value) {
                if (!this.disallowInterceptTouchEventRegistered) {
                    this.disallowInterceptTouchEventRegistered = true;
                    this.on('touch', this.onTouch, this);
                }
            } else if (this.disallowInterceptTouchEventRegistered) {
                this.disallowInterceptTouchEventRegistered = false;
                this.off('touch', this.onTouch, this);
            }
        }
    }
}

exclusiveTouchProperty.register(Style);
disallowInterceptTouchProperty.register(Style);

let installed = false;
export function overrideViewBase() {
    const NSView = require('@nativescript/core/ui/core/view').View;
    applyMixins(NSView, [ViewGestureExtended]);
}

export function install(overrideNGestures?: boolean) {
    if (installed) {
        return;
    }
    installed = true;
    overrideViewBase();
}
