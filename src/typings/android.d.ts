/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable no-redeclare */

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export abstract class BaseGestureHandlerInteractionController extends GestureHandlerInteractionController {
                public static class: java.lang.Class<BaseGestureHandlerInteractionController>;
                public shouldRecognizeSimultaneously(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public shouldRequireHandlerToWaitForFailure(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public shouldHandlerBeCancelledBy(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public shouldWaitForHandlerFailure(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class BuildConfig {
                public static class: java.lang.Class<BuildConfig>;
                public static DEBUG: boolean;
                public static APPLICATION_ID: string;
                public static BUILD_TYPE: string;
                public static FLAVOR: string;
                public static VERSION_CODE: number;
                public static VERSION_NAME: string;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class FlingGestureHandler extends GestureHandler<FlingGestureHandler> {
                public static class: java.lang.Class<FlingGestureHandler>;
                public onReset(): void;
                public setDirection(param0: number): void;
                public onCancel(): void;
                public setNumberOfPointersRequired(param0: number): void;
                public getRecognizedDirection(): number;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class GestureHandler<T> extends java.lang.Object {
                public static class: java.lang.Class<GestureHandler<any>>;
                public static STATE_UNDETERMINED: number;
                public static STATE_FAILED: number;
                public static STATE_BEGAN: number;
                public static STATE_CANCELLED: number;
                public static STATE_ACTIVE: number;
                public static STATE_END: number;
                public static HIT_SLOP_NONE: number;
                public static DIRECTION_RIGHT: number;
                public static DIRECTION_LEFT: number;
                public static DIRECTION_UP: number;
                public static DIRECTION_DOWN: number;
                public getView(): globalAndroid.view.View;
                public isWithinBounds(): boolean;
                public getLastAbsolutePositionX(): number;
                public onCancel(): void;
                public getY(): number;
                public getYAtIndex(index: number): number;
                public shouldWaitForHandlerFailure(param0: GestureHandler<any>): boolean;
                public handle(param0: globalAndroid.view.MotionEvent): void;
                public setHitSlop(param0: number): T;
                public getTag(): number;
                public isWithinBounds(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public getLastRelativePositionX(): number;
                public constructor();
                public end(): void;
                public prepare(param0: globalAndroid.view.View, param1: GestureHandlerOrchestrator): void;
                public reset(): void;
                public setEnabled(param0: boolean): T;
                public stopTrackingPointer(param0: number): void;
                public setInteractionController(param0: GestureHandlerInteractionController): T;
                public getX(): number;
                public getXAtIndex(index: number): number;
                public startTrackingPointer(param0: number): void;
                public activate(): void;
                public shouldBeCancelledBy(param0: GestureHandler<any>): boolean;
                public cancel(): void;
                public getLastAbsolutePositionY(): number;
                public static stateToString(param0: number): string;
                public setTag(param0: number): void;
                public getNumberOfPointers(): number;
                public hasCommonPointers(param0: GestureHandler<any>): boolean;
                public shouldRequireToWaitForFailure(param0: GestureHandler<any>): boolean;
                public toString(): string;
                public begin(): void;
                public setShouldCancelWhenOutside(param0: boolean): T;
                public wantEvents(event: globalAndroid.view.MotionEvent): boolean;
                public onReset(): void;
                public setOnTouchEventListener(param0: OnTouchEventListener<T>): GestureHandler<any>;
                public getState(): number;
                public fail(): void;
                public isEnabled(): boolean;
                public onStateChange(param0: number, param1: number): void;
                public getLastRelativePositionY(): number;
                public shouldRecognizeSimultaneously(param0: GestureHandler<any>): boolean;
                public setHitSlop(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): T;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class GestureHandlerInteractionController {
                public static class: java.lang.Class<GestureHandlerInteractionController>;
                /**
                 * Constructs a new instance of the com.swmansion.gesturehandler.GestureHandlerInteractionController interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: {
                    shouldWaitForHandlerFailure(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                    shouldRequireHandlerToWaitForFailure(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                    shouldRecognizeSimultaneously(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                    shouldHandlerBeCancelledBy(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                });
                public constructor();
                public shouldRecognizeSimultaneously(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public shouldRequireHandlerToWaitForFailure(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public shouldHandlerBeCancelledBy(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
                public shouldWaitForHandlerFailure(param0: GestureHandler<any>, param1: GestureHandler<any>): boolean;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class GestureHandlerOrchestrator {
                public static class: java.lang.Class<GestureHandlerOrchestrator>;
                public deliverEventToGestureHandlers(param0: globalAndroid.view.MotionEvent): void;
                public setMinimumAlphaForTraversal(param0: number): void;
                public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
                public constructor(param0: globalAndroid.view.ViewGroup, param1: GestureHandlerRegistry, param2: ViewConfigurationHelper);
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class GestureHandlerRegistry {
                public static class: java.lang.Class<GestureHandlerRegistry>;
                /**
                 * Constructs a new instance of the com.swmansion.gesturehandler.GestureHandlerRegistry interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: { getHandlersForView(param0: globalAndroid.view.View): java.util.ArrayList<GestureHandler<any>> });
                public constructor();
                public getHandlersForView(param0: globalAndroid.view.View): java.util.ArrayList<GestureHandler<any>>;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class GestureHandlerRegistryImpl extends GestureHandlerRegistry {
                public static class: java.lang.Class<GestureHandlerRegistryImpl>;
                public getHandlersForView(param0: globalAndroid.view.View): java.util.ArrayList<GestureHandler<any>>;
                public attachHandlerToView(handlerTag: number, view: globalAndroid.view.View): boolean;
                public registerHandler(handler: GestureHandler<any>);
                public dropHandler(handlerTag: number);
                public getHandler(handlerTag: number);
                public detachHandler(handler: GestureHandler<any>);
                public getHandlersForView(view: globalAndroid.view.View);
                public registerHandlerForView(param0: globalAndroid.view.View, param1: GestureHandler<any>): GestureHandler<any>;
                public constructor();
                public dropAllHandlers();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class GestureUtils {
                public static class: java.lang.Class<GestureUtils>;
                public static getLastPointerX(param0: globalAndroid.view.MotionEvent, param1: boolean): number;
                public constructor();
                public static getLastPointerY(param0: globalAndroid.view.MotionEvent, param1: boolean): number;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class LongPressGestureHandler extends GestureHandler<LongPressGestureHandler> {
                public static class: java.lang.Class<LongPressGestureHandler>;
                public setMinDurationMs(param0: number): void;
                public setMaxDist(param0: number): LongPressGestureHandler;
                public constructor(param0: globalAndroid.content.Context);
                public onStateChange(param0: number, param1: number): void;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class NativeViewGestureHandler extends GestureHandler<NativeViewGestureHandler> {
                public static class: java.lang.Class<NativeViewGestureHandler>;
                public setDisallowInterruption(param0: boolean): NativeViewGestureHandler;
                public onCancel(): void;
                public shouldRequireToWaitForFailure(param0: GestureHandler<any>): boolean;
                public shouldBeCancelledBy(param0: GestureHandler<any>): boolean;
                public setShouldActivateOnStart(param0: boolean): NativeViewGestureHandler;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public shouldRecognizeSimultaneously(param0: GestureHandler<any>): boolean;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class OnTouchEventListener<T> extends java.lang.Object {
                public static class: java.lang.Class<OnTouchEventListener<any>>;
                /**
                 * Constructs a new instance of the com.swmansion.gesturehandler.OnTouchEventListener<any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: {
                    shouldStartGesture(param0: T, event: globalAndroid.view.MotionEvent): boolean;
                    onTouchEvent(param0: T, param1: globalAndroid.view.MotionEvent): void;
                    onStateChange(param0: T, param1: number, param2: number): void;
                });
                public constructor();
                public shouldStartGesture(param0: T, event: globalAndroid.view.MotionEvent): boolean;
                public onStateChange(param0: T, param1: number, param2: number): void;
                public onTouchEvent(param0: T, param1: globalAndroid.view.MotionEvent): void;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class PanGestureHandler extends GestureHandler<PanGestureHandler> {
                public static class: java.lang.Class<PanGestureHandler>;
                public setMinDist(param0: number): PanGestureHandler;
                public setActiveOffsetYStart(param0: number): PanGestureHandler;
                public setFailOffsetYStart(param0: number): PanGestureHandler;
                public setActiveOffsetYEnd(param0: number): PanGestureHandler;
                public getVelocityY(): number;
                public setFailOffsetYEnd(param0: number): PanGestureHandler;
                public setAverageTouches(param0: boolean): PanGestureHandler;
                public setMinVelocityY(param0: number): PanGestureHandler;
                public setFailOffsetXStart(param0: number): PanGestureHandler;
                public getTranslationY(): number;
                public setMinPointers(param0: number): PanGestureHandler;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public setMaxPointers(param0: number): PanGestureHandler;
                public constructor();
                public onReset(): void;
                public setMinVelocity(param0: number): PanGestureHandler;
                public getVelocityX(): number;
                public setActiveOffsetXEnd(param0: number): PanGestureHandler;
                public constructor(param0: globalAndroid.content.Context);
                public setFailOffsetXEnd(param0: number): PanGestureHandler;
                public getTranslationX(): number;
                public setActiveOffsetXStart(param0: number): PanGestureHandler;
                public setMinVelocityX(param0: number): PanGestureHandler;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class PinchGestureHandler extends GestureHandler<PinchGestureHandler> {
                public static class: java.lang.Class<PinchGestureHandler>;
                public onReset(): void;
                public getScale(): number;
                public getVelocity(): number;
                public getFocalPointX(): number;
                public getFocalPointY(): number;
                public getMinSpan(): number;
                public setMinSpan(span: number);
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class PointerEvents {
                public static class: java.lang.Class<PointerEvents>;
                public static NONE: PointerEvents;
                public static BOX_NONE: PointerEvents;
                public static BOX_ONLY: PointerEvents;
                public static AUTO: PointerEvents;
                public static valueOf(param0: string): PointerEvents;
                public static values(): native.Array<PointerEvents>;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class PointerEventsConfig {
                public static class: java.lang.Class<PointerEventsConfig>;
                public static NONE: PointerEventsConfig;
                public static BOX_NONE: PointerEventsConfig;
                public static BOX_ONLY: PointerEventsConfig;
                public static AUTO: PointerEventsConfig;
                public static values(): native.Array<PointerEventsConfig>;
                public static valueOf(param0: string): PointerEventsConfig;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class PointerEventsSpec {
                public static class: java.lang.Class<PointerEventsSpec>;
                public static NONE: PointerEventsSpec;
                public static BOX_NONE: PointerEventsSpec;
                public static BOX_ONLY: PointerEventsSpec;
                public static AUTO: PointerEventsSpec;
                public static valueOf(param0: string): PointerEventsSpec;
                public static values(): native.Array<PointerEventsSpec>;
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class RotationGestureDetector {
                public static class: java.lang.Class<RotationGestureDetector>;
                public getAnchorX(): number;
                public getTimeDelta(): number;
                public getRotation(): number;
                public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
                public constructor(param0: RotationGestureDetector.OnRotationGestureListener);
                public getAnchorY(): number;
            }
            export namespace RotationGestureDetector {
                export class OnRotationGestureListener {
                    public static class: java.lang.Class<OnRotationGestureListener>;
                    /**
                     * Constructs a new instance of the com.swmansion.gesturehandler.RotationGestureDetector$OnRotationGestureListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: {
                        onRotation(param0: RotationGestureDetector): boolean;
                        onRotationBegin(param0: RotationGestureDetector): boolean;
                        onRotationEnd(param0: RotationGestureDetector): void;
                    });
                    public constructor();
                    public onRotation(param0: RotationGestureDetector): boolean;
                    public onRotationBegin(param0: RotationGestureDetector): boolean;
                    public onRotationEnd(param0: RotationGestureDetector): void;
                }
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class RotationGestureHandler extends GestureHandler<RotationGestureHandler> {
                public static class: java.lang.Class<RotationGestureHandler>;
                public onReset(): void;
                public getAnchorX(): number;
                public getRotation(): number;
                public getVelocity(): number;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public getAnchorY(): number;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class TapGestureHandler extends GestureHandler<TapGestureHandler> {
                public static class: java.lang.Class<TapGestureHandler>;
                public onReset(): void;
                public setMaxDelayMs(param0: number): TapGestureHandler;
                public setMaxDx(param0: number): TapGestureHandler;
                public setMaxDy(param0: number): TapGestureHandler;
                public onCancel(): void;
                public setNumberOfTaps(param0: number): TapGestureHandler;
                public setMaxDist(param0: number): TapGestureHandler;
                public setMinNumberOfPointers(param0: number): TapGestureHandler;
                public onHandle(param0: globalAndroid.view.MotionEvent): void;
                public setMaxDurationMs(param0: number): TapGestureHandler;
                public constructor();
            }
        }
    }
}

declare namespace com {
    export namespace swmansion {
        export namespace gesturehandler {
            export class ViewConfigurationHelper {
                public static class: java.lang.Class<ViewConfigurationHelper>;
                /**
                 * Constructs a new instance of the com.swmansion.gesturehandler.ViewConfigurationHelper interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: {
                    getPointerEventsConfigForView(param0: globalAndroid.view.View): PointerEventsConfig;
                    getChildInDrawingOrderAtIndex(param0: globalAndroid.view.ViewGroup, param1: number): globalAndroid.view.View;
                    isViewClippingChildren(param0: globalAndroid.view.ViewGroup): boolean;
                });
                public constructor();
                public getPointerEventsConfigForView(param0: globalAndroid.view.View): PointerEventsConfig;
                public isViewClippingChildren(param0: globalAndroid.view.ViewGroup): boolean;
                public getChildInDrawingOrderAtIndex(param0: globalAndroid.view.ViewGroup, param1: number): globalAndroid.view.View;
            }
        }
    }
}

//Generics information:
//com.swmansion.gesturehandler.GestureHandler:1
//com.swmansion.gesturehandler.OnTouchEventListener:1
