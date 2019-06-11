import Vue from 'nativescript-vue';
import { Page } from 'tns-core-modules/ui/page/page';
import { isAndroid, isIOS } from 'tns-core-modules/platform/platform';

export default class BaseVueComponent extends Vue {
    public isAndroid = isAndroid;
    public isIOS = isIOS;
    get page() {
        return (this.$refs.page as any).nativeView as Page;
    }

    mounted() {
    }
}
