import express from 'express';
import { Player } from '../models';
const router: express.Router = express.Router();

router.get('/', (req, res) => {
    Player.find()
        .then((players) => {
            if(!players) return res.status(404).send("No players found");
            res.send(players);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

router.get('/:id', (req, res) => {
    const id: string = req.params.id;
    if(!id) return res.status(400).send("No id provided");
    Player.findById(id)
        .then((player) => {
            if(!player) return res.status(404).send("Player not found");
            res.send(player);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

module.exports = router;