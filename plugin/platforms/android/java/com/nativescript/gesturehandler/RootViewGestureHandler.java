package com.nativescript.gesturehandler;

import android.content.Context;
import android.view.MotionEvent;
import com.swmansion.gesturehandler.GestureHandler;
import android.os.SystemClock;
import android.view.View;
import android.util.Log;

public class RootViewGestureHandler extends GestureHandler {
    private static final String TAG = "RootViewGestureHandler";
    public RootViewGestureHandler() {
        super();
    }

    public PageLayout getView() {
        return (PageLayout)super.getView();
    }
    protected void onHandle(MotionEvent event) {
        final int currentState = getState();
        if (currentState == GestureHandler.STATE_UNDETERMINED) {
            begin();
            getView().setShouldIntercept(false);
        }
        if (event.getActionMasked() == MotionEvent.ACTION_UP) {
            end();
        }
    }

    protected void onCancel() {
        if (GestureHandler.debug) {
            Log.d("JS", "RootViewGestureHandler onCancel");
        }
        getView().setShouldIntercept(true);
        final long time = SystemClock.uptimeMillis();
        final MotionEvent event = MotionEvent.obtain(time, time, MotionEvent.ACTION_CANCEL, 0, 0, 0);
        event.setAction(MotionEvent.ACTION_CANCEL);
        getView().setDispatchToOrchestra(false);
        getView().dispatchTouchEvent(event);
        getView().setDispatchToOrchestra(true);
    }
    // public boolean shouldRecognizeSimultaneously(GestureHandler handler) {
    //     return true;
    // }
}