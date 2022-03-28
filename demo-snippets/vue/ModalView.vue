<template>
    <StackLayout class="page">
        <GestureRootView>
            <Button text="should work" @tap="buttonTest" />
        </GestureRootView>
    </StackLayout>
</template>

<script>
export default {
    methods: {
        buttonTest() {
            alert('test');
        },
    },
};
</script>
