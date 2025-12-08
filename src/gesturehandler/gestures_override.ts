import { EventData, Utils, View } from '@nativescript/core';
import { GestureEventData, GestureStateTypes, GestureTypes, GesturesObserver as NGesturesObserver, SwipeDirection, TouchAction, toString as gestureToString } from '@nativescript/core/ui/gestures';
import { Handler, Manager } from './gesturehandler';
import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureState, GestureStateEventData, HandlerType, ROOT_GESTURE_HANDLER_TAG } from './gesturehandler.common';

export function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver {
    if (!callback) {
        return null;
    }
    const observer = new GesturesObserver(target, callback, context);
    observer.observe(type);
    return observer;
}

let TAG = 0;
export class GesturesObserver {
    private _callback: (args: GestureEventData) => void;
    private _target: View & {
        _gestureHandlers?: any;
    };
    private _context: any;

    public type: GestureTypes;

    private nObserver?: NGesturesObserver;

    //@ts-ignore
    public get callback(): (args: GestureEventData) => void {
        return this._callback;
    }

    public get target() {
        return this._target;
    }

    //@ts-ignore
    public get context() {
        return this._context;
    }

    constructor(target: View, callback: (args: GestureEventData) => void, context: any) {
        this._target = target;
        if (!target['TAP_HANDLER_TAG']) {
            target['TAP_HANDLER_TAG'] = TAG++;
        }
        if (!target['LONGPRESS_HANDLER_TAG']) {
            target['LONGPRESS_HANDLER_TAG'] = TAG++;
        }
        if (!target['DOUBLE_TAP_HANDLER_TAG']) {
            target['DOUBLE_TAP_HANDLER_TAG'] = TAG++;
        }
        if (!target['PINCH_HANDLER_TAG']) {
            target['PINCH_HANDLER_TAG'] = TAG++;
        }
        if (!target['PAN_HANDLER_TAG']) {
            target['PAN_HANDLER_TAG'] = TAG++;
        }
        this._callback = callback;
        this._context = context;
    }

    public disconnect() {
        this._detach();

        if (this.target) {
            this.target.off('loaded', this._onTargetLoaded);
            this.target.off('unloaded', this._onTargetUnloaded);

            this._onTargetLoaded = null;
            this._onTargetUnloaded = null;
        }
        // clears target, context and callback references
        // remove gesture observer from map
        if (this.target) {
            const list = this.target.getGestureObservers(this.type);
            if (list && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].callback === this.callback) {
                        break;
                    }
                }
                list.length = 0;

