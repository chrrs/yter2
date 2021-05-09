import { Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { getVideoInfo } from './video';

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
        res.status(200).json(await getVideoInfo(req.params.id));
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
