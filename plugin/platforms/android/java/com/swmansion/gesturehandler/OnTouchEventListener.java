package com.swmansion.gesturehandler;

import android.view.MotionEvent;

public interface OnTouchEventListener<T extends GestureHandler> {
  boolean shouldStartGesture(T handler, MotionEvent event);

  void onTouchEvent(T handler, MotionEvent event);

  void onStateChange(T handler, int newState, int oldState);
}
