// Definitions.
import { GestureEventData } from '@nativescript/core/ui/gestures';
import { View, EventData } from '@nativescript/core/ui/core/view';

// Types.
import { toString, TouchAction, GestureTypes, observe as nGestureObserve } from '@nativescript/core/ui/gestures';

// Import layout from utils directly to avoid circular references
import { layout } from '@nativescript/core/utils/utils';

import { Manager, PanGestureHandler, FlingGestureHandler, RotationGestureHandler, PinchGestureHandler, TapGestureHandler, LongPressGestureHandler } from './gesturehandler';
import { HandlerType, GestureHandlerStateEvent, GestureStateEventData, GestureState, GestureHandlerTouchEvent } from './gesturehandler.common';

export function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver {
    // const startTime = Date.now();
    // return nGestureObserve(target, type, callback) as any;
    const observer = new GesturesObserver(target, callback, context);
    observer.observe(type);
    // console.log('observe', type, Date.now() - startTime, 'ms')
    return observer;
}

let TAG = 0;
export class GesturesObserver {
    private _callback: (args: GestureEventData) => void;
    private _target: View & {
        _gestureObservers?: any;
    };
    private _context: any;

    public type: GestureTypes;

    public get callback(): (args: GestureEventData) => void {
        return this._callback;
    }

    public get target() {
        return this._target;
    }

    public get context() {
        return this._context;
    }

    constructor(target: View, callback: (args: GestureEventData) => void, context: any) {
        this._target = target;
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
            let list = this.target.getGestureObservers(this.type);
            if (list && list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].callback === this.callback) {
                        break;
                    }
                }
                list.length = 0;

                this.target._gestureObservers[this.type] = undefined;
                delete this.target._gestureObservers[this.type];
            }
        }
        this._target = null;
        this._callback = null;
        this._context = null;
    }
    private _notifyTouch: boolean;
    private _tapGestureHandler: TapGestureHandler;
    private _doubletapGestureHandler: TapGestureHandler;
    private _longpressGestureHandler: LongPressGestureHandler;
    private _pinchGestureHandler: PinchGestureHandler;
    private _panGestureHandler: PanGestureHandler;
    private _rotationGestureHandler: RotationGestureHandler;
    private _flingGestureHandler: FlingGestureHandler;

    private _eventData: TouchGestureEventData;

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
        this._notifyTouch = false;
        this._tapGestureHandler = null;
        this._doubletapGestureHandler = null;
        this._longpressGestureHandler = null;
        this._pinchGestureHandler = null;
        this._panGestureHandler = null;
        this._rotationGestureHandler = null;
        this._flingGestureHandler = null;
        this._eventData = null;
    }
    private onGestureStateChange(type: GestureTypes) {
        return (event: GestureStateEventData) => {
            if (this.callback) {
                this.callback.call(this._context, {
                    eventName: toString(type),
                    object: event.data.view,
                    type,
                    ...event.data,
                    ...event.data.extraData,
                });
            }
        };
    }
    private onGestureTouchChange(type: GestureTypes) {
        return (event: GestureStateEventData) => {
            if (this.callback && event.data.state === GestureState.ACTIVE) {
                this.callback.call(this._context, {
                    eventName: toString(type),
                    object: event.data.view,
                    type,
                    ...event.data,
                    ...event.data.extraData,
                });
            }
        };
    }
    private _attach(target: View, type: GestureTypes) { 
        if (type & GestureTypes.touch) {
            this._notifyTouch = true;
        }
        const manager = Manager.getInstance();
        if (type & GestureTypes.tap) {
            const gestureHandler = (this._tapGestureHandler = manager.createGestureHandler(HandlerType.TAP, TAG++));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.tap), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.tap), this);
            gestureHandler.attachToView(target);
        }
        if (type & GestureTypes.longPress) {
            const gestureHandler = (this._longpressGestureHandler = manager.createGestureHandler(HandlerType.LONG_PRESS, TAG++));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.longPress), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.longPress), this);
            gestureHandler.attachToView(target);
        }
        if (type & GestureTypes.doubleTap) {
            const gestureHandler = (this._doubletapGestureHandler = manager.createGestureHandler(HandlerType.TAP, TAG++, {
                numberOfTaps: 2,
            }));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.doubleTap), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.doubleTap), this);
            gestureHandler.attachToView(target);
        }

        if (type & GestureTypes.pinch) {
            const gestureHandler = (this._pinchGestureHandler = manager.createGestureHandler(HandlerType.PINCH, TAG++));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.pinch), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.pinch), this);
            gestureHandler.attachToView(target);
        }

        if (type & GestureTypes.swipe) {
            const gestureHandler = (this._flingGestureHandler = manager.createGestureHandler(HandlerType.FLING, TAG++));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.swipe), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.swipe), this);
            gestureHandler.attachToView(target);
        }

        if (type & GestureTypes.pan) {
            const gestureHandler = (this._panGestureHandler = manager.createGestureHandler(HandlerType.PAN, TAG++, {}));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.pan), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.pan), this);
            gestureHandler.attachToView(target);
        }

        if (type & GestureTypes.rotation) {
            const gestureHandler = (this._rotationGestureHandler = manager.createGestureHandler(HandlerType.ROTATION, TAG++, {}));
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.rotation), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.rotation), this);
            gestureHandler.attachToView(target);
        }
    }

    public androidOnTouchEvent(motionEvent: android.view.MotionEvent) {
        if (this._notifyTouch) {
            if (!this._eventData) {
                this._eventData = new TouchGestureEventData();
            }

            this._eventData.prepare(this.target, motionEvent);
            _executeCallback(this, this._eventData);
        }
    }
}

class Pointer implements Pointer {
    public android: number;
    public ios: any = undefined;

    constructor(id: number, private event: android.view.MotionEvent) {
        this.android = id;
    }

    getX(): number {
        return this.event.getX(this.android) / layout.getDisplayDensity();
    }

    getY(): number {
        return this.event.getY(this.android) / layout.getDisplayDensity();
    }
}
class TouchGestureEventData implements TouchGestureEventData {
    eventName: string = toString(GestureTypes.touch);
    type: GestureTypes = GestureTypes.touch;
    ios: any = undefined;
    action: string;
    view: View;
    android: android.view.MotionEvent;
    object: any;

    private _activePointers: Array<Pointer>;
    private _allPointers: Array<Pointer>;

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

    getActivePointers(): Array<Pointer> {
        // Only one active pointer in Android
        if (!this._activePointers) {
            this._activePointers = [new Pointer(this.android.getActionIndex(), this.android)];
        }

        return this._activePointers;
    }

    getAllPointers(): Array<Pointer> {
        if (!this._allPointers) {
            this._allPointers = [];
            for (let i = 0; i < this.getPointerCount(); i++) {
                this._allPointers.push(new Pointer(i, this.android));
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

function _executeCallback(observer: GesturesObserver, args: GestureEventData) {
    if (observer && observer.callback) {
        observer.callback.call((<any>observer)._context, args);
    }
}
