import Observable from 'nativescript-observable';
import { EventData } from '@nativescript/core/data/observable';
import { View } from '@nativescript/core/ui/core/view';
import {
    FlingGestureHandler,
    FlingGestureHandlerOptions,
    ForceTouchGestureHandler,
    ForceTouchGestureHandlerOptions,
    Handler,
    HandlerOptions,
    LongPressGestureHandler,
    LongPressGestureHandlerOptions,
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
import { isAndroid } from '@nativescript/core/platform/platform';

export const GestureHandlerStateEvent = 'GestureHandlerStateEvent';
export const GestureHandlerTouchEvent = 'GestureHandlerTouchEvent';

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
    // console.log('createGetter', key, options);
    const nativeGetterName = ((isAndroid ? options.android : options.ios) || options).nativeGetterName || 'get' + key.charAt(0).toUpperCase() + key.slice(1);
    const converter = options.converter;
    return function() {
        let result;
        // console.log('getter', key, nativeGetterName);
        if (this.native && this.native[nativeGetterName]) {
            result = this.native[nativeGetterName]();
        } else {
            result = this.options[key] || options.defaultValue;
        }
        result = converter && converter.fromNative ? converter.fromNative.call(this, result, key) : result;
        // console.log('getter', key, options, nativeGetterName, !!getConverter, result);
        return result;
    };
}
function createSetter(key, options: NativePropertyOptions) {
    const nativeSetterName = ((isAndroid ? options.android : options.ios) || options).nativeSetterName || 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    return function(newVal) {
        this.options[key] = newVal;
        if (this.native && this.native[nativeSetterName]) {
            const actualVal = options.converter && options.converter.toNative ? options.converter.toNative.call(this, newVal, key) : newVal;
            console.log('setter', key, newVal, Array.isArray(newVal), typeof newVal, actualVal, nativeSetterName, options.converter, this.native && this.native[nativeSetterName]);
            (this.native[nativeSetterName] as Function).call(this.native, ...actualVal);
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
        return function(target: any, key?: string, descriptor?: PropertyDescriptor) {
            return nativePropertyGenerator(target, key, args[0] || {});
        };
    } else {
        const options = typeof args[1] === 'string' ? undefined : args[0];
        const startIndex = !!options ? 1 : 0;
        return nativePropertyGenerator(args[startIndex], args[startIndex + 1], options || {});
    }
}
export abstract class BaseNative<T, U extends {}> extends Observable {
    constructor(public options?: U, native?: T) {
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
    getNative = () => {
        if (!this.native) {
            this.native = this.createNative(this.options);
            this.initNativeView(this.native, this.options);
        }
        return this.native;
    };
    abstract createNative(options: U): T;

    log(...args) {
        console.log(`[${this.constructor.name}]`, ...args);
    }
}

export abstract class Manager extends Observable {
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
        view?: View; // native View
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

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);

            if (name === 'constructor') return;
            if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            } else {
                const oldImpl = derivedCtor.prototype[name];
                if (!oldImpl) {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                } else {
                    derivedCtor.prototype[name] = function(...args) {
                        oldImpl.apply(this, args);
                        baseCtor.prototype[name].apply(this, args);
                    };
                }
            }
        });
        Object.getOwnPropertySymbols(baseCtor.prototype).forEach(symbol => {
            const oldImpl: Function = derivedCtor.prototype[symbol];
            if (!oldImpl) {
                derivedCtor.prototype[symbol] = baseCtor.prototype[symbol];
            } else {
                derivedCtor.prototype[symbol] = function(...args) {
                    oldImpl.apply(this, args);
                    baseCtor.prototype[symbol].apply(this, args);
                };
            }
        });
    });
}
export const ViewInitEvent = 'ViewInitEvent';
export const ViewDisposeEvent = 'ViewDisposeEvent';
class ViewGestureExtended extends View {
    initNativeView() {
        // console.log(this.constructor.name, 'initNativeView', this.nativeView);
        if (this.nativeView) {
            this.nativeView.nsView = new WeakRef(this);
        }

        this.notify({ eventName: ViewInitEvent, object: this });
    }
    disposeNativeView() {
        // console.log(this.constructor.name, 'disposeNativeView', this.nativeView);
        if (this.nativeView) {
            this.nativeView.nsView = null;
        }
        // console.log('disposeNativeView', this);
        this.notify({ eventName: ViewDisposeEvent, object: this });
    }
}
export function overrideViewBase() {
    const NSView = require('@nativescript/core/ui/core/view').View;
    applyMixins(NSView, [ViewGestureExtended]);
}

export function install() {
    overrideViewBase();
}
