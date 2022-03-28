package com.nativescript.gesturehandler;

import android.content.Context;
import android.view.ViewGroup;
import android.os.IBinder;
import android.view.View;
import android.view.KeyEvent;
import android.util.AttributeSet;
import android.view.inputmethod.InputMethodManager;
import android.util.Log;

import com.swmansion.gesturehandler.GestureHandler;

import java.util.HashMap;

public class GestureHandlerInteractionController implements com.swmansion.gesturehandler.GestureHandlerInteractionController {
    private HashMap<Number, int[]> mWaitForRelations = new HashMap();
    private HashMap<Number, int[]> mSimultaneousRelations = new HashMap();

    public GestureHandlerInteractionController() {
        super();
    }

    public void dropRelationsForHandlerWithTag(int handlerTag) {
        mWaitForRelations.remove(handlerTag);
        mSimultaneousRelations.remove(handlerTag);
    }

    public void configureInteractions(com.swmansion.gesturehandler.GestureHandler handler, int[] waitFor,
            int[] simultaneousHandlers) {
        handler.setInteractionController(this);
        if (waitFor != null) {
            mWaitForRelations.put(handler.getTag(), waitFor);
        }
        if (simultaneousHandlers != null) {
            mSimultaneousRelations.put(handler.getTag(), simultaneousHandlers);
        }
    }

    public boolean shouldWaitForHandlerFailure(GestureHandler handler, GestureHandler otherHandler) {
        int[] waitForTags = mWaitForRelations.get(handler.getTag());
        if (waitForTags != null) {
            for (int i = 0; i < waitForTags.length; i++) {
                if (waitForTags[i] == otherHandler.getTag()) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean shouldRequireHandlerToWaitForFailure(GestureHandler handler, GestureHandler otherHandler) {
        return false;
    }

    public boolean shouldHandlerBeCancelledBy(GestureHandler handler, GestureHandler otherHandler) {
        return false;
    }

    public boolean shouldRecognizeSimultaneously(GestureHandler handler, GestureHandler otherHandler) {
        int[] simultHandlerTags = mSimultaneousRelations.get(handler.getTag());
        if (GestureHandler.debug) {
            Log.d("JS", "GestureHandlerInteractionController shouldRecognizeSimultaneously " + handler + " " + otherHandler + " " + simultHandlerTags);
        }
        if (simultHandlerTags != null) {
            for (int i = 0; i < simultHandlerTags.length; i++) {
                if (simultHandlerTags[i] == otherHandler.getTag()) {
                    return true;
                }
            }
        }
        return false;
    }

    public void reset() {
        mWaitForRelations.clear();
        mSimultaneousRelations.clear();
    }
}