
declare module com {
	export module swmansion {
		export module gesturehandler {
			export abstract class BaseGestureHandlerInteractionController extends com.swmansion.gesturehandler.GestureHandlerInteractionController {
				public static class: java.lang.Class<com.swmansion.gesturehandler.BaseGestureHandlerInteractionController>;
				public shouldRecognizeSimultaneously(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldRequireHandlerToWaitForFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldHandlerBeCancelledBy(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldWaitForHandlerFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public constructor();
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class BuildConfig {
				public static class: java.lang.Class<com.swmansion.gesturehandler.BuildConfig>;
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

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class FlingGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.FlingGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.FlingGestureHandler>;
				public onReset(): void;
				public setDirection(param0: number): void;
				public onCancel(): void;
				public setNumberOfPointersRequired(param0: number): void;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public constructor();
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class GestureHandler<T>  extends java.lang.Object {
				public static class: java.lang.Class<com.swmansion.gesturehandler.GestureHandler<any>>;
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
				public shouldWaitForHandlerFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public handle(param0: globalAndroid.view.MotionEvent): void;
				public setHitSlop(param0: number): T;
				public getTag(): number;
				public isWithinBounds(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public getLastRelativePositionX(): number;
				public constructor();
				public end(): void;
				public prepare(param0: globalAndroid.view.View, param1: com.swmansion.gesturehandler.GestureHandlerOrchestrator): void;
				public reset(): void;
				public setEnabled(param0: boolean): T;
				public stopTrackingPointer(param0: number): void;
				public setInteractionController(param0: com.swmansion.gesturehandler.GestureHandlerInteractionController): T;
				public getX(): number;
				public startTrackingPointer(param0: number): void;
				public activate(): void;
				public shouldBeCancelledBy(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public cancel(): void;
				public getLastAbsolutePositionY(): number;
				public static stateToString(param0: number): string;
				public setTag(param0: number): void;
				public getNumberOfPointers(): number;
				public hasCommonPointers(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldRequireToWaitForFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public toString(): string;
				public begin(): void;
				public setShouldCancelWhenOutside(param0: boolean): T;
				public wantEvents(): boolean;
				public onReset(): void;
				public setOnTouchEventListener(param0: com.swmansion.gesturehandler.OnTouchEventListener<T>): com.swmansion.gesturehandler.GestureHandler<any>;
				public getState(): number;
				public fail(): void;
				public isEnabled(): boolean;
				public onStateChange(param0: number, param1: number): void;
				public getLastRelativePositionY(): number;
				public shouldRecognizeSimultaneously(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public setHitSlop(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): T;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class GestureHandlerInteractionController {
				public static class: java.lang.Class<com.swmansion.gesturehandler.GestureHandlerInteractionController>;
				/**
				 * Constructs a new instance of the com.swmansion.gesturehandler.GestureHandlerInteractionController interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					shouldWaitForHandlerFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
					shouldRequireHandlerToWaitForFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
					shouldRecognizeSimultaneously(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
					shouldHandlerBeCancelledBy(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				});
				public constructor();
				public shouldRecognizeSimultaneously(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldRequireHandlerToWaitForFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldHandlerBeCancelledBy(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldWaitForHandlerFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>, param1: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class GestureHandlerOrchestrator {
				public static class: java.lang.Class<com.swmansion.gesturehandler.GestureHandlerOrchestrator>;
				public deliverEventToGestureHandlers(param0: globalAndroid.view.MotionEvent): void;
				public setMinimumAlphaForTraversal(param0: number): void;
				public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
				public constructor(param0: globalAndroid.view.ViewGroup, param1: com.swmansion.gesturehandler.GestureHandlerRegistry, param2: com.swmansion.gesturehandler.ViewConfigurationHelper);
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class GestureHandlerRegistry {
				public static class: java.lang.Class<com.swmansion.gesturehandler.GestureHandlerRegistry>;
				/**
				 * Constructs a new instance of the com.swmansion.gesturehandler.GestureHandlerRegistry interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getHandlersForView(param0: globalAndroid.view.View): java.util.ArrayList<com.swmansion.gesturehandler.GestureHandler<any>>;
				});
				public constructor();
				public getHandlersForView(param0: globalAndroid.view.View): java.util.ArrayList<com.swmansion.gesturehandler.GestureHandler<any>>;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class GestureHandlerRegistryImpl extends com.swmansion.gesturehandler.GestureHandlerRegistry {
				public static class: java.lang.Class<com.swmansion.gesturehandler.GestureHandlerRegistryImpl>;
				public getHandlersForView(param0: globalAndroid.view.View): java.util.ArrayList<com.swmansion.gesturehandler.GestureHandler<any>>;
				public attachHandlerToView( handlerTag: number,  view: globalAndroid.view.View): boolean
				public registerHandler( handler: com.swmansion.gesturehandler.GestureHandler<any>)
				public dropHandler( handlerTag: number)
				public getHandler( handlerTag: number)
				public detachHandler( handler: com.swmansion.gesturehandler.GestureHandler<any>)
				public getHandlersForView( view:globalAndroid.view.View )
				public registerHandlerForView(param0: globalAndroid.view.View, param1: com.swmansion.gesturehandler.GestureHandler<any>): com.swmansion.gesturehandler.GestureHandler<any>;
				public constructor();
				public dropAllHandlers()
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class GestureUtils {
				public static class: java.lang.Class<com.swmansion.gesturehandler.GestureUtils>;
				public static getLastPointerX(param0: globalAndroid.view.MotionEvent, param1: boolean): number;
				public constructor();
				public static getLastPointerY(param0: globalAndroid.view.MotionEvent, param1: boolean): number;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class LongPressGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.LongPressGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.LongPressGestureHandler>;
				public setMinDurationMs(param0: number): void;
				public setMaxDist(param0: number): com.swmansion.gesturehandler.LongPressGestureHandler;
				public constructor(param0: globalAndroid.content.Context);
				public onStateChange(param0: number, param1: number): void;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public constructor();
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class NativeViewGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.NativeViewGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.NativeViewGestureHandler>;
				public setDisallowInterruption(param0: boolean): com.swmansion.gesturehandler.NativeViewGestureHandler;
				public onCancel(): void;
				public shouldRequireToWaitForFailure(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public shouldBeCancelledBy(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public setShouldActivateOnStart(param0: boolean): com.swmansion.gesturehandler.NativeViewGestureHandler;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public shouldRecognizeSimultaneously(param0: com.swmansion.gesturehandler.GestureHandler<any>): boolean;
				public constructor();
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class OnTouchEventListener<T>  extends java.lang.Object {
				public static class: java.lang.Class<com.swmansion.gesturehandler.OnTouchEventListener<any>>;
				/**
				 * Constructs a new instance of the com.swmansion.gesturehandler.OnTouchEventListener<any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					onTouchEvent(param0: T, param1: globalAndroid.view.MotionEvent): void;
					onStateChange(param0: T, param1: number, param2: number): void;
				});
				public constructor();
				public onStateChange(param0: T, param1: number, param2: number): void;
				public onTouchEvent(param0: T, param1: globalAndroid.view.MotionEvent): void;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class PanGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.PanGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.PanGestureHandler>;
				public setMinDist(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public setActiveOffsetYStart(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public setFailOffsetYStart(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public setActiveOffsetYEnd(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public getVelocityY(): number;
				public setFailOffsetYEnd(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public setAverageTouches(param0: boolean): com.swmansion.gesturehandler.PanGestureHandler;
				public setMinVelocityY(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public setFailOffsetXStart(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public getTranslationY(): number;
				public setMinPointers(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public setMaxPointers(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public constructor();
				public onReset(): void;
				public setMinVelocity(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public getVelocityX(): number;
				public setActiveOffsetXEnd(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public constructor(param0: globalAndroid.content.Context);
				public setFailOffsetXEnd(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public getTranslationX(): number;
				public setActiveOffsetXStart(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
				public setMinVelocityX(param0: number): com.swmansion.gesturehandler.PanGestureHandler;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class PinchGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.PinchGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.PinchGestureHandler>;
				public onReset(): void;
				public getScale(): number;
				public getVelocity(): number;
				public getFocalPointX(): number;
				public getFocalPointY(): number;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public constructor();
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class PointerEvents {
				public static class: java.lang.Class<com.swmansion.gesturehandler.PointerEvents>;
				public static NONE: com.swmansion.gesturehandler.PointerEvents;
				public static BOX_NONE: com.swmansion.gesturehandler.PointerEvents;
				public static BOX_ONLY: com.swmansion.gesturehandler.PointerEvents;
				public static AUTO: com.swmansion.gesturehandler.PointerEvents;
				public static valueOf(param0: string): com.swmansion.gesturehandler.PointerEvents;
				public static values(): native.Array<com.swmansion.gesturehandler.PointerEvents>;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class PointerEventsConfig {
				public static class: java.lang.Class<com.swmansion.gesturehandler.PointerEventsConfig>;
				public static NONE: com.swmansion.gesturehandler.PointerEventsConfig;
				public static BOX_NONE: com.swmansion.gesturehandler.PointerEventsConfig;
				public static BOX_ONLY: com.swmansion.gesturehandler.PointerEventsConfig;
				public static AUTO: com.swmansion.gesturehandler.PointerEventsConfig;
				public static values(): native.Array<com.swmansion.gesturehandler.PointerEventsConfig>;
				public static valueOf(param0: string): com.swmansion.gesturehandler.PointerEventsConfig;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class PointerEventsSpec {
				public static class: java.lang.Class<com.swmansion.gesturehandler.PointerEventsSpec>;
				public static NONE: com.swmansion.gesturehandler.PointerEventsSpec;
				public static BOX_NONE: com.swmansion.gesturehandler.PointerEventsSpec;
				public static BOX_ONLY: com.swmansion.gesturehandler.PointerEventsSpec;
				public static AUTO: com.swmansion.gesturehandler.PointerEventsSpec;
				public static valueOf(param0: string): com.swmansion.gesturehandler.PointerEventsSpec;
				public static values(): native.Array<com.swmansion.gesturehandler.PointerEventsSpec>;
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class RotationGestureDetector {
				public static class: java.lang.Class<com.swmansion.gesturehandler.RotationGestureDetector>;
				public getAnchorX(): number;
				public getTimeDelta(): number;
				public getRotation(): number;
				public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
				public constructor(param0: com.swmansion.gesturehandler.RotationGestureDetector.OnRotationGestureListener);
				public getAnchorY(): number;
			}
			export module RotationGestureDetector {
				export class OnRotationGestureListener {
					public static class: java.lang.Class<com.swmansion.gesturehandler.RotationGestureDetector.OnRotationGestureListener>;
					/**
					 * Constructs a new instance of the com.swmansion.gesturehandler.RotationGestureDetector$OnRotationGestureListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onRotation(param0: com.swmansion.gesturehandler.RotationGestureDetector): boolean;
						onRotationBegin(param0: com.swmansion.gesturehandler.RotationGestureDetector): boolean;
						onRotationEnd(param0: com.swmansion.gesturehandler.RotationGestureDetector): void;
					});
					public constructor();
					public onRotation(param0: com.swmansion.gesturehandler.RotationGestureDetector): boolean;
					public onRotationBegin(param0: com.swmansion.gesturehandler.RotationGestureDetector): boolean;
					public onRotationEnd(param0: com.swmansion.gesturehandler.RotationGestureDetector): void;
				}
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class RotationGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.RotationGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.RotationGestureHandler>;
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

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class TapGestureHandler extends com.swmansion.gesturehandler.GestureHandler<com.swmansion.gesturehandler.TapGestureHandler> {
				public static class: java.lang.Class<com.swmansion.gesturehandler.TapGestureHandler>;
				public onReset(): void;
				public setMaxDelayMs(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public setMaxDx(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public setMaxDy(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public onCancel(): void;
				public setNumberOfTaps(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public setMaxDist(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public setMinNumberOfPointers(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public onHandle(param0: globalAndroid.view.MotionEvent): void;
				public setMaxDurationMs(param0: number): com.swmansion.gesturehandler.TapGestureHandler;
				public constructor();
			}
		}
	}
}

declare module com {
	export module swmansion {
		export module gesturehandler {
			export class ViewConfigurationHelper {
				public static class: java.lang.Class<com.swmansion.gesturehandler.ViewConfigurationHelper>;
				/**
				 * Constructs a new instance of the com.swmansion.gesturehandler.ViewConfigurationHelper interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getPointerEventsConfigForView(param0: globalAndroid.view.View): com.swmansion.gesturehandler.PointerEventsConfig;
					getChildInDrawingOrderAtIndex(param0: globalAndroid.view.ViewGroup, param1: number): globalAndroid.view.View;
					isViewClippingChildren(param0: globalAndroid.view.ViewGroup): boolean;
				});
				public constructor();
				public getPointerEventsConfigForView(param0: globalAndroid.view.View): com.swmansion.gesturehandler.PointerEventsConfig;
				public isViewClippingChildren(param0: globalAndroid.view.ViewGroup): boolean;
				public getChildInDrawingOrderAtIndex(param0: globalAndroid.view.ViewGroup, param1: number): globalAndroid.view.View;
			}
		}
	}
}

//Generics information:
//com.swmansion.gesturehandler.GestureHandler:1
//com.swmansion.gesturehandler.OnTouchEventListener:1

