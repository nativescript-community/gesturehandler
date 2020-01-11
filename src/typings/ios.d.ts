
declare class DummyGestureRecognizer extends UIGestureRecognizer {

	static alloc(): DummyGestureRecognizer; // inherited from NSObject

	static new(): DummyGestureRecognizer; // inherited from NSObject
}

declare class FlingGestureHandler extends GestureHandler {

	static alloc(): FlingGestureHandler; // inherited from NSObject

	static new(): FlingGestureHandler; // inherited from NSObject
}

declare class ForceTouchHandler extends GestureHandler {

	static alloc(): ForceTouchHandler; // inherited from NSObject

	static new(): ForceTouchHandler; // inherited from NSObject
}

declare class GestureHandler extends NSObject implements UIGestureRecognizerDelegate {

	static alloc(): GestureHandler; // inherited from NSObject

	static findGestureHandlerByRecognizer(recognizer: UIGestureRecognizer): GestureHandler;

	static new(): GestureHandler; // inherited from NSObject

	delegate: GestureHandlerDelegate;

	emitter: GestureHandlerEventEmitter;

	enabled: boolean;

	readonly recognizer: UIGestureRecognizer;

	shouldCancelWhenOutside: boolean;

	readonly tag: number;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { tag: number; });

	bindToView(view: UIView): void;

	class(): typeof NSObject;

	configure(config: NSDictionary<any, any>): void;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	containsPointInView(): boolean;

	eventExtraData(recognizer: any): GestureHandlerEventExtraData;

	gestureRecognizerShouldBeRequiredToFailByGestureRecognizer(gestureRecognizer: UIGestureRecognizer, otherGestureRecognizer: UIGestureRecognizer): boolean;

	gestureRecognizerShouldBegin(gestureRecognizer: UIGestureRecognizer): boolean;

	gestureRecognizerShouldReceivePress(gestureRecognizer: UIGestureRecognizer, press: UIPress): boolean;

	gestureRecognizerShouldReceiveTouch(gestureRecognizer: UIGestureRecognizer, touch: UITouch): boolean;

	gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer(gestureRecognizer: UIGestureRecognizer, otherGestureRecognizer: UIGestureRecognizer): boolean;

	gestureRecognizerShouldRequireFailureOfGestureRecognizer(gestureRecognizer: UIGestureRecognizer, otherGestureRecognizer: UIGestureRecognizer): boolean;

	handleGesture(recognizer: any): void;

	initWithTag(tag: number): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	reset(): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	sendEventsInStateForViewWithExtraData(state: GestureHandlerState, view: UIView, extraData: GestureHandlerEventExtraData): void;

	state(): GestureHandlerState;

	unbindFromView(): void;
}

interface GestureHandlerDelegate {

	gestureHandlerDidChangeStatePrevStateExtraDataView(handler: GestureHandler, state: GestureHandlerState, prevState: GestureHandlerState, extraData: GestureHandlerEventExtraData, view: UIView): void;

	gestureHandlerTouchEventOnViewStateExtraData(handler: GestureHandler, view: UIView, state: GestureHandlerState, extraData: GestureHandlerEventExtraData): void;
}
declare var GestureHandlerDelegate: {

	prototype: GestureHandlerDelegate;
};

declare const enum GestureHandlerDirection {

	Right = 1,

	Left = 2,

	Up = 4,

	Down = 8
}

declare class GestureHandlerEvent extends NSObject {

	static alloc(): GestureHandlerEvent; // inherited from NSObject

	static new(): GestureHandlerEvent; // inherited from NSObject

	readonly view: UIView;

	constructor(o: { view: UIView; handlerTag: number; state: GestureHandlerState; extraData: GestureHandlerEventExtraData; });

	initWithViewHandlerTagStateExtraData(view: UIView, handlerTag: number, state: GestureHandlerState, extraData: GestureHandlerEventExtraData): this;
}

interface GestureHandlerEventEmitter {

	sendStateChangeEvent(event: GestureHandlerStateChange): void;

	sendTouchEvent(event: GestureHandlerEvent): void;
}
declare var GestureHandlerEventEmitter: {

	prototype: GestureHandlerEventEmitter;
};

declare class GestureHandlerEventExtraData extends NSDictionary<any, any> {

	// static alloc(): GestureHandlerEventExtraData; // inherited from NSObject

	// static forForceForPositionWithAbsolutePositionWithNumberOfTouches(force: number, position: CGPoint, absolutePosition: CGPoint, numberOfTouches: number): GestureHandlerEventExtraData;

