<template>
    <div id="app">
        <Navbar />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import '@mdi/font/scss/materialdesignicons.scss';
import '@fontsource/roboto/latin.css';

import Navbar from './components/Navbar.vue';

export default {
    components: {
        Navbar,
    },
};
</script>

<style lang="scss">
@import '~normalize-scss/sass/normalize';

@include normalize();

#app {
    @include fontSans();

    width: 100vw;
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    background-color: $gray-50;
}
</style>
