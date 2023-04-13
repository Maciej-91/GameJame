import express from 'express';
const router: express.Router = express.Router();

router.use('/players', require('./players'));
router.use('/spaceships', require('./spaceships'));
router.use('/levels', require('./levels'));
router.use('/rankings', require('./rankings'));

module.exports = router;