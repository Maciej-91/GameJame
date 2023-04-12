import Phaser from 'phaser';
import Levels from './levels.js';

function getLevel(level) {
    if(!Levels(getScreenSize().height)[level]) throw new Error('Level not found');
    return Levels(getScreenSize().height)[level];
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

var game = new Phaser.Game(config);

let spaceship;
let cursors;
let planets = [];
let frameIndex = 0;
let frameIntervalId;
let currentLevel = getLevel(0);

function preload (){
    this.load.image('spaceship', './static/img/millennium-falcon.png');
    this.load.image('planet', './static/img/death-star.png');
}

function create (){
    spaceship = this.physics.add.image(getScreenSize().width * 0.2, getScreenSize().height / 2, 'spaceship');
    spaceship.setScale(0.3);
    spaceship.setCollideWorldBounds(true);
    spaceship.body.gravity.y = 300;

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.on('worldbounds', (body) => body.gameObject && body.gameObject.type === 'planet' && removePlanet(body.gameObject));

    frameIntervalId = setInterval(() => createPlanets(this, currentLevel.frames[frameIndex]), 1000);
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
    let planet = game.physics.add.image((getScreenSize().width + 100 + planetData.x || 0), planetData.y, 'planet');
    planet.setScale(0.3);
    planet.setImmovable(true);
    planet.setVelocityX(-300);
    planet.type = 'planet';
    planets.push(planet);
}

function createPlanets(game, frame){
    if(!frame) return;
    frame.forEach((planetData) => setTimeout(() => createPlanet(game, planetData), planetData));
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