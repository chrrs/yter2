import { readFileSync } from 'fs';
import { resolve } from 'path';
import express from 'express';
import { createServer as _createServer, ViteDevServer } from 'vite';
import serveStatic from 'serve-static';
import api_v1 from './src/api_v1/main';
import dotenv from 'dotenv';

dotenv.config();

async function createServer(
    root = process.cwd(),
    isProd = process.env.NODE_ENV === 'production'
) {
    const toAbsolute = (p: string): string => resolve(__dirname, p);

    const indexProd = isProd
        ? readFileSync(toAbsolute('dist/client/index.html'), 'utf-8')
        : '';

    const manifest = isProd ? require('./dist/client/ssr-manifest.json') : {};

    const app = express();

    let vite: ViteDevServer | undefined;
    if (!isProd) {
        vite = await _createServer({
            root,
            server: {
                middlewareMode: true,
                watch: {
                    usePolling: true,
                    interval: 100,
                },
            },
        });

        app.use(vite.middlewares);
    } else {
        app.use(serveStatic(toAbsolute('dist/client'), { index: false }));
    }

    app.use('/api/v1', api_v1);

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;

            let template, render;
            if (!isProd && vite) {
                template = readFileSync(toAbsolute('index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('src/entry-server.ts'))
                    .render;
            } else {
                template = indexProd;
                render = require('./dist/server/entry-server.js').render;
            }

            const [appHtml, preloadLinks, headTags] = await render(
                url,
                manifest
            );

            const html = template
                .replace('<!--preload-links-->', preloadLinks)
                .replace('<!--app-html-->', appHtml)
                .replace('<!--head-tags-->', headTags);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite && vite.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });

    return { app, vite };
}

createServer().then(({ app }) =>
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    })
);
