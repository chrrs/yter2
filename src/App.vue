<template>
    <div id="app">
        <Navbar />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import '@mdi/font/scss/materialdesignicons.scss';
import '@fontsource/roboto/latin.css';

import Navbar from 'components/Navbar.vue';

export default {
    components: {
        Navbar,
    },
};
</script>

<style lang="scss">
//noinspection CssUnknownTarget
@import 'normalize-scss/sass/normalize';

@include normalize();

* {
    box-sizing: border-box;
}

#app {
    @include fontSans();

    width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    background-color: $gray-50;
}

.container {
    width: 100%;
    padding: 0 1rem;
    margin: 0 auto;

    @include mq('sm') {
        max-width: 640px;
    }

    @include mq('md') {
        max-width: 768px;
    }

    @include mq('lg') {
        max-width: 1024px;
    }

    @include mq('xl') {
        max-width: 1280px;
    }

    @include mq('2xl') {
        max-width: 1536px;
    }
}
</style>
