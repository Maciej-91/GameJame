import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
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

function randomPosition(){
    const x = 1920;
    const y = Math.floor(Math.random() * 1080);
    return {x, y};
}

function preload (){
    this.load.image('spaceship', './static/img/millennium-falcon.png');
    this.load.image('planet', './static/img/death-star.png');
}

function create (){
    spaceship = this.physics.add.image(500, 1, 'spaceship');
    spaceship.setScale(0.5);
    spaceship.setCollideWorldBounds(true);
    spaceship.body.gravity.y = 300;

    cursors = this.input.keyboard.createCursorKeys();

    for (let i = 0; i < 3; i++) createplanet(this);

    this.physics.world.on('worldbounds', (body) => body.gameObject && body.gameObject.type === 'planet' && removeplanet(body.gameObject));

    setInterval(() => createplanet(this) , 2000);
}

function update (){
    if(cursors.space.isDown) spaceship.setVelocity(0, -200);

    if(this.physics.world.overlap(spaceship, planets)) this.scene.restart();
}

function createplanet(scene){
    let planet = scene.physics.add.image(randomPosition().x, randomPosition().y, 'planet');
    planet.setScale(0.5);
    planet.setImmovable(true);
    planet.setVelocityX(-300);
    planet.type = 'planet';
    planets.push(planet);
}

function removeplanet(planet){
    planets.splice(planets.indexOf(planet), 1);
    planet.destroy();
}