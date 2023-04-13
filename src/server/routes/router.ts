import express from 'express';
const router: express.Router = express.Router();

router.use('/players', require('./players'));
router.use('/spaceships', require('./spaceships'));
router.use('/levels', require('./levels'));
router.use('/ranking', require('./ranking'));

module.exports = router;