<template>
    <Page >
        <ActionBar title="GestureHandler Demo" />

        <GridLayout>
            <CollectionView
                ref="collectionView"
                iosOverflowSafeArea="true"
                :items="items"
                itemIdGenerator="index"
                colWidth="50%"
                rowHeight="200"
            >
                <v-template>
                    <GridLayout rows="*, auto" :backgroundColor="item.color" class="item">
                        <StackLayout row="1">
                            <Label row="1" :text="item.name" class="title" />
                            <Label row="1" :text="item.color" class="subtitle" />
                        </StackLayout>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { GC } from '@nativescript/core/utils/utils';
import BaseVueComponent from './BaseVueComponent';
import BottomSheetHolder from './BottomSheetHolder';
import BottomSheet from './BottomSheet';
import Component from 'vue-class-component';
import {
    FlingDirection,
    FlingGestureHandler,
    GestureHandlerStateEvent,
    GestureState,
    GestureStateEventData,
    HandlerType,
    Manager,
    NativeViewGestureHandler,
} from '@nativescript-community/gesturehandler';
import { View } from '@nativescript/core';
import { Provide } from 'vue-property-decorator';
export const FLING_GESTURE_TAG = 12431;
export const NATIVE_GESTURE_TAG = 12331;

@Component({
    components: {
    }
})
export default class App extends BaseVueComponent {
    swipeGestureHandler
    nativeGestureHandler
    items = [
            { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
            { index: 1, name: 'EMERALD', color: '#2ecc71' },
            { index: 2, name: 'PETER RIVER', color: '#3498db' },
            { index: 3, name: 'AMETHYST', color: '#9b59b6' },
            { index: 4, name: 'WET ASPHALT', color: '#34495e' },
            { index: 5, name: 'GREEN SEA', color: '#16a085' },
            { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
            { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
            { index: 8, name: 'WISTERIA', color: '#8e44ad' },
            { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
            { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
            { index: 11, name: 'CARROT', color: '#e67e22' },
            { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
            { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
            { index: 14, name: 'CONCRETE', color: '#95a5a6' },
            { index: 15, name: 'ORANGE', color: '#f39c12' },
            { index: 16, name: 'PUMPKIN', color: '#d35400' },
            { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
            { index: 18, name: 'SILVER', color: '#bdc3c7' },
            { index: 19, name: 'ASBESTOS', color: '#7f8c8d' }
        ];
        initGestures() {
        const scrollView = (this.$refs.collectionView as any).nativeView;
        const manager = Manager.getInstance();
        const gestureHandler = manager.createGestureHandler(HandlerType.FLING, FLING_GESTURE_TAG, {
            // waitFor: [NATIVE_GESTURE_TAG],
            simultaneousHandlers: [NATIVE_GESTURE_TAG],
            direction: FlingDirection.DIRECTION_RIGHT | FlingDirection.DIRECTION_LEFT,
        });
        this.swipeGestureHandler = gestureHandler as any;
        gestureHandler.on(GestureHandlerStateEvent, this.onGestureState, this);
        gestureHandler.attachToView(this.nativeView);
        const nativegestureHandler = manager.createGestureHandler(HandlerType.NATIVE_VIEW, NATIVE_GESTURE_TAG, {
            // shouldActivateOnStart:true,
            disallowInterruption:true,
            // waitFor: [FLING_GESTURE_TAG],
            // simultaneousHandlers: [FLING_GESTURE_TAG],
            // direction: FlingDirection.DIRECTION_RIGHT | FlingDirection.DIRECTION_LEFT,
        });
        // gestureHandler.on(GestureHandlerStateEvent, this.onGestureState, this);
        nativegestureHandler.attachToView(scrollView);
        this.nativeGestureHandler = nativegestureHandler as any;
    }
    onGestureState(args: GestureStateEventData) {
        const { state, prevState, extraData, view } = args.data;
        if (state === GestureState.ACTIVE) {
            const direction = extraData.direction as any;
            console.log('direction', direction, Date.now())
        }
    }
    mounted() {
        this.initGestures();

    }
}
</script>

<style scoped>
ActionBar {
    background-color: #3f51b5;
    color: #ffffff;
}
</style>
