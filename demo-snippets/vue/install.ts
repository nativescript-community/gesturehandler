import Vue from 'nativescript-vue';
import { GestureRootView, install } from '@nativescript-community/gesturehandler';
import Basic from './Basic.vue';

export function installPlugin() {
    install(true);
    Vue.registerElement('GestureRootView', () => GestureRootView);
}

export const demos = [{ name: 'Basic', path: 'basic', component: Basic }];
