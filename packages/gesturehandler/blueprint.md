{{ load:../../tools/readme/edit-warning.md }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}

{{ template:toc }}

## Installation

Run the following command from the root of your project:

`ns plugin add {{ pkg.name }}`

## API

We need to do some wiring when your app starts, so open `app.ts` and add this before creating any View/App/Frame:

##### TypeScript

```ts
import { install } from '@nativescript-community/gesturehandler';
install();
```

You create a gesture handler using something like this:

```typescript
import { GestureHandlerTouchEvent, GestureHandlerStateEvent, GestureStateEventData, GestureTouchEventData, HandlerType, Manager } from '@nativescript-community/gesturehandler';

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
const gestureHandler = manager.createGestureHandler(HandlerType.PAN, 10, {
    shouldCancelWhenOutside: false
});
gestureHandler.on(GestureHandlerTouchEvent, onGestureTouch, this);
gestureHandler.on(GestureHandlerStateEvent, onGestureState, this);
gestureHandler.attachToView(view);
```

Right now you must not forget to store the `gestureHandler` somewhere or the gesture won't work on iOS (native object being released). This will be fixed in future versions.

Now about the API. All the gestures for the react counterpart exist with the same options and the same event `extraData`.

## GestureRootView

For the gestures to work correctly we need a `root` view which knows how to handle the gestures.
If using `Page` (thus `Frame`) you don't need to do anything.
In case you don't (drawer root view, modals, ...) then you can wrap your views in a `GestureRootView` which inherits `GridLayout`

## Overriding Nativescript gestures

This plugin can also override N gestures completely. This would give much more control over gestures and especially would allow to correctly handle simultaneous gestures likes `tap` and `longpress`.

To do that 

## Credits

This is a port of [react-native-gesturehandler](https://kmagiera.github.io/react-native-gesture-handler/).
The source is based on the source code by [Krzysztof Magiera](https://github.com/kmagiera). Don't hesitate to go and thank him for his work!

### Examples:

- [Basic](demo-snippets/vue/Basic.vue)
  - A basic example showing that overriding N gestures works, even in modals

{{ load:../../tools/readme/demos-and-development.md }}
{{ load:../../tools/readme/questions.md }}
