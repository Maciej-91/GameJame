import express from 'express';
import Level from '../models/level';
const router: express.Router = express.Router();

router.get('/', (req, res) => {
    Level.find()
        .then((levels) => {
            if(!levels) return res.status(404).send("No levels found");
            res.send(levels);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        })
});

router.get('/:id', (req, res) => {
    const id: string = req.params.id;
    if(!id) return res.status(400).send("No id provided");
    Level.findById(id)
        .then((level) => {
            if(!level) return res.status(404).send("Level not found");
            res.send(level);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        })
});

module.exports = router;