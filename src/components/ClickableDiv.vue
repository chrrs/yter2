<template>
    <router-link class="clickable-div">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    name: 'ClickableDiv',
};
</script>

<style scoped lang="scss">
.clickable-div {
    color: inherit;
    text-decoration: none;

    &:active {
        background-color: $gray-300;
        box-shadow: 0 0 0 5px $gray-300;
    }
}
</style>
