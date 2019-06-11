import {
    applyMixins,
    BaseNative,
    GestureHandlerStateEvent,
    GestureHandlerTouchEvent,
    GestureState,
    GestureStateEventData,
    GestureTouchEventData,
    HandlerType,
    install as installBase,
    Manager as ManagerBase,
    nativeProperty,
    OptionsTypeMap,
    TypeMap,
    ViewDisposeEvent,
    ViewInitEvent
} from './gesturehandler.common';
import { View } from 'tns-core-modules/ui/core/view';
import { layout } from 'tns-core-modules/utils/utils';
import { android as androidApp } from 'tns-core-modules/application/application';
import {
    FlingGestureHandlerOptions,
    HandlerOptions,
    LongPressGestureHandlerOptions,
    NativeViewGestureHandlerOptions,
    PanGestureHandlerOptions,
    PinchGestureHandlerOptions,
    RotationGestureHandlerOptions,
    TapGestureHandlerOptions
} from './gesturehandler';
import { Page } from 'tns-core-modules/ui/page/page';
export { GestureState, GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureStateEventData, GestureTouchEventData, HandlerType, ViewInitEvent, ViewDisposeEvent };

export let RootViewGestureHandler: RootViewGestureHandler;
export interface RootViewGestureHandler extends com.swmansion.gesturehandler.GestureHandler<RootViewGestureHandler> {
    // tslint:disable-next-line: no-misused-new
    new (): RootViewGestureHandler;
}
function initRootViewGestureHandler() {
    if (RootViewGestureHandler) {
        return;
    }
    class RootViewGestureHandlerImpl extends com.swmansion.gesturehandler.GestureHandler<RootViewGestureHandler> {
        constructor() {
            super();
            return global.__native(this);
        }

        getView() {
            return super.getView() as PageLayout;
        }
        onHandle(event) {
            const currentState = this.getState();
            if (currentState === com.swmansion.gesturehandler.GestureHandler.STATE_UNDETERMINED) {
                this.begin();
                this.getView().setShouldIntercept(true);
            }
            if (event.getActionMasked() === android.view.MotionEvent.ACTION_UP) {
                this.end();
            }
        }

        onCancel() {
            this.getView().setShouldIntercept(false);
            const time = android.os.SystemClock.uptimeMillis();
            const event = android.view.MotionEvent.obtain(time, time, android.view.MotionEvent.ACTION_CANCEL, 0, 0, 0);
            event.setAction(android.view.MotionEvent.ACTION_CANCEL);
        }
    }
    RootViewGestureHandler = RootViewGestureHandlerImpl as any;
}

