import Phaser from 'phaser';
import Levels from './levels.js';
import Players from './players.js';

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

function preload (){
    this.load.image('spaceship', `${IMG_PATH}/millennium-falcon.png`);
    this.load.image('planet', `${IMG_PATH}/death-star.png`);
}

function create (){
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
            const closeModal = document.getElementById('game-over-modal');
            closeModal.classList.remove('hidden');

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
    
            const restartGame = () => {
                closeModal.classList.add('hidden');
                reset(true);
                this.scene.restart();
                document.getElementById('game-over-restart').removeEventListener('click', restartGame);
            }
            document.getElementById('game-over-restart').addEventListener('click', restartGame);
            incrementLife = false;
        }
        else {
            reset();
            this.scene.pause();
            const modalBetweenFail = document.getElementById("between-fail")
            modalBetweenFail.classList.remove('hidden');
            setTimeout(() => {
              modalBetweenFail.classList.add('hidden');
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

function updateBannerScore() {
    document.querySelector("#score span").innerHTML = player.score;
};

function reset(restPlayer = false){
    clearInterval(frameIntervalId);
    if(restPlayer === true) {
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
    new Phaser.Game(config);
}

function init (){
    const startModal = document.getElementById('start-game-modal');
    startModal.classList.remove('hidden');

    const startForm = document.getElementById('start-game-form');
    startForm.addEventListener('submit', startGame);
}

window.onload = init;