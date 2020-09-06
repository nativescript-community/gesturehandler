import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureState, GestureStateEventData, GestureTouchEventData, HandlerType, Manager, PanGestureHandler } from '@nativescript-community/gesturehandler';
import { View } from '@nativescript/core/ui/core/view';
import { layout } from '@nativescript/core/utils/utils';
import { Component, Prop } from 'vue-property-decorator';
import TWEEN from '@nativescript-community/tween';
import BaseVueComponent from './BaseVueComponent';
import BottomSheet from './BottomSheet';

const OPEN_DURATION = 100;
const CLOSE_DURATION = 200;

export const PAN_GESTURE_TAG = 1;

@Component({})
export default class BottomSheetHolder extends BaseVueComponent {
    bottomSheet: BottomSheet;
    setBottomSheet(comp: BottomSheet) {
        this.bottomSheet = comp;
        if (comp) {
            comp.$on('listViewAtTop', value => {
                this.panEnabled = value;
                console.log('set listViewAtTop', value, this._isPanning);
                if (value && this._isPanning) {
                    this.bottomSheet && (this.bottomSheet.scrollEnabled = !value);
                }
            });
        }
    }
    opened = false;
    _isPanning = false;
    set isPanning(value) {
        if (value !== this._isPanning) {
            this._isPanning = value;
            console.log('set isPanning', value, this.panEnabled);
            // if (value && this.panEnabled) {
            this.bottomSheet && (this.bottomSheet.scrollEnabled = !(value && this.panEnabled));
            // }
        }
    }
    get isPanning() {
        return this._isPanning;
    }
    isAnimating = false;
    prevDeltaY = 0;
    viewHeight = 0;
    currentViewHeight = 0;
    currentSheetTop = 0;

    @Prop({
        default: [50]
    })
    peekerSteps;
    // @Prop()
    // shouldPan: Function;
    @Prop({
        // default: [50]
    })
    scrollViewTag;

    // @Prop({
    //     default: true
    // })
    isPanEnabled: boolean = true;
    // @Watch('panEnabled')
    set panEnabled(value) {
        if (value !== this.isPanEnabled) {
            this.isPanEnabled = value;
            console.log('onPanEnabledChanged', value);
            // this.panGestureHandler.enabled = value;
        }
    }
    get panEnabled() {
        return this.isPanEnabled;
    }

    constructor() {
        super();
    }
    panGestureHandler: PanGestureHandler;
    mounted() {
        super.mounted();

        const manager = Manager.getInstance();
        const gestureHandler = manager.createGestureHandler(HandlerType.PAN, PAN_GESTURE_TAG, {
            shouldCancelWhenOutside: false,
            activeOffsetY: 5,
            failOffsetY: -5,
            simultaneousHandlers: [4]
        });
        gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouch, this);
        gestureHandler.on(GestureHandlerStateEvent, this.onGestureState, this);
        gestureHandler.attachToView(this.scrollingView);
        this.panGestureHandler = gestureHandler as any;
    }
    destroyed() {
        if (this.panGestureHandler) {
            this.panGestureHandler.off(GestureHandlerTouchEvent, this.onGestureTouch, this);
            this.panGestureHandler.off(GestureHandlerStateEvent, this.onGestureState, this);
            this.panGestureHandler.detachFromView(this.scrollingView);
            this.panGestureHandler = null;
        }
    }
    get scrollingView() {
        return (this.$refs['scrollingView'] as any).nativeView as View;
    }
    get translationMaxOffset() {
        return this.peekerSteps.slice(-1)[0];
    }
    onLayoutChange() {
        this.viewHeight = layout.toDeviceIndependentPixels(this.nativeView.getMeasuredHeight());
        if (this.currentViewHeight === 0) {
            this.currentViewHeight = this.viewHeight;
        }
    }
    onGestureState(args: GestureStateEventData) {
        const { state, prevState, extraData, view } = args.data;

        // console.log('onGestureState', state, prevState, GestureState.ACTIVE, this.panEnabled);
        this.updateIsPanning(state);
        if (!this.panEnabled) {
            return;
        }
        if (prevState === GestureState.ACTIVE) {
            const { velocityY, translationY } = extraData;
            const viewTop = this.currentViewHeight - this.viewHeight;

            const dragToss = 0.05;
            const endOffsetY = viewTop + translationY - this.prevDeltaY + dragToss * velocityY;

            const steps = [0].concat(this.peekerSteps);
            let destSnapPoint = steps[0];
            // console.log('onPan', 'done', viewTop, translationY, this.prevDeltaY, dragToss, velocityY, endOffsetY, steps);
            for (let i = 0; i < steps.length; i++) {
                const snapPoint = steps[i];
                const distFromSnap = Math.abs(snapPoint + endOffsetY);
                if (distFromSnap <= Math.abs(destSnapPoint + endOffsetY)) {
                    destSnapPoint = snapPoint;
                }
            }
            // if (destSnapPoint === 0) {
            //     this.$emit('');
            // }
            this.scrollSheetToPosition(destSnapPoint);
            this.prevDeltaY = 0;
        }
    }
    updateIsPanning(state: GestureState) {
        const viewTop = this.currentViewHeight - this.viewHeight;
        this.isPanning = (state === GestureState.ACTIVE || state === GestureState.BEGAN) && viewTop !== -this.translationMaxOffset;
    }
    onGestureTouch(args: GestureTouchEventData) {
        const data = args.data;
        if (data.state !== GestureState.ACTIVE) {
            return;
        }
        // console.log('onPan', this.isPanning, this.panEnabled, this.isAnimating, data.state, data.extraData.translationY, this.prevDeltaY);
        const deltaY = data.extraData.translationY;
        if (this.isAnimating || !this.isPanning || !this.panEnabled) {
            this.prevDeltaY = deltaY;
            return;
        }

        const viewTop = this.currentViewHeight - this.viewHeight;

        const y = deltaY - this.prevDeltaY;
        // console.log('onPan', 'moving', viewTop, deltaY, this.prevDeltaY, y, this.translationMaxOffset);
        this.constrainY(viewTop + y);
        this.updateIsPanning(data.state);
        this.prevDeltaY = deltaY;
    }

    constrainY(y) {
        // console.log('constrainY', y, this.translationMaxOffset);
        let trY = y;
        if (y > 0) {
            trY = 0;
        } else if (y < -this.translationMaxOffset) {
            trY = -this.translationMaxOffset;
        }
        this.currentViewHeight = this.viewHeight + trY;
    }

    scrollSheetToPosition(position, duration = OPEN_DURATION) {
        const viewTop = this.currentViewHeight - this.viewHeight;
        new TWEEN.Tween({ value: viewTop })
            .to({ value: -position }, OPEN_DURATION)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(obj => {
                this.currentViewHeight = this.viewHeight + obj.value;
            })
            .start(0);
        if (position === 0) {
            this.opened = false;
        } else {
            this.opened = true;
        }
    }

    peek() {
        if (!!this.opened) {
            return;
        }
        this.scrollSheetToPosition(this.peekerSteps[0]);
    }
    close() {
        if (!this.opened) {
            return;
        }
        this.scrollSheetToPosition(0, CLOSE_DURATION);
    }
}
