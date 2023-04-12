import Phaser from 'phaser';
import Level from './level.js';

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
let lives = [];

let score = 0;
let lifeCount = 3;

const topBannerStyle = {
    fontFamily: 'Arial',
    fontSize: 32,
    color: '#ffffff',
}
 
function preload (){
    this.load.image('spaceship', './static/img/millennium-falcon.png');
    this.load.image('planet', './static/img/death-star.png');
    this.load.image('heart', './static/img/heart.png');
}

function create (){
    this.add.rectangle(0, 0, getScreenSize().width, 70, 0xc51d2d).setOrigin(0, 0).setDepth(1);

    let topBannerLevel = this.add.text(50, 18, `niveau : ${currentLevel.level} `, topBannerStyle).setDepth(1);
    topBannerLevel.setOrigin(0, 0);
    let topBannerScore = this.add.text((getScreenSize().width / 2) - 130, 18, `Votre score : ${score} `, topBannerStyle).setDepth(1);
    topBannerScore.setOrigin(0, 0);

    for (let i = 0; i < lifeCount; i++) {
        lives.push(this.add.image(getScreenSize().width - (i * 75) - 80, 38, 'heart'));
        lives[i].setDepth(1);
    }

    spaceship = this.physics.add.image(getScreenSize().width * 0.2, getScreenSize().height / 2, 'spaceship');
    spaceship.setScale(0.3);
    spaceship.setCollideWorldBounds(true);
    spaceship.body.gravity.y = 300;

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.on('worldbounds', (body) => body.gameObject && body.gameObject.type === 'planet' && removePlanet(body.gameObject));

    frameIntervalId = setInterval(() => createPlanets(this, currentLevel.frames[frameIndex]), 1000);

    this.physics.add.collider(spaceship, planets, () => {
        this.scene.pause();
        const closeModal = document.getElementById('game-over-modal');
        closeModal.classList.remove('hidden');

        const restartGame = () => {
          closeModal.classList.add('hidden');
          this.scene.restart();
          document.getElementById('game-over-restart').removeEventListener('click', restartGame);
      }
      document.getElementById('game-over-restart').addEventListener('click', restartGame);
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

async function startLevel(level) {
    currentLevel = await getLevel(level).then(res => {
        if(res.ok) return res.json();
        throw new Error('Failed to load level');
    });
    new Phaser.Game(config);
}

startLevel(1);