package com.nativescript.gesturehandler;

import android.content.Context;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import org.nativescript.widgets.ItemSpec;
import org.nativescript.widgets.GridUnitType;

import com.swmansion.gesturehandler.GestureHandlerOrchestrator;
import com.swmansion.gesturehandler.GestureHandlerRegistryImpl;
import com.swmansion.gesturehandler.PointerEventsConfig;
import com.swmansion.gesturehandler.ViewConfigurationHelper;

public class PageLayout extends org.nativescript.widgets.GridLayout {
    public PageLayout(Context context) {
        super(context);
        addRow(new ItemSpec(1, GridUnitType.auto));
        addRow(new ItemSpec(1, GridUnitType.star));
    }
    private final static int GESTURE_HANDLER_TAG = -12345;

    private GestureHandlerOrchestrator mOrchestrator;
    private GestureHandlerRegistryImpl mRegistry;
    private ViewConfigurationHelper configurationHelper;
    RootViewGestureHandler rootGestureHandler;

    private boolean mShouldIntercept = false;
    private boolean mPassingTouch = false;

    public void setShouldIntercept(boolean value) {
        this.mShouldIntercept = value;
    }

    public void setPassingTouch(boolean value) {
        this.mPassingTouch = value;
    }

    public GestureHandlerRegistryImpl registry() {
        return this.mRegistry;
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
    public void tryCancelAllHandlers() {
        // In order to cancel handlers we activate handler that is hooked to the root view
        if (this.rootGestureHandler != null && this.rootGestureHandler.getState() == com.swmansion.gesturehandler.GestureHandler.STATE_BEGAN) {
            // Try activate main JS handler
            this.rootGestureHandler.activate();
            this.rootGestureHandler.end();
        }
    }

    public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
        // If this method gets called it means that some native view is attempting to grab lock for
        // touch event delivery. In that case we cancel all gesture recognizers
        if (this.mOrchestrator != null && !this.mPassingTouch) {
            // if we are in the process of delivering touch events via GH orchestrator, we don't want to
            // treat it as a native gesture capturing the lock
            this.tryCancelAllHandlers();
        }
        super.requestDisallowInterceptTouchEvent(disallowIntercept);
    }

    public boolean dispatchTouchEventToOrchestrator(MotionEvent ev) {
        this.mPassingTouch = true;
        this.mOrchestrator.onTouchEvent(ev);
        this.mPassingTouch = false;

        return this.mShouldIntercept;
    }

    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (this.dispatchTouchEventToOrchestrator(ev)) {
            return true;
        }
        final boolean handled = super.dispatchTouchEvent(ev);
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
    public void initialize() {
        this.mRegistry = new com.swmansion.gesturehandler.GestureHandlerRegistryImpl();
        this.configurationHelper = new com.swmansion.gesturehandler.ViewConfigurationHelper() {
            public PointerEventsConfig getPointerEventsConfigForView(View view) {
                return view.isEnabled() ? com.swmansion.gesturehandler.PointerEventsConfig.AUTO : com.swmansion.gesturehandler.PointerEventsConfig.NONE;
            }

            public boolean isViewClippingChildren(ViewGroup parent) {
                return false;
            }

            public View getChildInDrawingOrderAtIndex(ViewGroup parent, int index) {
                return parent.getChildAt(index);
            }
        };
        this.mOrchestrator = new com.swmansion.gesturehandler.GestureHandlerOrchestrator(this, this.mRegistry, this.configurationHelper);
        // console.log(this.constructor.name, 'initialize', this.mOrchestrator, this.mRegistry);
        this.mOrchestrator.setMinimumAlphaForTraversal(0.01f);

        this.rootGestureHandler = new RootViewGestureHandler();
        this.rootGestureHandler.setTag(GESTURE_HANDLER_TAG);
        this.mRegistry.registerHandler(this.rootGestureHandler);
        // registry.attachHandlerToView(this.rootGestureHandler.getTag(), this);
    }

    public void tearDown() {
        this.configurationHelper = null;
        this.mOrchestrator = null;
        this.mRegistry = null;
        // if (this.mGestureRootHelper != null) {
        //     this.mGestureRootHelper.tearDown();
        //     this.mGestureRootHelper = null;
        // }
    }
}