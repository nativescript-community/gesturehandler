// require('./ts_helpers');
import { install as GestureInstall } from 'nativescript-gesturehandler';
GestureInstall();
import Vue from 'nativescript-vue';
import App from './App.vue';
import { knownFolders } from 'tns-core-modules/file-system';

const currentApp = knownFolders.currentApp();
require('source-map-support').install({
    environment: 'node',
    handleUncaughtExceptions: false,
    retrieveSourceMap(source) {
        const sourceMapPath = source + '.map';
        const sourceMapRelativePath = sourceMapPath.replace('file://', '').replace(currentApp.path + '/', '');

        return {
            url: sourceMapRelativePath + '/',
            map: currentApp.getFile(sourceMapRelativePath).readTextSync()
        };
    }
});

import CollectionViewPlugin from 'nativescript-collectionview/vue';
Vue.use(CollectionViewPlugin);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true;
// setShowDebug(true)
// Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    render: h => h('frame', [h(App)])
}).$start();