export let PageLayout: PageLayout;
export interface PageLayout extends org.nativescript.widgets.GridLayout {
    // tslint:disable-next-line: no-misused-new
    new (context): PageLayout;
    setShouldIntercept(value: boolean);
    setPassingTouch(value: boolean);
}
function initPageLayout() {
    if (PageLayout) {
        return;
    }
    class PageLayoutImpl extends org.nativescript.widgets.GridLayout {
        constructor(context) {
            super(context);
            return global.__native(this);
        }
        // mGestureRootHelper: GestureHandlerRootHelper;

        mOrchestrator: com.swmansion.gesturehandler.GestureHandlerOrchestrator;
        configurationHelper: com.swmansion.gesturehandler.ViewConfigurationHelper;
        rootGestureHandler: RootViewGestureHandler;

        mShouldIntercept = false;
        mPassingTouch = false;

        setShouldIntercept(value) {
            this.mShouldIntercept = value;
        }
        setPassingTouch(value) {
            this.mPassingTouch = value;
        }
        // requestDisallowInterceptTouchEvent(disallowIntercept) {
        //     console.log('requestDisallowInterceptTouchEvent');
        //     if (this.mGestureRootHelper != null) {
        //         this.mGestureRootHelper.requestDisallowInterceptTouchEvent(disallowIntercept);
        //     }
        //     super.requestDisallowInterceptTouchEvent(disallowIntercept);
        // }

        // dispatchTouchEvent(ev) {
        //     if (this.mGestureRootHelper != null && this.mGestureRootHelper.dispatchTouchEvent(ev)) {
        //         return true;
        //     }
        //     return super.dispatchTouchEvent(ev);
        // }
        tryCancelAllHandlers() {
            // In order to cancel handlers we activate handler that is hooked to the root view
            if (this.rootGestureHandler != null && this.rootGestureHandler.getState() === com.swmansion.gesturehandler.GestureHandler.STATE_BEGAN) {
                // Try activate main JS handler
                this.rootGestureHandler.activate();
                this.rootGestureHandler.end();
            }
        }

        requestDisallowInterceptTouchEvent(disallowIntercept) {
            // console.log('requestDisallowInterceptTouchEvent', disallowIntercept);
            // If this method gets called it means that some native view is attempting to grab lock for
            // touch event delivery. In that case we cancel all gesture recognizers
            if (this.mOrchestrator != null && !this.mPassingTouch) {
                // if we are in the process of delivering touch events via GH orchestrator, we don't want to
                // treat it as a native gesture capturing the lock
                this.tryCancelAllHandlers();
            }
            super.requestDisallowInterceptTouchEvent(disallowIntercept);
        }

        dispatchTouchEventToOrchestrator(ev: android.view.MotionEvent) {
            // console.log('dispatchTouchEventToOrchestrator', ev, this.mShouldIntercept);
            this.mPassingTouch = true;
            this.mOrchestrator.onTouchEvent(ev);
            this.mPassingTouch = false;

            return this.mShouldIntercept;
        }

        dispatchTouchEvent(ev: android.view.MotionEvent) {
            if (this.dispatchTouchEventToOrchestrator(ev)) {
                return true;
            }
            const handled = super.dispatchTouchEvent(ev);
            // console.log('dispatchTouchEvent', ev, handled, this.mShouldIntercept);
            // we need to always return true or gestures wont work on layouts because they don't handle touch so dispatchTouchEvent returns false
            return true;
        }

        // onInterceptTouchEvent(ev: android.view.MotionEvent) {
        //     return this.mShouldIntercept;
        // }

        // onTouchEvent(ev: android.view.MotionEvent) {
        //     console.log('onTouchEvent', ev);
        //     this.mOrchestrator.onTouchEvent(ev);
        //     return super.onTouchEvent(ev);
        // }

        /**
         * This method is used to enable root view to start processing touch events through the gesture
         * handler library logic. Unless this method is called (which happens as a result of instantiating
         * new gesture handler from JS) the root view component will just proxy all touch related methods
         * to its superclass. Thus in the "disabled" state all touch related events will fallback to
         * default RN behavior.
         */
        initialize() {
            const registry = Manager.getInstance().registry;
            this.configurationHelper = new com.swmansion.gesturehandler.ViewConfigurationHelper({
                getPointerEventsConfigForView(view: android.view.View) {
                    return view.isEnabled() ? com.swmansion.gesturehandler.PointerEventsConfig.AUTO : com.swmansion.gesturehandler.PointerEventsConfig.NONE;
                },
                isViewClippingChildren(parent: android.view.ViewGroup) {
                    return false;
                },
                getChildInDrawingOrderAtIndex(parent: android.view.ViewGroup, index: number) {
                    return parent.getChildAt(index);
                }
            });
            this.mOrchestrator = new com.swmansion.gesturehandler.GestureHandlerOrchestrator(this, registry, this.configurationHelper);
            this.mOrchestrator.setMinimumAlphaForTraversal(0.01);

            initRootViewGestureHandler();
            const tag = -12345;
            this.rootGestureHandler = new RootViewGestureHandler();
            this.rootGestureHandler.setTag(tag);
            registry.registerHandler(this.rootGestureHandler);
            // registry.attachHandlerToView(this.rootGestureHandler.getTag(), this);
        }
        tearDown() {
            this.configurationHelper = null;
            this.mOrchestrator = null;
            // if (this.mGestureRootHelper != null) {
            //     this.mGestureRootHelper.tearDown();
            //     this.mGestureRootHelper = null;
            // }
        }
    }
    PageLayout = PageLayoutImpl as any;
}

class PageGestureExtended extends Page {
    initNativeView() {
        this.nativeView.initialize();
    }
    disposeNativeView() {
        this.nativeView.tearDown();
    }
}
export function install() {
    installBase();
    const NSPage = require('tns-core-modules/ui/page/page').Page;
    NSPage.prototype.createNativeView = function() {
        initPageLayout();
        const layout = new PageLayout(this._context);
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        layout.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        return layout;
    };
    applyMixins(NSPage, [PageGestureExtended]);
}

