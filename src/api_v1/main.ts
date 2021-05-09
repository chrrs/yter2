import { Router } from 'express';

const router = Router();

router.get('/info', (req, res) => {
    res.status(200).json({
        name: 'yter2',
        version: process.env.npm_package_version,
    });
});

export default router;
