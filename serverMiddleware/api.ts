import express from 'express';
import ytdl from 'ytdl-core';
import suggest from 'youtube-suggest';
import ytsr from 'ytsr';
import { getChannelInfo, getChannelVideos } from 'yt-channel-info';

export const app = express();

app.all('/video', async (req, res) => {
    res.json(
        await ytdl.getInfo(`http://www.youtube.com/watch?v=${req.query.v}`)
    );
});

app.all('/search/suggest', async (req, res) => {
    res.json(await suggest(req.query.q as string));
});

app.all('/search', async (req, res) => {
    res.json(await ytsr(req.query.q as string));
});

app.all('/channel/:id', async (req, res) => {
    res.json(await getChannelInfo(req.params.id));
});

app.all('/channel/:id/videos', async (req, res) => {
    res.json(await getChannelVideos(req.params.id));
});

export default app;
