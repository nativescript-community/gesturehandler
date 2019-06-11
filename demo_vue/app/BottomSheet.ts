import BaseVueComponent from './BaseVueComponent';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
// import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureStateEventData, GestureTouchEventData, Manager } from 'nativescript-gesturehandler';
import BottomSheetHolder, { PAN_GESTURE_TAG } from './BottomSheetHolder';
import Vue from 'nativescript-vue';
import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureState, GestureStateEventData, GestureTouchEventData, HandlerType, Manager, PanGestureHandler } from 'nativescript-gesturehandler';
import { View } from 'tns-core-modules/ui/page/page';

@Component({})
export default class BottomSheet extends BaseVueComponent {
    constructor() {
        super();
    }

    isListViewAtTop = true;
    isScrollEnabled = true;
    set scrollEnabled(value) {
        if (value !== this.isScrollEnabled) {
            console.log('set scrollEnabled', value);
            this.isScrollEnabled = value;
        }
    }
    get scrollEnabled() {
        return this.isScrollEnabled;
    }
    get listViewAtTop() {
        return this.isListViewAtTop;
    }
    set listViewAtTop(value) {
        if (value !== this.isListViewAtTop) {
            console.log('set listViewAtTop', value);
            this.isListViewAtTop = value;
            this.$emit('listViewAtTop', value);
            // (this.$parent as any).listViewAllowScroll = value;
        }
    }
    holder: BottomSheetHolder;
    panGestureHandler: PanGestureHandler;
    get listView() {
        return (this.$refs['listView'] as any).nativeView as View;
    }
    mounted() {
        super.mounted();

        let parent: Vue = this;
        while (parent !== null && !(parent instanceof BottomSheetHolder)) {
            parent = parent.$parent as any;
        }
        if (parent instanceof BottomSheetHolder) {
            this.holder = parent;
            parent.setBottomSheet(this);
            const manager = Manager.getInstance();
            const gestureHandler = manager.createGestureHandler(HandlerType.NATIVE_VIEW, 4, {
                disallowInterruption: true,
                simultaneousHandlers: [PAN_GESTURE_TAG]
            });
            gestureHandler.attachToView(this.listView);
        }
    }

    onItemTap({ item }) {
        alert('clicked on item ' + item);
    }
    onListViewScroll(args) {
        if (!this.isScrollEnabled) {
            return;
        }
        console.log('onListViewScroll', args.scrollOffset, this.listViewAtTop);
        if (!this.listViewAtTop && args.scrollOffset <= 0) {
            console.log('about to enable pan');
            // this.timer = setTimeout(() => {
            this.listViewAtTop = true;
            // }, 100);
        } else if (this.listViewAtTop && args.scrollOffset > 0) {
            console.log('about to disable pan');
            this.listViewAtTop = false;
        }
    }
}
