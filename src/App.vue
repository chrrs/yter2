<template>
    <div class="flex flex-col bg-gray-50 min-h-screen">
        <Navbar />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import 'tailwindcss/tailwind.css';
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
html,
body,
#app {
    width: 100%;
    height: 100%;
}
</style>
