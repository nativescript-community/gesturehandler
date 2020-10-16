[![npm](https://img.shields.io/npm/v/@nativescript-community/gesturehandler.svg)](https://www.npmjs.com/package/@nativescript-community/gesturehandler)
[![npm](https://img.shields.io/npm/dt/@nativescript-community/gesturehandler.svg?label=npm%20downloads)](https://www.npmjs.com/package/@nativescript-community/gesturehandler)
[![GitHub forks](https://img.shields.io/github/forks/nativescript-community/gesturehandler.svg)](https://github.com/nativescript-community/gesturehandler/network)
[![GitHub stars](https://img.shields.io/github/stars/nativescript-community/gesturehandler.svg)](https://github.com/nativescript-community/gesturehandler/stargazers)

[![NPM](https://nodei.co/npm/@nativescript-community/gesturehandler.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@nativescript-community/gesturehandler/)

## Installation

* `tns plugin add @nativescript-community/gesturehandler`

Be sure to run a new build after adding plugins to avoid any issues.

---

This is a port of [react-native-gesturehandler](https://kmagiera.github.io/react-native-gesture-handler/).
The source is based on the source code by [Krzysztof Magiera](https://github.com/kmagiera). Dont hesitate to go and thank him for his work!


## API

First you need to install the plugin:
```shell
tns plugin add @nativescript-community/gesturehandler
```
We need to do some wiring when your app starts, so open `app.ts` and add this before creating any View/App/Frame:
##### TypeScript
```ts
import { install } from "@nativescript-community/gesturehandler";
install();
```

You create a gesture handler using something like this:
```typescript 
import { GestureHandlerTouchEvent, GestureHandlerStateEvent, GestureStateEventData, GestureTouchEventData, HandlerType } from '@nativescript-community/gesturehandler';


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

