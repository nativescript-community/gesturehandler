package com.swmansion.gesturehandler;

import android.util.SparseArray;
import android.view.View;

import com.swmansion.gesturehandler.GestureHandler;
import com.swmansion.gesturehandler.GestureHandlerRegistry;

import java.util.ArrayList;
import java.util.WeakHashMap;

import androidx.annotation.Nullable;

public class GestureHandlerRegistryImpl implements GestureHandlerRegistry {

  private final SparseArray<GestureHandler> mHandlers = new SparseArray<>();
  private final SparseArray<View> mAttachedTo = new SparseArray<>();
  // private final SparseArray<ArrayList<GestureHandler>> mHandlersForView = new
  // SparseArray<>();
  private WeakHashMap<View, ArrayList<GestureHandler>> mHandlersForView = new WeakHashMap<>();

  public synchronized void registerHandler(GestureHandler handler) {
    mHandlers.put(handler.getTag(), handler);
  }

  public synchronized @Nullable GestureHandler getHandler(int handlerTag) {
    return mHandlers.get(handlerTag);
  }

  public synchronized boolean attachHandlerToView(int handlerTag, android.view.View view) {
    GestureHandler handler = mHandlers.get(handlerTag);
    if (handler != null) {
      detachHandler(handler);
      registerHandlerForView(view, handler);
      return true;
    } else {
      return false;
    }
  }

  public synchronized void registerHandlerForView(android.view.View view, GestureHandler handler) {
    if (mAttachedTo.get(handler.getTag()) != null) {
      throw new IllegalStateException("Handler " + handler + " already attached");
    }
    mAttachedTo.put(handler.getTag(), view);
    ArrayList<GestureHandler> listToAdd = mHandlersForView.get(view);
    if (listToAdd == null) {
      listToAdd = new ArrayList<>(1);
      listToAdd.add(handler);
      mHandlersForView.put(view, listToAdd);
    } else {
      listToAdd.add(handler);
    }
  }

  public synchronized void detachHandler(GestureHandler handler) {
    View attachedToView = mAttachedTo.get(handler.getTag());
    if (attachedToView != null) {
      mAttachedTo.remove(handler.getTag());
      ArrayList<GestureHandler> attachedHandlers = mHandlersForView.get(attachedToView);
      if (attachedHandlers != null) {
        attachedHandlers.remove(handler);
        if (attachedHandlers.size() == 0) {
          mHandlersForView.remove(attachedToView);
        }
      }
    }
    if (handler.getView() != null) {
      // Handler is in "prepared" state which means it is registered in the
      // orchestrator and can
      // receive touch events. This means that before we remove it from the registry
      // we need to
      // "cancel" it so that orchestrator does no longer keep a reference to it.
      handler.cancel();
    }
  }

  public synchronized void dropHandler(int handlerTag) {
    GestureHandler handler = mHandlers.get(handlerTag);
    if (handler != null) {
      detachHandler(handler);
      mHandlers.remove(handlerTag);
    }
  }

  public synchronized void dropAllHandlers() {
    mHandlers.clear();
    mAttachedTo.clear();
    mHandlersForView.clear();
  }

  @Override
  public synchronized ArrayList<GestureHandler> getHandlersForView(android.view.View view) {
    return mHandlersForView.get(view);
  }

}