                delete this.target._gestureObservers[this.type];
                if (this.target._gestureHandlers && this.target._gestureHandlers[this.type]) {
                    delete this.target._gestureHandlers[this.type];
                }
            }
        }
        if (this.nObserver) {
            this.nObserver.disconnect();
            this.nObserver = null;
        }
        this._target = null;
        this._callback = null;
        this._context = null;
        this.gestureHandler = null;
    }
    private _notifyTouch: boolean;

    private gestureHandler: Handler<any, any>;
    private _eventData: { [k: number]: CommonGestureEventData | AndroidTouchGestureEventData } = {};

    private _onTargetLoaded: (data: EventData) => void;
    private _onTargetUnloaded: (data: EventData) => void;

    public observe(type: GestureTypes) {
        if (this.target) {
            this.type = type;
            this._onTargetLoaded = (args) => {
                this._attach(this.target, type);
            };
            this._onTargetUnloaded = (args) => {
                this._detach();
            };

            this.target.on('loaded', this._onTargetLoaded);
            this.target.on('unloaded', this._onTargetUnloaded);

            if (this.target.isLoaded) {
                this._attach(this.target, type);
            }
        }
    }

    private _detach() {
        if (this.gestureHandler) {
            // dont detach events. It will be done on dispose
            // this.gestureHandler.off(GestureHandlerStateEvent);
            // this.gestureHandler.off(GestureHandlerTouchEvent);
            this.gestureHandler.detachFromView(this.target);
        }
        this._notifyTouch = false;
        this._eventData = {};
    }

    private emitEvent(type: GestureTypes, event: GestureStateEventData) {
        if (this.callback) {
            let eventData = this._eventData[type] as CommonGestureEventData;
            if (!eventData) {
                switch (type) {
                    case GestureTypes.pan:
                        this._eventData[type] = eventData = new PanGestureEventData(type);
                        break;
                    case GestureTypes.pinch:
                        this._eventData[type] = eventData = new PinchGestureEventData(type);
                        break;
                    case GestureTypes.swipe:
                        this._eventData[type] = eventData = new SwipeGestureEventData(type);
                        break;
                    default:
                        this._eventData[type] = eventData = new CommonGestureEventData(type);
                        break;
                }
                eventData.handler = this.gestureHandler;
            }
            eventData.prepare(this.target, event);
            _executeCallback(this, eventData);
            // this.callback.call(this._context, {
            //     eventName: gestureToString(type),
            //     object: event.data.view,
            //     type,
            //     ...event.data,
            //     ...event.data.extraData,
            // });
        }
    }
    private onGestureStateChange(type: GestureTypes, triggerOnstate = -1) {
        return (event: GestureStateEventData) => {
            if (triggerOnstate !== -1 && event.data.state !== triggerOnstate) {
                return;
            }
            this.emitEvent(type, event);
        };
    }
    private onGestureTouchChange(type: GestureTypes) {
        return (event: GestureStateEventData) => {
            if (event.data.state === GestureState.ACTIVE) {
                this.emitEvent(type, event);
            }
        };
    }
    private _attach(target: View, type: GestureTypes) {
        if (type & GestureTypes.touch) {
            this._notifyTouch = true;
            if (__IOS__) {
                // let s not reimplement it for touch
                const nObserver = new NGesturesObserver(target, this.callback, this.context);
                nObserver.observe(type);
                this.nObserver = nObserver;
            }
            return;
        }
        const manager = Manager.getInstance();
        // if (!target._gestureHandlers) {
        //     target._gestureHandlers = {};
        // }
        let gestureHandler = this.gestureHandler;

        if (!gestureHandler) {
            if (type & GestureTypes.tap) {
                gestureHandler = manager.createGestureHandler(HandlerType.TAP, target['TAP_HANDLER_TAG'], {
                    simultaneousHandlers: [ROOT_GESTURE_HANDLER_TAG],
                    waitFor: [target['LONGPRESS_HANDLER_TAG'], target['DOUBLE_TAP_HANDLER_TAG']],
                    ...(target.tapGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.tap, GestureState.ACTIVE), this);
            }
            if (type & GestureTypes.longPress) {
                gestureHandler = manager.createGestureHandler(HandlerType.LONG_PRESS, target['LONGPRESS_HANDLER_TAG'], {
                    simultaneousHandlers: [ROOT_GESTURE_HANDLER_TAG],
                    ...(target.longPressGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.longPress, __IOS__ ? GestureState.BEGAN : GestureState.ACTIVE), this);
            }
            if (type & GestureTypes.doubleTap) {
                gestureHandler = manager.createGestureHandler(HandlerType.TAP, target['DOUBLE_TAP_HANDLER_TAG'], {
                    numberOfTaps: 2,
                    simultaneousHandlers: [ROOT_GESTURE_HANDLER_TAG],
                    ...(target.doubleTapGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.doubleTap, GestureState.ACTIVE), this);
            }

            if (type & GestureTypes.pinch) {
                gestureHandler = manager.createGestureHandler(HandlerType.PINCH, target['PINCH_HANDLER_TAG'], {
                    simultaneousHandlers: [target['PAN_HANDLER_TAG'], ROOT_GESTURE_HANDLER_TAG],
                    ...(target.pinchGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.pinch), this);
                gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.pinch), this);
            }

            if (type & GestureTypes.swipe) {
                gestureHandler = manager.createGestureHandler(HandlerType.FLING, TAG++, {
                    simultaneousHandlers: [ROOT_GESTURE_HANDLER_TAG],
                    ...(target.swipeGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.swipe, GestureState.ACTIVE), this);
            }

            if (type & GestureTypes.pan) {
                gestureHandler = manager.createGestureHandler(HandlerType.PAN, target['PAN_HANDLER_TAG'], {
                    simultaneousHandlers: [target['PINCH_HANDLER_TAG'], ROOT_GESTURE_HANDLER_TAG],
                    ...(target.panGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.pan), this);
                gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.pan), this);
            }

            if (type & GestureTypes.rotation) {
                gestureHandler = manager.createGestureHandler(HandlerType.ROTATION, TAG++, {
                    simultaneousHandlers: [ROOT_GESTURE_HANDLER_TAG],
                    ...(target.rotationGestureOptions || {})
                });
                gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.rotation, GestureState.ACTIVE), this);
                gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.rotation), this);
            }
        }
        gestureHandler.attachToView(target);
        this.gestureHandler = gestureHandler;
    }

    public androidOnTouchEvent(motionEvent: android.view.MotionEvent) {
        if (this._notifyTouch) {
            let eventData = this._eventData[GestureTypes.touch];
            if (!eventData) {
                eventData = this._eventData[GestureTypes.touch] = new AndroidTouchGestureEventData();
                eventData.handler = this.gestureHandler;
            }
            eventData.prepare(this.target, motionEvent);
            _executeCallback(this, eventData);
        }
    }
}

