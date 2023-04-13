import Phaser from 'phaser';
import Levels from './levels.js';
import Players from './players.js';
import Ranking from './ranking.js'

const IMG_PATH = './static/img';

function getScreenSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

const config = {
    type: Phaser.AUTO,
    width: getScreenSize().width,
    height: getScreenSize().height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let spaceship;
let cursors;
let planets = [];
let frameIndex = 0;
let frameIntervalId;
let currentLevel = null;
let player;
let incrementLife = false;
let son;

function preload (){
    this.load.image('spaceship', `${IMG_PATH}/millennium-falcon.png`);
    this.load.image('planet', `${IMG_PATH}/death-star.png`);
    this.load.audio('son', './static/sound/mixkit-game-level-music-689.wav');
}

function create (){
  son = this.sound.add('son', { loop: true, volume: 0.5 });
  son.play();
  if(incrementLife === false) {
    const divLives = document.getElementById("lives")
    for (let i = 0; i < player.health; i++) {
      const live = document.createElement('img');
      live.src = `${IMG_PATH}/millennium-falcon.png`;
      live.classList.add('w-10');
      divLives.appendChild(live);
    }
  } else {
    const divLives = document.getElementById("lives")
    if (divLives.lastChild) {
      divLives.removeChild(divLives.lastChild);
    }
  }

    spaceship = this.physics.add.image(getScreenSize().width * 0.2, getScreenSize().height / 2, 'spaceship');
    spaceship.setScale(0.3);
    spaceship.setCollideWorldBounds(true);

    spaceship.body.gravity.y = 300;

    cursors = this.input.keyboard.createCursorKeys();

    frameIntervalId = setInterval(() => createPlanets(this, currentLevel.frames[frameIndex]), 1000);
}

function update(){
    if(cursors.space.isDown) spaceship.setVelocity(0, -200);

    if(this.physics.world.overlap(spaceship, planets)) {
        if(player.health === 1){
            const divLives = document.getElementById("lives")
            divLives.removeChild(divLives.lastChild);
            clearInterval(frameIntervalId);
            this.scene.pause();
            document.getElementById('game-over-modal').classList.remove('hidden');;

            console.log(player);

            // Players.create({
            //     username: player.username,
            //     key: Math.floor(Math.random() * 99999).toString().padStart(5, '0'),
            //     totalScore: player.score,
            //     totalGames: 5,
            //     points: player.score,
            //     levels: [{
            //         level: currentLevel.level,
            //         score: player.score,
            //         games: 5
            //     }],
            //     spaceships: [{
            //         name: "Faucon Millenium",
            //         selected: true
            //     }]
            // })
            // .catch(data => console.log(data))
    
            document.getElementById('game-over-restart').addEventListener('click', restartGame);
            document.getElementById('ranking-open').addEventListener('click', showRankingModal);
            document.getElementById('ranking-close').addEventListener('click', showGameOverModal);
            incrementLife = false;
        }
        else {
            reset();
            this.scene.pause();
            document.getElementById("between-fail").classList.remove('hidden');
            setTimeout(() => {
              document.getElementById("between-fail").classList.add('hidden');
              player.health -= 1;
              incrementLife = true
              this.scene.restart();
            }, 1000);
        }

    }

    if(planets.length >= 1){
        planets.forEach(planet => {
            if(planet.x < spaceship.x && !planet.passed) {
                planet.passed = true;
                player.score += Math.floor(Math.random() * 5) + 8;
                updateBannerScore();
            }
            if(planet.x + planet.width / 2 < 0) removePlanet(planet);
        })
    }
    

    const lastPlanet = planets[planets.length - 1];
    if(lastPlanet && lastPlanet.x + lastPlanet.width / 2 < 0) {
        reset(true);
        this.scene.pause();
    };
}

const showRankingModal = () => {
    document.getElementById('ranking-modal').classList.remove('hidden');
    document.getElementById('game-over-modal').classList.add('hidden');
    document.getElementById('game-over-restart').removeEventListener('click', showRankingModal);
}
const showGameOverModal = () => {
    document.getElementById('ranking-modal').classList.add('hidden');
    document.getElementById('game-over-modal').classList.remove('hidden');
    document.getElementById('game-over-restart').removeEventListener('click', showGameOverModal);
}

const restartGame = () => {
    document.getElementById('game-over-modal').classList.add('hidden');
    reset(true);
    this.scene.restart();
    document.getElementById('game-over-restart').removeEventListener('click', restartGame);
}

function updateBannerScore() {
    document.querySelector("#score span").innerHTML = player.score;
};

function reset(resetPlayer = false){
    clearInterval(frameIntervalId);
    son.stop();
    if(resetPlayer === true) {
        player = new Players(player.username);
        updateBannerScore();
    }
    frameIndex = 0;
    removePlanets();
}

function createPlanet(game, planetData){
    let planet = game.physics.add.image(getScreenSize().width + 100 + planetData.x || 0, getScreenSize().height * planetData.y || 0, 'planet');
    planet.setScale(0.3);
    planet.setImmovable(true);
    planet.setVelocityX(-300);
    planet.type = 'planet';
    planets.push(planet);
}

function createPlanets(game, frame){
    if(!frame) return;
    Object.values(frame).forEach((planetData) => setTimeout(() => createPlanet(game, planetData), planetData));
    frameIndex++;
    if (frameIndex >= currentLevel.frames.length - 1) clearInterval(frameIntervalId);
}

function removePlanet(planet){
    planets.splice(planets.indexOf(planet), 1);
    planet.destroy();
}

function removePlanets(){
    planets.forEach(planet => planet.destroy());
    planets = [];
}

function createRankingTable(rankings) {
    const rankingTable = document.getElementById('ranking-table');

    rankings.forEach((ranking) => {
        const row = document.createElement('tr');
    
        const userCell = document.createElement('td');
        const spanUsername = document.createElement('span');
        spanUsername.textContent = ranking.username;
        userCell.appendChild(spanUsername);

        const spanKey = document.createElement('span');
        spanKey.classList.add('text-gray-500');
        spanKey.textContent = `#${ranking.key}`;
        userCell.appendChild(spanKey);
    
        const scoreCell = document.createElement('td');
        scoreCell.classList.add('font-semibold');
        scoreCell.textContent = ranking.score;
    
        row.appendChild(userCell);
        row.appendChild(scoreCell);
    
        rankingTable.appendChild(row);
    });
}

async function startGame(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if(!username) return;

    player = new Players(username);

    const startModal = document.getElementById('start-game-modal');
    startModal.classList.add('hidden');

    currentLevel = await Levels.get(1).then(res => {
        if(res.ok) return res.json();
        throw new Error('Failed to load level');
    });

    const rankingLimit = 10; 
    const rankings = await Ranking.get(rankingLimit).then(res => {
      if(res.ok) return res.json();
      throw new Error('Failed to return Ranking')
    })
    document.querySelector("#ranking-modal-title span").innerHTML = rankingLimit;
    createRankingTable(rankings);
    new Phaser.Game(config);
}

function init (){
    const startModal = document.getElementById('start-game-modal');
    startModal.classList.remove('hidden');

    const startForm = document.getElementById('start-game-form');
    startForm.addEventListener('submit', startGame);
}

window.onload = init;