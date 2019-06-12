[![npm](https://img.shields.io/npm/v/nativescript-gesturehandler.svg)](https://www.npmjs.com/package/nativescript-gesturehandler)
[![npm](https://img.shields.io/npm/dt/nativescript-gesturehandler.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-gesturehandler)
[![GitHub forks](https://img.shields.io/github/forks/Akylas/nativescript-gesturehandler.svg)](https://github.com/Akylas/nativescript-gesturehandler/network)
[![GitHub stars](https://img.shields.io/github/stars/Akylas/nativescript-gesturehandler.svg)](https://github.com/Akylas/nativescript-gesturehandler/stargazers)

[![NPM](https://nodei.co/npm/nativescript-gesturehandler.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nativescript-gesturehandler/)

## Installation

* `tns plugin add nativescript-gesturehandler`

Be sure to run a new build after adding plugins to avoid any issues.

---

This is a port of [react-native-gesturehandler](https://kmagiera.github.io/react-native-gesture-handler/).
The source is based on the source code by [Krzysztof Magiera](https://github.com/kmagiera). Dont hesitate to go and thank him for his work!


## API

You create a gesture handler using something like this:
```typescript 
import { GestureHandlerTouchEvent, GestureHandlerStateEvent, GestureStateEventData, GestureTouchEventData, HandlerType } from 'nativescript-gesturehandler';


function onGestureTouch(args: GestureTouchEventData) {
    const { state, extraData, view } = args.data;
    view.translateX = extraData.translationX;
    view.translateY = extraData.translationY;
}
function onGestureState(args: GestureStateEventData) {
    const { state, prevState, extraData, view } = args.data;
    console.log('onGestureState', state, prevState, view, extraData);
}
const manager = Manager.getInstance();
const gestureHandler = = manager.createGestureHandler(HandlerType.PAN, 10, {
    shouldCancelWhenOutside: false
});
gestureHandler.on(GestureHandlerTouchEvent, onGestureTouch, this);
gestureHandler.on(GestureHandlerStateEvent, onGestureState, this);
gestureHandler.attachToView(view);
```

Right now you must not forget to store the ```gestureHandler``` somewhere or the gesture won't work on iOS (native object being released). This will be fixed in future versions.

Now about the API. All the gestures for the react counterpart exist with the same options and the same event ```extraData```.

