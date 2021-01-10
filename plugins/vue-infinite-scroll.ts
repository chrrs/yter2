import Vue from 'vue';

if (process.client) {
    Vue.use(require('vue-infinite-scroll'));
}
