import express from 'express';
import { Spaceship } from '../models';
const router: express.Router = express.Router();

router.get('/', (req, res) => {
    Spaceship.find()
        .then((spaceships) => {
            if(!spaceships) return res.status(404).send("No spaceships found");
            res.status(200).send(spaceships);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        })
});

router.get('/:id', (req, res) => {
    const id: string = req.params.id;
    if(!id) return res.status(400).send("No id provided");
    Spaceship.findById(id)
        .then((spaceship) => {
            if(!spaceship) return res.status(404).send("Spaceship not found");
            res.status(200).send(spaceship);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        })
});

module.exports = router;