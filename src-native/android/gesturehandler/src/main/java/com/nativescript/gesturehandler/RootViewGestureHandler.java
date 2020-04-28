package com.nativescript.gesturehandler;

import android.content.Context;
import android.view.MotionEvent;
import com.swmansion.gesturehandler.GestureHandler;
import android.os.SystemClock;
import android.view.View;


public class RootViewGestureHandler extends GestureHandler {
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
            getView().setShouldIntercept(true);
        }
        if (event.getActionMasked() == MotionEvent.ACTION_UP) {
            end();
        }
    }

    protected void onCancel() {
        getView().setShouldIntercept(false);
        final long time = SystemClock.uptimeMillis();
        final MotionEvent event = MotionEvent.obtain(time, time, MotionEvent.ACTION_CANCEL, 0, 0, 0);
        event.setAction(MotionEvent.ACTION_CANCEL);
    }
}