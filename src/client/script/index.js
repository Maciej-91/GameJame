import Phaser from 'phaser';
import Level from './level.js';
import Player from '../models/player.js';

async function getLevel(level) {
    return Level.get(level);
}

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
let incerment = false;

function preload (){
    this.load.image('spaceship', './static/img/millennium-falcon.png');
    this.load.image('planet', './static/img/death-star.png');
    this.load.image('heart', './static/img/heart.png');
}

function create (){
  if(incerment === false) {
    document.getElementById("banner").style.display = "flex"
    const divHeart = document.getElementById("heart")
    for (let i = 0; i < player.health; i++) {
      const heart = document.createElement('img');
      heart.src = '../../../static/img/heart.png'
      heart.classList.add('heart')
      divHeart.appendChild(heart)
    }
  } else {
    const divHeart = document.getElementById("heart")
    if (divHeart.lastChild) {
      divHeart.removeChild(divHeart.lastChild);
    }
  }

    spaceship = this.physics.add.image(getScreenSize().width * 0.2, getScreenSize().height / 2, 'spaceship');
    spaceship.setScale(0.3);
    spaceship.setCollideWorldBounds(true);

    spaceship.body.gravity.y = 300;

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.on('worldbounds', (body) => body.gameObject && body.gameObject.type === 'planet' && removePlanet(body.gameObject));

    frameIntervalId = setInterval(() => createPlanets(this, currentLevel.frames[frameIndex]), 1000);

    this.physics.add.collider(spaceship, planets, () => {
      if(player.health === 1) {
        const divHeart = document.getElementById("heart")
        divHeart.removeChild(divHeart.lastChild);
        this.scene.pause();
        const closeModal = document.getElementById('game-over-modal');
        closeModal.classList.remove('hidden');

        //highscores modal
        const ButtonHighscoresModal = document.getElementById('highScores-by-level');
        const highScoresModal = document.getElementById('high-scores-modal');
        const highScoresClose = document.getElementById('high-scores-close');
        

        const DisplayhighscoresModal = () => {
          highScoresModal.classList.remove('hidden');
          closeModal.classList.add('hidden');
        }
        const DisplayGameOverModal = () => {
          highScoresModal.classList.add('hidden');
          closeModal.classList.remove('hidden');
        }

        ButtonHighscoresModal.addEventListener('click', DisplayhighscoresModal);
        highScoresClose.addEventListener('click', DisplayGameOverModal);

        const restartGame = () => {
          closeModal.classList.add('hidden');
          this.scene.restart();
          player.health = 3;
          document.getElementById('game-over-restart').removeEventListener('click', restartGame);
      }
        document.getElementById('game-over-restart').addEventListener('click', restartGame);
        incerment = false;
      } else {
        this.scene.pause();
        const modalBetweenFail = document.getElementById("between-fail")
        modalBetweenFail.classList.remove('hidden');
        setTimeout(() => {
          modalBetweenFail.classList.add('hidden');
          player.health -= 1;
          incerment = true
          this.scene.restart();
        }, 1000);

      }
    });
}

function update (){
    if(cursors.space.isDown) spaceship.setVelocity(0, -200);

    if(this.physics.world.overlap(spaceship, planets)) {
        clearInterval(frameIntervalId);
        frameIndex = 0;
        removePlanets();
        this.scene.pause();
    }

    const lastPlanet = planets[planets.length - 1];
    if(lastPlanet && lastPlanet.x + lastPlanet.width / 2 < 0) {
        clearInterval(frameIntervalId);
        frameIndex = 0;
        removePlanets();
        this.scene.pause();
    };
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
  player = new Player("", 0, 3, 1)
    event.preventDefault();
    player.username = document.getElementById('username').value;

    const startModal = document.getElementById('start-game-modal');
    startModal.classList.add('hidden');

    currentLevel = await getLevel(1).then(res => {
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