class AndroidPointer implements AndroidPointer {
    public android: number;
    public ios: any = undefined;

    constructor(
        id: number,
        private event: android.view.MotionEvent
    ) {
        this.android = id;
    }

    getX(): number {
        return this.event.getX(this.android) / Utils.layout.getDisplayDensity();
    }

    getY(): number {
        return this.event.getY(this.android) / Utils.layout.getDisplayDensity();
    }
}
class GesturePointer {
    android: number;
    ios: number;
    private event: any;
    constructor(
        index: number,
        private x,
        private y
    ) {
        this.android = index;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }
}

class Pointer {
    _location: CGPoint;
    ios: GestureHandler;
    _view: View;
    get location() {
        if (!this._location) {
            this._location = this.ios.locationInView(this._view.nativeViewProtected);
        }

        return this._location;
    }

    constructor(touch, targetView, location?) {
        this._location = location;
        this.ios = touch;
        this._view = targetView;
    }

    getX() {
        return this.location.x;
    }

    getY() {
        return this.location.y;
    }
}
class CommonGestureEventData implements GestureEventData {
    ios;
    android;
    eventName: string;
    type: GestureTypes;
    view: View;
    object: any;
    eventData: {
        state: GestureState;
        ios?: any; // native View
        android?: any; // native View
        view?: View; // native View
        extraData: {
            numberOfPointers: number;
            [k: string]: number | string;
        };
    };
    state: GestureStateTypes;
    handler: Handler<any, any>;

    private _activePointers: (GesturePointer | Pointer)[];
    private _allPointers: (GesturePointer | Pointer)[];

    constructor(type: GestureTypes) {
        this.eventName = gestureToString(type);
        this.type = type;
    }

    public prepare(view: View, event) {
        this.view = view;
        this.object = view;
        this.ios = event.data.ios;
        this.android = event.data.android;
        this._activePointers = undefined;
        this._allPointers = undefined;
        this.eventData = event.data;
        switch (this.eventData.state) {
            case GestureState.BEGAN:
                this.state = GestureStateTypes.began;
                break;
            case GestureState.CANCELLED:
            case GestureState.FAILED:
                this.state = GestureStateTypes.cancelled;
                break;
            case GestureState.ACTIVE:
                this.state = GestureStateTypes.changed;
                break;
            case GestureState.END:
                this.state = GestureStateTypes.ended;
                break;
        }
    }

    get extraData() {
        return this.eventData.extraData;
    }

    getPointerCount(): number {
        return this.extraData.numberOfPointers;
    }

    getActivePointers() {
        // Only one active pointer in Android
        if (!this._activePointers) {
            if (__ANDROID__) {
                const positions = this.extraData.positions;
                this._activePointers = [new GesturePointer(0, positions[0], positions[1])];
            } else {
                this._activePointers = [new Pointer(this.ios, this.view)];
            }
        }
        return this._activePointers;
    }