	// static forPanWithAbsolutePositionWithTranslationWithVelocityWithNumberOfTouches(position: CGPoint, absolutePosition: CGPoint, translation: CGPoint, velocity: CGPoint, numberOfTouches: number): GestureHandlerEventExtraData;

	// static forPinchWithFocalPointWithVelocityWithNumberOfTouches(scale: number, focalPoint: CGPoint, velocity: number, numberOfTouches: number): GestureHandlerEventExtraData;

	// static forPointerInside(pointerInside: boolean): GestureHandlerEventExtraData;

	// static forPositionWithAbsolutePositionWithNumberOfTouches(position: CGPoint, absolutePosition: CGPoint, numberOfTouches: number): GestureHandlerEventExtraData;

	// static forRotationWithAnchorPointWithVelocityWithNumberOfTouches(rotation: number, anchorPoint: CGPoint, velocity: number, numberOfTouches: number): GestureHandlerEventExtraData;

	// static new(): GestureHandlerEventExtraData; // inherited from NSObject

	// readonly data: NSDictionary<any, any>;

	// constructor(o: { data: NSDictionary<any, any>; });

	// initWithData(data: NSDictionary<any, any>): this;
}

declare class GestureHandlerManager extends NSObject {

	static alloc(): GestureHandlerManager; // inherited from NSObject

	static new(): GestureHandlerManager; // inherited from NSObject

	attachGestureHandlerToView(handlerTag: number, view: UIView): void;

	createGestureHandlerTagConfig(handlerName: string, handlerTag: number, config: NSDictionary<any, any>): GestureHandler;

	dropGestureHandler(handlerTag: number): void;

	updateGestureHandlerConfig(handlerTag: number, config: NSDictionary<any, any>): void;
}

declare class GestureHandlerRegistry extends NSObject {

	static alloc(): GestureHandlerRegistry; // inherited from NSObject

	static new(): GestureHandlerRegistry; // inherited from NSObject

	attachHandlerWithTagToView(handlerTag: number, view: UIView): void;

	dropHandlerWithTag(handlerTag: number): void;

	handlerWithTag(handlerTag: number): GestureHandler;

	registerGestureHandler(gestureHandler: GestureHandler): void;
}

declare const enum GestureHandlerState {

	Undetermined = 0,

	Failed = 1,

	Began = 2,

	Cancelled = 3,

	Active = 4,

	End = 5
}

declare class GestureHandlerStateChange extends NSObject {

	static alloc(): GestureHandlerStateChange; // inherited from NSObject

	static new(): GestureHandlerStateChange; // inherited from NSObject

	readonly view: UIView;

	constructor(o: { view: UIView; handlerTag: number; state: GestureHandlerState; prevState: GestureHandlerState; extraData: GestureHandlerEventExtraData; });

	initWithViewHandlerTagStatePrevStateExtraData(view: UIView, handlerTag: number, state: GestureHandlerState, prevState: GestureHandlerState, extraData: GestureHandlerEventExtraData): this;
}

declare class LongPressGestureHandler extends GestureHandler {

	static alloc(): LongPressGestureHandler; // inherited from NSObject

	static new(): LongPressGestureHandler; // inherited from NSObject
}

declare class NativeViewGestureHandler extends GestureHandler {

	static alloc(): NativeViewGestureHandler; // inherited from NSObject

	static new(): NativeViewGestureHandler; // inherited from NSObject
}

declare class PanGestureHandler extends GestureHandler {

	static alloc(): PanGestureHandler; // inherited from NSObject

	static new(): PanGestureHandler; // inherited from NSObject
}

declare class PinchGestureHandler extends GestureHandler {

	static alloc(): PinchGestureHandler; // inherited from NSObject

	static new(): PinchGestureHandler; // inherited from NSObject
}

interface RootViewGestureRecognizerDelegate extends UIGestureRecognizerDelegate {

	gestureRecognizerDidActivateInRootView(gestureRecognizer: UIGestureRecognizer, rootView: UIView): void;
}
declare var RootViewGestureRecognizerDelegate: {

	prototype: RootViewGestureRecognizerDelegate;
};

declare class RotationGestureHandler extends GestureHandler {

	static alloc(): RotationGestureHandler; // inherited from NSObject

	static new(): RotationGestureHandler; // inherited from NSObject
}

declare class TapGestureHandler extends GestureHandler {

	static alloc(): TapGestureHandler; // inherited from NSObject

	static new(): TapGestureHandler; // inherited from NSObject
}
