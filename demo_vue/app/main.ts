// require('./ts_helpers');
import Vue from 'nativescript-vue';
import { install as installGestures } from '@nativescript-community/gesturehandler';
installGestures(true);
import App from './App.vue';

import ButtonPlugin from '@nativescript-community/ui-material-button/vue';
Vue.use(ButtonPlugin);

import CollectionViewPlugin from '@nativescript-community/ui-collectionview/vue';
Vue.use(CollectionViewPlugin);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true;
// setShowDebug(true)
// Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    render: h => h('frame', [h(App)])
}).$start();
