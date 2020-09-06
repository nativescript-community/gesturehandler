<template>
    <Page @navigatedTo="onNavigatedTo">
        <ActionBar title="GestureHandler Demo" />

        <BottomSheetHolder ref="bottomSheetHolder" :peekerSteps="[70, 120, 400]" :scrollViewTag="12">
            <GridLayout ref="testView" backgroundColor="white">
                <MDButton ref="button" text="test" @tap="onButtonTap" verticalAlignment="top" />
                <Label text="test label for gestures" @doubletap="printGestureResult" @swipe="printGestureResult" marginTop="100" verticalAlignment="top" />
                <StackLayout ref="subView" width="50" height="50" backgroundColor="yellow" horizontalAlignment="center" verticalAlignment="center" :translateX="translateX" :translateY="translateY" />
            </GridLayout>
            <BottomSheet slot="bottomSheet" />
        </BottomSheetHolder>
    </Page>
</template>

<script lang="ts">
import { GC } from '@nativescript/core/utils/utils';
import BaseVueComponent from './BaseVueComponent';
import BottomSheetHolder from './BottomSheetHolder';
import BottomSheet from './BottomSheet';
import Component from 'vue-class-component';
import { GestureState, GestureHandlerTouchEvent, GestureHandlerStateEvent, GestureStateEventData, GestureTouchEventData, HandlerType, Manager } from '@nativescript-community/gesturehandler';
import { View } from '@nativescript/core';
import { Provide } from 'vue-property-decorator';

@Component({
    components: {
        BottomSheetHolder,
        BottomSheet
    }
})
export default class App extends BaseVueComponent {
    // itemList = samples;
    translateX = 0;
    translateY = 0;
    deltaX = 0;
    deltaY = 0;
    onNavigatedTo() {
        // console.log('app', 'onNavigatedTo');
        GC();
    }

    get bottomSheetHolder() {
        return this.$refs.bottomSheetHolder as BottomSheetHolder;
    }

    // mListViewAllowScroll = true;
    // get listViewAllowScroll() {
    //      return this.mListViewAllowScroll;
    // }
    // onListViewAllowScrollChange(value) {
    //     console.log('App set listViewAllowScroll', value);
    //     this.mListViewAllowScroll = value;
    // }
    // bottomSheetCanPan() {
    //     console.log('bottomSheetCanPan', this.listViewAllowScroll);
    //     return this.listViewAllowScroll;
    // }
    gestureHandler;
    tapGestureHandler;
    doubleGestureHandler;
    mounted() {
        super.mounted();
        const manager = Manager.getInstance();
        const gestureHandler = (this.gestureHandler = manager.createGestureHandler(HandlerType.PAN, 10, {
            shouldCancelWhenOutside: false
        }))
            .on(GestureHandlerTouchEvent, this.onGestureTouch, this)
            .on(GestureHandlerStateEvent, this.onGestureState, this);
        const doubleGestureHandler = (this.doubleGestureHandler = manager.createGestureHandler(HandlerType.TAP, 13, { numberOfTaps: 2 }).on(GestureHandlerStateEvent, this.onDoubleTapGesture, this));
        const tapGestureHandler = (this.tapGestureHandler = manager
            .createGestureHandler(HandlerType.TAP, 12, {
                // waitFor: [13]
            })
            .on(GestureHandlerStateEvent, this.onTapGesture, this));
        // const pinchGestureHandler = (this.tapGestureHandler = manager.createGestureHandler(HandlerType.PINCH, 14).on(GestureHandlerStateEvent, this.onPinchGesture, this));

        gestureHandler.attachToView((this.$refs.subView as any).nativeView);
        tapGestureHandler.attachToView((this.$refs.subView as any).nativeView);
        doubleGestureHandler.attachToView((this.$refs.subView as any).nativeView);
        // pinchGestureHandler.attachToView(this.nativeView);
    }
    onDoubleTapGesture(event: GestureStateEventData) {
        // console.log('onDoubleTapGesture', event.data.extraData, event.data.state, event.data.prevState);
        if (event.data.state === GestureState.END && event.data.prevState === GestureState.ACTIVE) {
            console.log('onDoubleTapGesture', event.data.extraData.x, event.data.extraData.y, event.data.extraData);
        }
    }
    onTapGesture(event: GestureStateEventData) {
        // console.log('onTapGesture', event.data.extraData, event.data.state, event.data.prevState);
        if (event.data.state === GestureState.END && event.data.prevState === GestureState.ACTIVE) {
            console.log('onTapGesture', event.data.extraData.x, event.data.extraData.y, event.data.extraData);
        }
    }
    onPinchGesture(event: GestureStateEventData) {
        // console.log('onTapGesture', event.data.extraData, event.data.state, event.data.prevState);
        console.log('onPinchGesture', event.data.extraData.positions);
    }
    onGestureTouch(args: GestureTouchEventData) {
        const { state, extraData, view } = args.data;
        // console.log('onGestureTouch', state, view, extraData.translationX, extraData.translationY);
        this.translateX = extraData.translationX;
        this.translateY = extraData.translationY;
    }
    onGestureState(args: GestureStateEventData) {
        const { state, prevState, extraData, view } = args.data;
        // console.log('onGestureState', state, prevState, view, extraData, extraData.translationX);
    }
    onButtonTap(e) {
        const { object, view, ...others } = e;
        console.log('onButtonTap', others);
        this.bottomSheetHolder.peek();
    }

    printGestureResult(e) {
        const { object, view, ...others } = e;
        console.log('onGesture', others);
    }

    // onItemTap(item) {
    //     const module = require(`./examples/${item.component}.vue`).default;
    //     console.log(`Tapped3 on ${item.title}, ${item.component}`, module);
    //     this.$navigateTo(module, {
    //         props: {
    //             title: item.title,
    //             description: item.description
    //         }
    //     } as any);
    // }
}
</script>

<style scoped>
ActionBar {
    background-color: #3f51b5;
    color: #ffffff;
}
</style>
