package com.swmansion.gesturehandler;

import android.os.Handler;
import android.view.MotionEvent;

public class FlingGestureHandler extends GestureHandler<FlingGestureHandler> {
  private static final long DEFAULT_MAX_DURATION_MS = 800;
  private static final long DEFAULT_MIN_ACCEPTABLE_DELTA = 160;
  private static final int DEFAULT_DIRECTION = DIRECTION_RIGHT | DIRECTION_LEFT | DIRECTION_UP | DIRECTION_DOWN;
  private static final int DEFAULT_NUMBER_OF_TOUCHES_REQUIRED = 1;

  private long mMaxDurationMs = DEFAULT_MAX_DURATION_MS;
  private long mMinAcceptableDelta = DEFAULT_MIN_ACCEPTABLE_DELTA;
  private int mDirection = DEFAULT_DIRECTION;
  private int mNumberOfPointersRequired = DEFAULT_NUMBER_OF_TOUCHES_REQUIRED;
  private float mStartX, mStartY;
  private int mLastDirection = -1;
  private Handler mHandler;
  private int mMaxNumberOfPointersSimultaneously;

  private final Runnable mFailDelayed = new Runnable() {
    @Override
    public void run() {
      fail();
    }
  };

  public void setNumberOfPointersRequired(int numberOfPointersRequired) {
    mNumberOfPointersRequired = numberOfPointersRequired;
  }

  public void setDirection(int direction) {
    mDirection = direction;
  }

  public int getRecognizedDirection() {
    return mLastDirection;
  }

  private void startFling(MotionEvent event) {
    mStartX = event.getRawX();
    mStartY = event.getRawY();
    begin();
    mMaxNumberOfPointersSimultaneously = 1;
    if (mHandler == null) {
      mHandler = new Handler();
    } else {
      mHandler.removeCallbacksAndMessages(null);
    }
    mHandler.postDelayed(mFailDelayed, mMaxDurationMs);
  }

  private boolean tryEndFling(MotionEvent event) {
    mLastDirection = -1;
    if (mMaxNumberOfPointersSimultaneously == mNumberOfPointersRequired) {
      if ((mDirection & DIRECTION_RIGHT) != 0 && event.getRawX() - mStartX > mMinAcceptableDelta) {
        mLastDirection = DIRECTION_RIGHT;
      } else if ((mDirection & DIRECTION_LEFT) != 0 && mStartX - event.getRawX() > mMinAcceptableDelta) {
        mLastDirection = DIRECTION_LEFT;
      } else if ((mDirection & DIRECTION_UP) != 0 && mStartY - event.getRawY() > mMinAcceptableDelta) {
        mLastDirection = DIRECTION_UP;
      } else if ((mDirection & DIRECTION_DOWN) != 0 && event.getRawY() - mStartY > mMinAcceptableDelta) {
        mLastDirection = DIRECTION_DOWN;
      }
    }
    if (mLastDirection != -1) {
      mHandler.removeCallbacksAndMessages(null);
      activate();
      end();
      return true;
    } else {
      return false;
    }
  }

  private void endFling(MotionEvent event) {
    if (!tryEndFling(event)) {
      fail();
    }

  }

  @Override
  protected void onHandle(MotionEvent event) {
    int state = getState();

    if (state == STATE_UNDETERMINED) {
      startFling(event);
    }

    if (state == STATE_BEGAN) {
      tryEndFling(event);
      if (event.getPointerCount() > mMaxNumberOfPointersSimultaneously) {
        mMaxNumberOfPointersSimultaneously = event.getPointerCount();
      }

      int action = event.getActionMasked();
      if (action == MotionEvent.ACTION_UP) {
        endFling(event);
      }
    }
  }

  @Override
  protected void onCancel() {
    if (mHandler != null) {
      mHandler.removeCallbacksAndMessages(null);
    }
  }

  @Override
  protected void onReset() {
    if (mHandler != null) {
      mHandler.removeCallbacksAndMessages(null);
    }
  }
}