const KEY_HIT_SLOP_LEFT = 'left';
const KEY_HIT_SLOP_TOP = 'top';
const KEY_HIT_SLOP_RIGHT = 'right';
const KEY_HIT_SLOP_BOTTOM = 'bottom';
const KEY_HIT_SLOP_VERTICAL = 'vertical';
const KEY_HIT_SLOP_HORIZONTAL = 'horizontal';
const KEY_HIT_SLOP_WIDTH = 'width';
const KEY_HIT_SLOP_HEIGHT = 'height';

export abstract class Handler<T extends com.swmansion.gesturehandler.GestureHandler<any>, U extends HandlerOptions> extends BaseNative<T, U> {
    @nativeProperty({
        nativeSetterName: 'setHitSlop',
        nativegetterName: 'getHitSlop',
        converter: {
            toNative(value) {
                const HIT_SLOP_NONE = com.swmansion.gesturehandler.GestureHandler.HIT_SLOP_NONE;
                if (typeof value === 'number') {
                    const hitSlop = layout.toDevicePixels(value);
                    return [hitSlop, hitSlop, hitSlop, hitSlop, HIT_SLOP_NONE, HIT_SLOP_NONE];
                } else {
                    let left = HIT_SLOP_NONE,
                        top = HIT_SLOP_NONE,
                        right = HIT_SLOP_NONE,
                        bottom = HIT_SLOP_NONE;
                    let width = HIT_SLOP_NONE,
                        height = HIT_SLOP_NONE;
                    if (value.hasOwnProperty(KEY_HIT_SLOP_HORIZONTAL)) {
                        const horizontalPad = layout.toDevicePixels(value[KEY_HIT_SLOP_HORIZONTAL]);
                        left = right = horizontalPad;
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_VERTICAL)) {
                        const verticalPad = layout.toDevicePixels(value[KEY_HIT_SLOP_VERTICAL]);
                        top = bottom = verticalPad;
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_LEFT)) {
                        left = layout.toDevicePixels(value[KEY_HIT_SLOP_LEFT]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_TOP)) {
                        top = layout.toDevicePixels(value[KEY_HIT_SLOP_TOP]);
                    }
                    if (value.hasKey(KEY_HIT_SLOP_RIGHT)) {
                        right = layout.toDevicePixels(value[KEY_HIT_SLOP_RIGHT]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_BOTTOM)) {
                        bottom = layout.toDevicePixels(value[KEY_HIT_SLOP_BOTTOM]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_WIDTH)) {
                        width = layout.toDevicePixels(value[KEY_HIT_SLOP_WIDTH]);
                    }
                    if (value.hasOwnProperty(KEY_HIT_SLOP_HEIGHT)) {
                        height = layout.toDevicePixels(value[KEY_HIT_SLOP_HEIGHT]);
                    }
                    return [left, top, right, bottom, width, height];
                }
            }
        }
    })
    hitSlop;
    @nativeProperty enabled: boolean;
    @nativeProperty shouldCancelWhenOutside: boolean;
    manager: WeakRef<Manager>;
    touchListener: com.swmansion.gesturehandler.OnTouchEventListener<T>;

    getExtraData(handler: T) {
        return {
            numberOfPointers: handler.getNumberOfPointers()
        };
    }
    initNativeView(native: T, options: U) {
        super.initNativeView(native, options);
        this.native.setTag(this.tag);
        this.touchListener = new com.swmansion.gesturehandler.OnTouchEventListener({
            onTouchEvent: (handler, event: android.view.MotionEvent) => {
                // console.log('onTouchEvent', handler, event.getAction());
                const view = handler.getView() as any;
                this.notify({
                    eventName: GestureHandlerTouchEvent,
                    object: this,
                    data: {
                        state: handler.getState(),
                        android: view,
                        extraData: this.getExtraData(handler),
                        view: view.nsView ? view.nsView.get() : null
                    }
                });
            },
            onStateChange: (handler, state, prevState) => {
                const view = handler.getView() as any;
                this.notify({
                    eventName: GestureHandlerStateEvent,
                    object: this,
                    data: {
                        state,
                        prevState,
                        android: view,
                        extraData: this.getExtraData(handler),
                        view: view.nsView ? view.nsView.get() : null
                    }
                });
            }
        });
        native.setOnTouchEventListener(this.touchListener);
        this.manager.get().configureInteractions(this, options);
    }
    disposeNativeView() {
        this.native.setInteractionController(null);
        this.native.setOnTouchEventListener(null);
        this.touchListener = null;
        super.disposeNativeView();
    }
    onTouchEvent(handler: T, event: android.view.MotionEvent) {}
    onStateChange(handler: T, state: number, prevState: number) {}

    tag: number = 0;
    setTag(tag: number) {
        this.tag = tag;
        if (this.native) {
            this.native.setTag(tag);
        }
        console.log('setTag', tag);
    }
    getTag() {
        return this.tag;
        // return this.getNative().getTag();
    }
    getView() {
        return this.getNative().getView();
    }
    cancel() {
        return this.getNative().cancel();
    }

    attachToView(view: View) {
        this.manager.get().attachGestureHandler(this, view);
    }
    detachFromView(view: View) {
        this.manager.get().detachGestureHandler(this, view);
    }
}

