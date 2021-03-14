import { EventData, View } from '@nativescript/core';
import { GestureEventData, GestureTypes, GesturesObserver as NGesturesObserver, TouchAction, toString as gestureToString } from '@nativescript/core/ui/gestures';
import { layout } from '@nativescript/core/utils/utils';
import { Manager } from './gesturehandler';
import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureState, GestureStateEventData, HandlerType } from './gesturehandler.common';

export function observe(target: View, type: GestureTypes, callback: (args: GestureEventData) => void, context?: any): GesturesObserver {
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
                if (this.target._gestureHandlers && this.target._gestureHandlers[this.type]) {
                    this.target._gestureHandlers[this.type].detachFromView();
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
    }
    private _notifyTouch: boolean;

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
        this._eventData = null;
    }
    private onGestureStateChange(type: GestureTypes, triggerOnstate = -1) {
        return (event: GestureStateEventData) => {
            if (triggerOnstate !== -1 && event.data.state !== triggerOnstate) {
                return;
            }
            if (this.callback) {
                this.callback.call(this._context, {
                    eventName: gestureToString(type),
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
                    eventName: gestureToString(type),
                    object: event.data.view,
                    type,
                    ...event.data,
                    ...event.data.extraData,
                });
            }
        };
    }
    private _attach(
        target: View & {
            _gestureHandlers?: any;
        },
        type: GestureTypes
    ) {
        if (type & GestureTypes.touch) {
            this._notifyTouch = true;
        }
        const manager = Manager.getInstance();
        if (!target._gestureHandlers) {
            target._gestureHandlers = {};
        }
        let gestureHandler = target._gestureHandlers[type];

        if (type & GestureTypes.tap) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.TAP, target['TAP_HANDLER_TAG'], {
                    waitFor: [target['LONGPRESS_HANDLER_TAG'], target['DOUBLE_TAP_HANDLER_TAG']],
                });
                gestureHandler.attachToView(target);
                console.log('_attach', target, type);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.tap, GestureState.ACTIVE), this);
        }
        if (type & GestureTypes.longPress) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.LONG_PRESS, target['LONGPRESS_HANDLER_TAG']);
                gestureHandler.attachToView(target);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.longPress, GestureState.ACTIVE), this);
        }
        if (type & GestureTypes.doubleTap) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.TAP, target['DOUBLE_TAP_HANDLER_TAG'], {
                    numberOfTaps: 2,
                });
                gestureHandler.attachToView(target);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.doubleTap), this);
        }

        if (type & GestureTypes.pinch) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.PINCH, TAG++);
                gestureHandler.attachToView(target);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.pinch), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.pinch), this);
        }

        if (type & GestureTypes.swipe) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.FLING, TAG++);
                gestureHandler.attachToView(target);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.swipe), this);
        }

        if (type & GestureTypes.pan) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.PAN, TAG++, {});
                gestureHandler.attachToView(target);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.pan), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.pan), this);
        }

        if (type & GestureTypes.rotation) {
            if (!gestureHandler) {
                gestureHandler = manager.createGestureHandler(HandlerType.ROTATION, TAG++, {});
                gestureHandler.attachToView(target);
                target._gestureHandlers[type] = gestureHandler;
            }
            gestureHandler.on(GestureHandlerStateEvent, this.onGestureStateChange(GestureTypes.rotation), this);
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouchChange(GestureTypes.rotation), this);
        }
        if (type & GestureTypes.touch && global.isIOS) {
            // let s not reimplement it for touch
            const nObserver = new NGesturesObserver(target, this.callback, this.context);
            nObserver.observe(type);
            this.nObserver = nObserver;
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
    eventName: string = gestureToString(GestureTypes.touch);
    type: GestureTypes = GestureTypes.touch;
    ios: any = undefined;
    action: string;
    view: View;
    android: android.view.MotionEvent;
    object: any;

    private _activePointers: Pointer[];
    private _allPointers: Pointer[];

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

    getActivePointers(): Pointer[] {
        // Only one active pointer in Android
        if (!this._activePointers) {
            this._activePointers = [new Pointer(this.android.getActionIndex(), this.android)];
        }
        return this._activePointers;
    }

    getAllPointers(): Pointer[] {
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
        observer.callback.call((observer as any)._context, args);
    }
}
