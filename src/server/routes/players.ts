import express from 'express';
import { Player } from '../models';
const router: express.Router = express.Router();

router.get('/', (req, res) => {
    Player.find()
        .then((players) => {
            if(!players) return res.status(404).send("No players found");
            res.status(200).send(players);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

router.post('/', (req, res) => {
    const { username, key, totalScore, totalGames, points, levels, spaceships } = req.body;
    if(!username) return res.status(400).send("No username provided");
    if(!key) return res.status(400).send("No key provided");
    if(!levels) return res.status(400).send("No levels provided");
    if(!spaceships) return res.status(400).send("No spaceships provided");
    const player = { username, key, totalScore, totalGames, points, levels, spaceships };
    Player.create(player)
        .then((player) => player ? res.status(201).send() : res.status(500).send("Internal server error"))
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

module.exports = router;