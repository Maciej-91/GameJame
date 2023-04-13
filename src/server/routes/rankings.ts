import express from 'express';
import Ranking from '../models/ranking';
const router: express.Router = express.Router();

router.post('/', (req, res) => {
    const { name, key, score } = req.body;
    if(!name) return res.status(400).send("No name provided");
    if(!key) return res.status(400).send("No key provided");
    if(!score) return res.status(400).send("No score provided");
    const ranking = { name, key, score };
    Ranking.create(ranking)
        .then((ranking) => ranking ? res.status(201).send() : res.status(500).send("Internal server error"))
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        });
});

router.get('/topfive', (req, res) => {
    Ranking.find()
        .limit(5)
        .then((rankings) => {
            if(!rankings) return res.status(404).send("No players found");
            res.send(rankings);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal server error");
        })
})

module.exports = router;