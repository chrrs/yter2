import {
    createMemoryHistory,
    createRouter as _createRouter,
    createWebHistory,
} from 'vue-router';

const pages = import.meta.glob('./pages/*.vue');

const routes = Object.keys(pages).map((path) => {
    // @ts-ignore
    const name = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase();

    return {
        path: name === '/index' ? '/' : name,
        component: pages[path],
    };
});

export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes,
    });
}
