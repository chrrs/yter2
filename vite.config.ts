import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import 'src/style/global';`,
            },
        },
    },
    resolve: {
        // @ts-ignore
        fallback: [path.join(__dirname, 'node_modules')],
        alias: {
            src: path.resolve(__dirname, 'src'),
            components: path.resolve(__dirname, 'src/components'),
        },
    },
    plugins: [vue()],
});