export class TapGestureHandler extends Handler<com.swmansion.gesturehandler.TapGestureHandler, TapGestureHandlerOptions> {
    @nativeProperty numberOfTaps: number;
    @nativeProperty maxDurationMs: number;
    @nativeProperty maxDelayMs: number;
    @nativeProperty({ nativeSetterName: 'setMaxDx' }) maxDeltaX: number;
    @nativeProperty({ nativeSetterName: 'setMaxDy' }) maxDeltaY: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) maxDist: number;
    @nativeProperty({ nativeSetterName: 'setMinNumberOfPointers' }) minPointers: number;
    createNative(options) {
        return new com.swmansion.gesturehandler.TapGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.TapGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            x: layout.toDeviceIndependentPixels(handler.getLastRelativePositionX()),
            y: layout.toDeviceIndependentPixels(handler.getLastRelativePositionY()),
            absoluteX: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionX()),
            absoluteY: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionY())
        });
    }
}

export class PanGestureHandler extends Handler<com.swmansion.gesturehandler.PanGestureHandler, PanGestureHandlerOptions> {
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minDist: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetXStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetXEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetXStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetXEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetYStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) activeOffsetYEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetYStart: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) failOffsetYEnd: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minVelocity: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minVelocityX: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) minVelocityY: number;
    @nativeProperty minPointers: number;
    @nativeProperty maxPointers: number;
    @nativeProperty({ nativeSetterName: 'setAverageTouches' }) avgTouches: number;
    @nativeProperty numberOfPointers: number;
    createNative(options) {
        const context = androidApp.context as android.content.Context;
        return new com.swmansion.gesturehandler.PanGestureHandler(context);
    }
    getExtraData(handler: com.swmansion.gesturehandler.PanGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            x: layout.toDeviceIndependentPixels(handler.getLastRelativePositionX()),
            y: layout.toDeviceIndependentPixels(handler.getLastRelativePositionY()),
            absoluteX: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionX()),
            absoluteY: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionY()),
            translationX: layout.toDeviceIndependentPixels(handler.getTranslationX()),
            translationY: layout.toDeviceIndependentPixels(handler.getTranslationY()),
            velocityX: layout.toDeviceIndependentPixels(handler.getVelocityX()),
            velocityY: layout.toDeviceIndependentPixels(handler.getVelocityY())
        });
    }
}

export class PinchGestureHandler extends Handler<com.swmansion.gesturehandler.PinchGestureHandler, PinchGestureHandlerOptions> {
    createNative(options) {
        return new com.swmansion.gesturehandler.PinchGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.PinchGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            scale: handler.getScale(),
            focalX: layout.toDeviceIndependentPixels(handler.getFocalPointX()),
            focalY: layout.toDeviceIndependentPixels(handler.getFocalPointY()),
            velocity: handler.getVelocity()
        });
    }
}

