import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import './src/style/global';`,
            },
        },
    },
    resolve: {
        alias: [
            // @ts-ignore
            {
                find: /~(.+)/,
                replacement: (val: string) => val.replace(/^~/, ''),
            },
        ],
    },
    plugins: [vue()],
});
