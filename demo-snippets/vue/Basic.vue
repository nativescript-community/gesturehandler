<template>
    <Page>
        <ActionBar>
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <Label text="Basic Pager" />
        </ActionBar>

        <StackLayout class="page">
            <Button text="test modal view" @tap="openModal" />
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import ModalView from './ModalView.vue';
export default {
    data() {
        return {
            items: [
                { title: 'First', color: '#e67e22' },
                { title: 'Second', color: '#3498db' },
                { title: 'Third', color: '#e74Fc3c' },
                { title: 'Fourth', color: '#9b59b6' }
            ]
        };
    },
    methods: {
        openModal() {
            console.log('openModal');
            console.log('openModal', ModalView);
            this.$showModal(ModalView, {
                fullscreen: false
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.page Label {
    font-size: 35;
    text-align: center;
    width: 100%;
    vertical-alignment: center;
    color: #ffffff;
    text-transform: uppercase;
}
</style>
