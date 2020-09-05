import Vue from 'nativescript-vue';
import { Page } from '@nativescript/core/ui/page/page';
import { isAndroid, isIOS } from '@nativescript/core/platform/platform';

export default class BaseVueComponent extends Vue {
    public isAndroid = isAndroid;
    public isIOS = isIOS;
    get page() {
        return (this.$refs.page as any).nativeView as Page;
    }

    mounted() {
    }
}
