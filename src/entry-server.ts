import { createApp } from './main';
import { renderToString } from '@vue/server-renderer';

function renderPreloadLinks(
    modules: Array<string>,
    manifest: { [key: string]: Array<string> }
) {
    let links = '';
    const seen = new Set();

    modules.forEach((id) => {
        const files = manifest[id];

        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    links += renderPreloadLink(file);
                }
            });
        }
    });

    return links;
}

function renderPreloadLink(file: string) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`;
    } else {
        return '';
    }
}

export async function render(
    url: string,
    manifest: { [key: string]: Array<string> }
) {
    const { app, router } = createApp();

    await router.push(url);
    await router.isReady();

    const ctx = {};
    const html = await renderToString(app, ctx);

    // @ts-ignore
    const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
    return [html, preloadLinks];
}