export class FlingGestureHandler extends Handler<com.swmansion.gesturehandler.FlingGestureHandler, TapGestureHandlerOptions> {
    @nativeProperty numberOfPointers: number;
    @nativeProperty direction: number;
    createNative(options) {
        return new com.swmansion.gesturehandler.FlingGestureHandler();
    }
    // getExtraData(handler: com.swmansion.gesturehandler.FlingGestureHandler) {
    //     return Object.assign(super.getExtraData(handler), {
    //         scale: handler.getScale(),
    //         focalX: layout.toDeviceIndependentPixels(handler.getFocalPointX()),
    //         focalY: layout.toDeviceIndependentPixels(handler.getFocalPointY()),
    //         velocity: handler.getVelocity()
    //     });
    // }
}
export class LongPressGestureHandler extends Handler<com.swmansion.gesturehandler.LongPressGestureHandler, LongPressGestureHandlerOptions> {
    @nativeProperty minDurationMs: number;
    @nativeProperty({ converter: { fromNative: layout.toDevicePixels } }) maxDist: number;
    createNative(options) {
        const context = androidApp.context as android.content.Context;
        return new com.swmansion.gesturehandler.LongPressGestureHandler(context);
    }
    // getExtraData(handler: com.swmansion.gesturehandler.LongPressGestureHandler) {
    //     return Object.assign(super.getExtraData(handler), {
    //         x: layout.toDeviceIndependentPixels(handler.getLastRelativePositionX()),
    //         y: layout.toDeviceIndependentPixels(handler.getLastRelativePositionY()),
    //         absoluteX: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionX()),
    //         absoluteY: layout.toDeviceIndependentPixels(handler.getLastAbsolutePositionY())
    //     });
    // }
}
export class RotationGestureHandler extends Handler<com.swmansion.gesturehandler.RotationGestureHandler, RotationGestureHandlerOptions> {
    createNative(options) {
        return new com.swmansion.gesturehandler.RotationGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.RotationGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            rotation: handler.getRotation(),
            anchorX: layout.toDeviceIndependentPixels(handler.getAnchorX()),
            anchorY: layout.toDeviceIndependentPixels(handler.getAnchorY()),
            velocity: handler.getVelocity()
        });
    }
}

export class NativeViewGestureHandler extends Handler<com.swmansion.gesturehandler.NativeViewGestureHandler, NativeViewGestureHandlerOptions> {
    @nativeProperty shouldActivateOnStart: boolean;
    @nativeProperty disallowInterruption: boolean;
    createNative(options) {
        return new com.swmansion.gesturehandler.NativeViewGestureHandler();
    }
    getExtraData(handler: com.swmansion.gesturehandler.NativeViewGestureHandler) {
        return Object.assign(super.getExtraData(handler), {
            pointerInside: handler.isWithinBounds()
        });
    }
}
export let GestureHandlerInteractionController: GestureHandlerInteractionController;
export interface GestureHandlerInteractionController extends com.swmansion.gesturehandler.GestureHandlerInteractionController {
    // tslint:disable-next-line: no-misused-new
    new (): GestureHandlerInteractionController;
    configureInteractions<T extends com.swmansion.gesturehandler.GestureHandler<any>, U extends HandlerOptions>(handler: com.swmansion.gesturehandler.GestureHandler<T>, config: U);
    // owner: WeakRef<Pager>;
}
function initGestureHandlerInteractionController() {
    if (GestureHandlerInteractionController) {
        return;
    }
    class GestureHandlerInteractionControllerImpl extends com.swmansion.gesturehandler.GestureHandlerInteractionController {
        constructor() {
            super();
            return global.__native(this);
        }
        mWaitForRelations: { [k: number]: number[] } = {};
        mSimultaneousRelations: { [k: number]: number[] } = {};

        dropRelationsForHandlerWithTag(handlerTag: number) {
            delete this.mWaitForRelations[handlerTag];
            delete this.mSimultaneousRelations[handlerTag];
        }

        configureInteractions<T extends com.swmansion.gesturehandler.GestureHandler<any>, U extends HandlerOptions>(handler: com.swmansion.gesturehandler.GestureHandler<T>, config: U) {
            handler.setInteractionController(this);
            if (config) {
                console.log('configureInteractions', handler.getTag(), config);
                if (config.waitFor) {
                    this.mWaitForRelations[handler.getTag()] = config.waitFor;
                }
                if (config.simultaneousHandlers) {
                    this.mSimultaneousRelations[handler.getTag()] = config.simultaneousHandlers;
                }
            }
        }

        shouldWaitForHandlerFailure(handler: com.swmansion.gesturehandler.GestureHandler<any>, otherHandler: com.swmansion.gesturehandler.GestureHandler<any>) {
            const waitForTags = this.mWaitForRelations[handler.getTag()];
            console.log('shouldWaitForHandlerFailure', handler.getTag(), waitForTags);
            if (waitForTags != null) {
                for (let i = 0; i < waitForTags.length; i++) {
                    if (waitForTags[i] === otherHandler.getTag()) {
                        return true;
                    }
                }
            }
            return false;
        }

        shouldRequireHandlerToWaitForFailure(handler: com.swmansion.gesturehandler.GestureHandler<any>, otherHandler: com.swmansion.gesturehandler.GestureHandler<any>) {
            return false;
        }

        shouldHandlerBeCancelledBy(handler: com.swmansion.gesturehandler.GestureHandler<any>, otherHandler: com.swmansion.gesturehandler.GestureHandler<any>) {
            return false;
        }

        shouldRecognizeSimultaneously(handler: com.swmansion.gesturehandler.GestureHandler<any>, otherHandler: com.swmansion.gesturehandler.GestureHandler<any>) {
            const simultHandlerTags = this.mSimultaneousRelations[handler.getTag()];
            console.log('shouldRecognizeSimultaneously', handler.getTag(), simultHandlerTags);
            if (simultHandlerTags != null) {
                for (let i = 0; i < simultHandlerTags.length; i++) {
                    if (simultHandlerTags[i] === otherHandler.getTag()) {
                        return true;
                    }
                }
            }
            return false;
        }

        reset() {
            this.mWaitForRelations = {};
            this.mSimultaneousRelations = {};
        }
    }
    GestureHandlerInteractionController = GestureHandlerInteractionControllerImpl as any;
}

