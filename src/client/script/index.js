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
let coeur = [];

//valeur de test pour le bandeau
let niveau = 1;
let score = 0;
let vie = 3;

const style_bandeau = {
    fontFamily: 'Arial',
    fontSize: 32,
    color: '#ffffff',
}


function randomPosition(){
    const x = 1920;
    const y = Math.floor(Math.random() * 1080);
    return {x, y};
}

function preload (){
    this.load.image('spaceship', './static/img/millennium-falcon.png');
    this.load.image('planet', './static/img/death-star.png');
    this.load.image('heart', './static/img/heart.png');
}

function create (){

    //-----------------------bandeau-------------------------
    this.add.rectangle(0, 0, config.width, 70, 0xff0000).setOrigin(0, 0).setDepth(1);;

    let niveau_bandeau = this.add.text(50, 18, `niveau : ${niveau} `, style_bandeau).setDepth(1);
    niveau_bandeau.setOrigin(0, 0);
    let score_bandeau = this.add.text((config.width / 2) - 130, 18, `Votre scores : ${score} `, style_bandeau).setDepth(1);
    score_bandeau.setOrigin(0, 0);

    for (let i = 0; i < vie; i++) {
        coeur.push(this.add.image(config.width - (i * 75) - 80, 38, 'heart'));
        coeur[i].setDepth(1);
    }
    
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