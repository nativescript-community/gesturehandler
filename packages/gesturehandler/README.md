<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
<!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      DO NOT EDIT THIS READEME DIRECTLY! Edit "bluesprint.md" instead.
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<h1 align="center">@nativescript-community/gesturehandler</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/gesturehandler?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/gesturehandler.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/gesturehandler"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/gesturehandler.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Declarative API exposing platform native touch and gesture system to NativeScript.</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
* [API](#api)
			* [TypeScript](#typescript)
* [GestureRootView](#gesturerootview)
* [Overriding Nativescript gestures](#overriding-nativescript-gestures)
* [Credits](#credits)
	* [Examples:](#examples)
* [Demos and Development](#demos-and-development)
	* [Setup](#setup)
	* [Build](#build)
	* [Demos](#demos)
* [Questions](#questions)


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/gesturehandler`


[](#api)

## API

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


[](#gesturerootview)

## GestureRootView

For the gestures to work correctly we need a `root` view which knows how to handle the gestures.
If using `Page` (thus `Frame`) you don't need to do anything.
In case you don't (drawer root view, modals, ...) then you can wrap your views in a `GestureRootView` which inherits `GridLayout`


[](#overriding-nativescript-gestures)

## Overriding Nativescript gestures

This plugin can also override N gestures completely. This would give much more control over gestures and especially would allow to correctly handle simultaneous gestures likes `tap` and `longpress`

To do that 


[](#credits)

## Credits

This is a port of [react-native-gesturehandler](https://kmagiera.github.io/react-native-gesture-handler/).
The source is based on the source code by [Krzysztof Magiera](https://github.com/kmagiera). Dont hesitate to go and thank him for his work!



### Examples:

- [Basic](demo-snippets/vue/Basic.vue)
  - A basic example showing that overriding N gestures works, even in modals


[](#demos-and-development)

## Demos and Development


### Setup

To run the demos, you must clone this repo **recursively**.

```
git clone https://github.com/@nativescript-community/gesturehandler.git --recursive
```

**Install Dependencies:**
```bash
npm i # or 'yarn install' or 'pnpm install'
```

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build

npm run build.angular # or for Angular
```

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).