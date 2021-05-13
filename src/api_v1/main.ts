import { Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { getVideoComments, getVideoInfo } from './video';
import ytdl from 'ytdl-core';
import { getStoryboardVTT } from './storyboards';

const router = Router();

router.get('/info', (req, res) => {
    res.status(200).json({
        name: 'yter2',
        version: process.env.npm_package_version,
    });
});

router.get(
    '/video/:id',
    param('id')
        .matches(/^([A-Za-z0-9\-_]){11}$/)
        .withMessage('A valid youtube video ID needs to be supplied'),
    apiErrors,
    async (req, res) => {
        try {
            res.status(200).json(await getVideoInfo(req.params.id));
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
);

router.get(
    '/video/:id/storyboards.vtt',
    param('id')
        .matches(/^([A-Za-z0-9\-_]){11}$/)
        .withMessage('A valid youtube video ID needs to be supplied'),
    apiErrors,
    async (req, res) => {
        try {
            const info = await ytdl.getInfo(req.params.id);
            res.status(200).contentType('text/vtt').send(
                getStoryboardVTT(
                    // @ts-ignore
                    info.videoDetails.storyboards.pop(),
                    info.videoDetails.lengthSeconds
                )
            );
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
);

router.get(
    '/video/:id/comments',
    param('id')
        .matches(/^([A-Za-z0-9\-_]){11}$/)
        .withMessage('A valid youtube video ID needs to be supplied'),
    apiErrors,
    async (req, res) => {
        try {
            res.status(200).json(
                await getVideoComments(
                    req.params.id,
                    req.query['continuation'] as string | undefined
                )
            );
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
);

function apiErrors(req: Request, res: Response, next: Function) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.array({ onlyFirstError: true })[0].msg,
        });
    } else {
        next();
    }
}

export default router;
