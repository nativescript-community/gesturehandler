import { Observable } from 'tns-core-modules/data/observable';
import { View } from 'tns-core-modules/ui/page/page';
import { HandlerType, OptionsTypeMap, TypeMap } from './gesturehandler.common';

export { GestureState, GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureStateEventData, GestureTouchEventData, HandlerType } from './gesturehandler.common';
// export * from './gesturehandler.ios';

export abstract class BaseNative<T, U extends {}> extends Observable {
    options?: U;
    native: T;
    constructor(options?: U, native?: T);
    initNativeView(native: T, options: U): void;
    getNative(): T;
    log(...args);
}
export interface NativePropertyOptions {
    converter?: {
        fromNative: Function;
        toNative: Function;
    };
    defaultValue?: any;
    nativeGetterName?: string;
    nativeSetterName?: string;
    getConverter?: Function;
    ios?: {
        nativeGetterName?: string;
        nativeSetterName?: string;
    };
    android?: {
        nativeGetterName?: string;
        nativeSetterName?: string;
    };
}

export declare function nativeProperty(target: any, k?, desc?: PropertyDescriptor): any;
export declare function nativeProperty(options: NativePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export declare function nativeProperty(...args);

export interface HandlerOptions {
    [k: string]: any;
    enabled?: boolean;
    shouldCancelWhenOutside?: boolean;
    waitFor?: number[];
    simultaneousHandlers?: number[];
}
export abstract class Handler<T, U extends HandlerOptions> extends BaseNative<T, U> {
    enabled: boolean;
    shouldCancelWhenOutside: boolean;
    setTag(tag: number);
    getTag(): number;
    getView(): any;
    cancel();
    attachToView(view: View);
    detachFromView(view: View);
}
export interface TapGestureHandlerOptions extends HandlerOptions {
    numberOfTaps?: number;
    maxDurationMs?: number;
    maxDelayMs?: number;
    maxDeltaX?: number;
    maxDeltaY?: number;
    maxDist?: number;
    minPointers?: number;
}

export class TapGestureHandler extends Handler<any, TapGestureHandlerOptions> {
    numberOfTaps: number;
    maxDurationMs: number;
    maxDelayMs: number;
    maxDeltaX: number;
    maxDeltaY: number;
    maxDist: number;
    minPointers: number;
}
export interface PanGestureHandlerOptions extends HandlerOptions {
    minDist?: number;
    activeOffsetXStart?: number;
    activeOffsetXEnd?: number;
    failOffsetXStart?: number;
    failOffsetXEnd?: number;
    activeOffsetYStart?: number;
    activeOffsetYEnd?: number;
    failOffsetYStart?: number;
    failOffsetYEnd?: number;
}

export class PanGestureHandler extends Handler<any, PanGestureHandlerOptions> {
    minDist: number;
    activeOffsetXStart: number;
    activeOffsetXEnd: number;
    failOffsetXStart: number;
    failOffsetXEnd: number;
    activeOffsetYStart: number;
    activeOffsetYEnd: number;
    failOffsetYStart: number;
    failOffsetYEnd: number;
}
export interface NativeViewGestureHandlerOptions extends HandlerOptions {
    shouldActivateOnStart?: boolean;
    disallowInterruption?: boolean;
}
export class NativeViewGestureHandler extends Handler<any, NativeViewGestureHandlerOptions> {
    shouldActivateOnStart: boolean;
    disallowInterruption: boolean;
}
export interface LongPressGestureHandlerOptions extends HandlerOptions {
    maxDist?: number;
    minDurationMs?: number;
}
export class LongPressGestureHandler extends Handler<any, LongPressGestureHandlerOptions> {
    maxDist: number;
    minDurationMs: number;
}
export interface FlingGestureHandlerOptions extends HandlerOptions {
    numberOfPointers?: number;
    direction?: string;
}
export class FlingGestureHandler extends Handler<any, FlingGestureHandlerOptions> {
    numberOfPointers: number;
    direction: string;
}
export interface PinchGestureHandlerOptions extends HandlerOptions {}
export class PinchGestureHandler extends Handler<any, PinchGestureHandlerOptions> {}
export interface RotationGestureHandlerOptions extends HandlerOptions {}
export class RotationGestureHandler extends Handler<any, RotationGestureHandlerOptions> {}

export interface ForceTouchGestureHandlerOptions extends HandlerOptions {
    minForce?: number;
    maxForce?: number;
}
export class ForceTouchGestureHandler extends Handler<any, ForceTouchGestureHandlerOptions> {
    minForce: number;
    maxForce: number;
}

export class Manager extends Observable {
    static getInstance(): Manager;
    createGestureHandler<T extends HandlerType>(handlerName: T, handlerTag: number, config?: OptionsTypeMap[T]): TypeMap[T];
}
export function install();
