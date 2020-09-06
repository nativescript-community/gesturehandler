import Vue from 'nativescript-vue';
import { Page } from '@nativescript/core';

export default class BaseVueComponent extends Vue {
    public isAndroid = global.isAndroid;
    public isIOS = global.isIOS;
    get page() {
        return (this.$refs.page as any).nativeView as Page;
    }

    mounted() {
    }
}
