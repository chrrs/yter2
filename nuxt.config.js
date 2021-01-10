export default {
    head: {
        title: 'yter2',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            { hid: 'description', name: 'description', content: '' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    server: {
        host: '0.0.0.0',
    },

    css: ['typeface-roboto', '@mdi/font/css/materialdesignicons.css'],
    plugins: ['~/plugins/vue-lazyload.ts', '~/plugins/vue-infinite-scroll.ts'],
    components: true,

    buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        '@nuxtjs/style-resources',
        '@nuxtjs/robots',
    ],

    serverMiddleware: {
        '/api': '~/serverMiddleware/api.ts',
        '/api/v1': '~/serverMiddleware/api_v1.ts',
    },

    styleResources: {
        scss: ['./assets/*.scss'],
    },

    axios: {
        proxy: true,
    },

    proxy: {
        '/api/v1/storyboards': {
            target: 'https://invidious.tube/api/v1/storyboards',
            pathRewrite: { '^/api/v1/storyboards': '' },
        },
        '/api/v1/dash': {
            target: 'https://invidious.tube/api/manifest/dash/id',
            pathRewrite: { '^/api/v1/dash': '' },
        },
    },

    robots: {
        UserAgent: '*',
        Disallow: '/',
    },

    build: {},
};