    getAllPointers() {
        if (!this._allPointers) {
            this._allPointers = [];
            const positions = this.extraData.positions;
            for (let i = 0; i < this.getPointerCount(); i++) {
                if (__ANDROID__) {
                    this._allPointers.push(new GesturePointer(i, positions[i * 2], positions[i * 2 + 1]));
                } else {
                    this._allPointers = [new Pointer(this.ios, this.view, { x: positions[i * 2], y: positions[i * 2 + 1] })];
                }
            }
        }
        return this._allPointers;
    }

    getX(): number {
        return this.extraData.x as number;
    }

    getY(): number {
        return this.extraData.y as number;
    }

    private getActionType(e: android.view.MotionEvent): string {
        switch (e.getActionMasked()) {
            case android.view.MotionEvent.ACTION_DOWN:
            case android.view.MotionEvent.ACTION_POINTER_DOWN:
                return TouchAction.down;
            case android.view.MotionEvent.ACTION_MOVE:
                return TouchAction.move;
            case android.view.MotionEvent.ACTION_UP:
            case android.view.MotionEvent.ACTION_POINTER_UP:
                return TouchAction.up;
            case android.view.MotionEvent.ACTION_CANCEL:
                return TouchAction.cancel;
        }

        return '';
    }
}
class AndroidTouchGestureEventData {
    eventName: string = gestureToString(GestureTypes.touch);
    type: GestureTypes = GestureTypes.touch;
    ios: any = undefined;
    action: string;
    view: View;
    android: android.view.MotionEvent;
    object: any;
    state: GestureStateTypes;
    handler: Handler<any, any>;

    private _activePointers: AndroidPointer[];
    private _allPointers: AndroidPointer[];

    public prepare(view: View, e: android.view.MotionEvent) {
        this.view = view;
        this.object = view;
        this.android = e;
        this.action = this.getActionType(e);
        this._activePointers = undefined;
        this._allPointers = undefined;
    }

    getPointerCount(): number {
        return this.android.getPointerCount();
    }

    getActivePointers(): AndroidPointer[] {
        // Only one active pointer in Android
        if (!this._activePointers) {
            this._activePointers = [new AndroidPointer(this.android.getActionIndex(), this.android)];
        }
        return this._activePointers;
    }

    getAllPointers(): AndroidPointer[] {
        if (!this._allPointers) {
            this._allPointers = [];
            for (let i = 0; i < this.getPointerCount(); i++) {
                this._allPointers.push(new AndroidPointer(i, this.android));
            }
        }
        return this._allPointers;
    }

    getX(): number {
        return this.getActivePointers()[0].getX();
    }

    getY(): number {
        return this.getActivePointers()[0].getY();
    }

    private getActionType(e: android.view.MotionEvent): string {
        switch (e.getActionMasked()) {
            case android.view.MotionEvent.ACTION_DOWN:
            case android.view.MotionEvent.ACTION_POINTER_DOWN:
                return TouchAction.down;
            case android.view.MotionEvent.ACTION_MOVE:
                return TouchAction.move;
            case android.view.MotionEvent.ACTION_UP:
            case android.view.MotionEvent.ACTION_POINTER_UP:
                return TouchAction.up;
            case android.view.MotionEvent.ACTION_CANCEL:
                return TouchAction.cancel;
        }

        return '';
    }
}

function _getSwipeDirection(direction: string): SwipeDirection {
    return SwipeDirection[direction];
}
class SwipeGestureEventData extends CommonGestureEventData {
    get direction() {
        return _getSwipeDirection(this.extraData.direction as string);
    }
}
class PanGestureEventData extends CommonGestureEventData {
    get deltaX() {
        return this.eventData.extraData.translationX;
    }
    get deltaY() {
        return this.eventData.extraData.translationY;
    }
}
class PinchGestureEventData extends CommonGestureEventData {
    getFocusX() {
        return this.eventData.extraData.focalX;
    }
    getFocusY() {
        return this.eventData.extraData.focalY;
    }
    get scale() {
        return this.eventData.extraData.scale;
    }
}

function _executeCallback(observer: GesturesObserver, args: GestureEventData) {
    if (observer && observer.callback) {
        observer.callback.call((observer as any)._context, args);
    }
}
