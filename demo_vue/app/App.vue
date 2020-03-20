<template>
    <Page @navigatedTo="onNavigatedTo">
        <ActionBar title="GestureHandler Demo" />

        <BottomSheetHolder ref="bottomSheetHolder" :peekerSteps="[70, 120, 400]" :scrollViewTag="12">
            <GridLayout ref="testView" backgroundColor="white">
                <button ref="button" text="test" @tap="onButtonTap" verticalAlignment="top" />
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
import { GestureState, GestureHandlerTouchEvent, GestureHandlerStateEvent, GestureStateEventData, GestureTouchEventData, HandlerType, Manager } from 'nativescript-gesturehandler';
import { View } from '@nativescript/core/ui/core/view';
import { Provide } from 'vue-property-decorator';

// const samples = [
//     {
//         component: 'BaseMaps',
//         title: 'Online Base Maps',
//         description: 'Choice between different base maps, styles, languages',
//         image: '~/assets/images/image_base_maps.png'
//     },
//     {
//         component: 'CustomDev',
//         title: 'Dev example',
//         description: 'live dev example'
//     },
//     {
//         component: 'ReverseGeocoding',
//         title: 'Reverse Geocoding',
//         description: 'Coding of a point location to a readable address',
//         image: '~/assets/images/icon_sample_reverse_geocoding.png'
//     },
//     {
//         component: 'Geocoding',
//         title: 'Geocoding',
//         description: 'Converting addresses into geographic coordinates',
//         image: '~/assets/images/icon_sample_geocoding.png'
//     },
//     {
//         component: 'CustomRasterDatasource',
//         title: 'Custom Raster Data',
//         description: 'Customized raster tile data source',
//         image: '~/assets/images/image_custom_raster.png'
//     },
//     {
//         component: 'RouteSearch',
//         title: 'Search API',
//         description: 'Finds points of interest near a route',
//         image: '~/assets/images/icon_sample_route_search.png'
//     },
//     {
//         component: 'GroundOverlay',
//         title: 'Ground Overlays',
//         description: 'Shows a non-tiled Bitmap on ground',
//         image: '~/assets/images/image_ground_overlays.png'
//     },
//     {
//         component: 'WmsMap',
//         title: 'WMS Map',
//         description: 'Use external WMS service for raster tile overlay',
//         image: '~/assets/images/image_wms.png'
//     },
//     {
//         component: 'OfflineRouting',
//         title: 'Routing',
//         description: 'Valhalla Routing and Route Package download',
//         image: '~/assets/images/image_offline_routing.png'
//     },
//     {
//         component: 'VectorObjectEditing',
//         title: 'Vector Object Editing',
//         description: 'Shows usage of an editable vector layer',
//         image: '~/assets/images/image_object_editing.png'
//     },
//     {
//         component: 'Overlays',
//         title: '2D & 3D Overlays',
//         description: 'Shows lines, points, polygons, texts, pop-ups and a NMLModel',
//         image: '~/assets/images/image_overlays.png'
//     },
//     {
//         component: 'ClusteredMarkers',
//         title: 'Clustered Markers',
//         description: 'Shows 20,000 points from bundled geojson',
//         image: '~/assets/images/image_clustered_markers.png'
//     },
//     {
//         component: 'BundledMap',
//         title: 'Bundled Map',
//         description: 'Offline map of Rome bundled with the app',
//         image: '~/assets/images/image_bundled.png'
//     },
//     {
//         component: 'OfflineMap',
//         title: 'Offline Map',
//         description: 'Map package download',
//         image: '~/assets/images/image_city_package.png'
//     },
//     {
//         component: 'Capture',
//         title: 'Screencapture',
//         description: 'Capture rendered mapView as a Bitmap',
//         image: '~/assets/images/image_screencapture.png'
//     },
//     {
//         component: 'CustomPopup',
//         title: 'Custom Popup',
//         description: 'Creates a Custom Popup',
//         image: '~/assets/images/image_custom_popup.png'
//     },
//     {
//         component: 'GpsLocation',
//         title: 'GPS Location',
//         description: 'Shows user GPS location on the map',
//         image: '~/assets/images/image_gps_location.png'
//     },
//     {
//         component: 'BundledPackageData',
//         title: 'Package Data',
//         description: 'Displays available CARTO Mobile packages',
//         image: '~/assets/images/icon_sample_user_data.png'
//     }
// ];
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
    tapGestureHandler
    doubleGestureHandler
    mounted() {
        super.mounted();
        const manager = Manager.getInstance();
        // const gestureHandler = (this.gestureHandler = manager.createGestureHandler(HandlerType.PAN, 10, {
        //     shouldCancelWhenOutside: false
        // }))
        //     .on(GestureHandlerTouchEvent, this.onGestureTouch, this)
            // .on(GestureHandlerStateEvent, this.onGestureState, this);
        const doubleGestureHandler = this.doubleGestureHandler = manager.createGestureHandler(HandlerType.TAP, 13, { numberOfTaps: 2 }).on(GestureHandlerStateEvent, this.onDoubleTapGesture, this);
        const tapGestureHandler = this.tapGestureHandler = manager.createGestureHandler(HandlerType.TAP, 12, { waitFor: [13] }).on(GestureHandlerStateEvent, this.onTapGesture, this);
        const pinchGestureHandler = this.tapGestureHandler = manager.createGestureHandler(HandlerType.PINCH, 14).on(GestureHandlerStateEvent, this.onPinchGesture, this);
        
        // gestureHandler.attachToView((this.$refs.subView as any).nativeView);
        tapGestureHandler.attachToView((this.$refs.subView as any).nativeView);
        doubleGestureHandler.attachToView((this.$refs.subView as any).nativeView);
        pinchGestureHandler.attachToView(this.nativeView);
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
    onButtonTap() {
        // console.log('onButtonTap');
        this.bottomSheetHolder.peek();
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
