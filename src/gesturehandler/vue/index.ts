const Plugin = {
    install(Vue) {
        Vue.registerElement('GestureRootView', () => require('..').GestureRootView, {});
    }
};

export default Plugin;