export class Manager extends ManagerBase {
    _interactionManager: GestureHandlerInteractionController;
    configureInteractions<T extends com.swmansion.gesturehandler.GestureHandler<any>, U extends HandlerOptions>(handler: Handler<T, U>, options: U) {
        this.interactionManager.configureInteractions(handler.getNative(), options);
    }
    get interactionManager() {
        if (!this._interactionManager) {
            initGestureHandlerInteractionController();
            this._interactionManager = new GestureHandlerInteractionController();
        }
        return this._interactionManager;
    }
    _registry: com.swmansion.gesturehandler.GestureHandlerRegistryImpl;
    get registry() {
        if (!this._registry) {
            this._registry = new com.swmansion.gesturehandler.GestureHandlerRegistryImpl();
        }
        return this._registry;
    }

    static sManager: Manager;
    static getInstance() {
        if (!Manager.sManager) {
            Manager.sManager = new Manager();
        }
        return Manager.sManager;
    }
    createGestureHandler<T extends HandlerType>(handlerName: T, handlerTag: number, config?: OptionsTypeMap[T]): TypeMap[T] {
        let handler: Handler<any, any> = null;
        switch (handlerName) {
            case 'tap':
                handler = new TapGestureHandler(config);
                break;
            case 'pan':
                handler = new PanGestureHandler(config);
                break;
            case 'nativeView':
                handler = new NativeViewGestureHandler(config);
                break;
            case 'pinch':
                handler = new PinchGestureHandler(config);
                break;
            case 'fling':
                handler = new FlingGestureHandler(config);
                break;
            case 'rotation':
                handler = new RotationGestureHandler(config);
                break;
            case 'longPress':
                handler = new LongPressGestureHandler(config);
                break;
        }
        if (handler) {
            handler.manager = new WeakRef(this);
            handler.setTag(handlerTag);
        }
        return handler as any;
    }
    attachGestureHandlerToView(handler: Handler<any, any>, view) {
        const nHandler = handler.getNative();
        if (nHandler) {
            this.registry.registerHandler(nHandler);
            this.registry.attachHandlerToView(nHandler.getTag(), view);
        }
    }

    viewListeners = new Map<View, Map<number, { init: () => void; dispose: () => void }>>();
    attachGestureHandler(handler: Handler<any, any>, view: View) {
        if (view.nativeView) {
            this.attachGestureHandlerToView(handler, view.nativeView);
        }
        const onInit = () => {
            this.attachGestureHandlerToView(handler, view.nativeView);
        };
        const onDispose = () => this.registry.dropHandler(handler.getNative());
        view.on(ViewInitEvent, onInit, this);
        view.on(ViewDisposeEvent, onDispose, this);
        let viewListeners = this.viewListeners.get(view);
        if (!viewListeners) {
            viewListeners = new Map();
            this.viewListeners.set(view, viewListeners);
        }
        viewListeners.set(handler.getTag(), {
            init: onInit,
            dispose: onDispose
        });
    }
    detachGestureHandler(handler: Handler<any, any>, view: View) {
        if (view) {
            const viewListeners = this.viewListeners.get(view);
            if (viewListeners) {
                const listeners = viewListeners.get(handler.getTag());
                if (listeners) {
                    view.off(ViewInitEvent, listeners.init, this);
                    view.off(ViewDisposeEvent, () => listeners.dispose, this);
                    viewListeners.delete(handler.getTag());
                    if (viewListeners.size === 0) {
                        this.viewListeners.delete(view);
                    }
                }
            }
        }
        this.registry.dropHandler(handler.getTag());
    }
}
