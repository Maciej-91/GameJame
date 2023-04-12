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

    this.physics.add.collider(spaceship, planets, () => {
        this.scene.pause();
        const modal = gameOverModal();
        document.body.appendChild(modal);
        modal.classList.remove('hidden');

        document.getElementById('game-over-restart').removeEventListener('click', () => {
            console.log("restart")
            modal.classList.add('hidden');
            this.scene.restart();
        });
        document.getElementById('game-over-exit').removeEventListener('click', () => {
            modal.classList.add('hidden');
            this.scene.stop();
        });
    
        document.getElementById('game-over-restart').addEventListener('click', () => {
            modal.classList.add('hidden');
            this.scene.restart();
        });
    
        document.getElementById('game-over-exit').addEventListener('click', () => {
            modal.classList.add('hidden');
            this.scene.stop();
        });
      });
}

function restartFunction() {
    const modal = document.getElementById('game-over-modal');
    modal.classList.add('hidden');
    scene.restart();
}

function exitFunction() {
    const modal = document.getElementById('game-over-modal');
    modal.classList.add('hidden');
    scene.stop();
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

function restartGame(){
    modal.classList.add('hidden');
    this.scene.restart();
}

function endGame() {
                modal.classList.add('hidden');
            this.scene.stop();
}

function gameOverModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed z-10 inset-0 overflow-y-auto hidden';
    modal.id = 'game-over-modal';
    modal.innerHTML = `
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 transition-opacity">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <!-- L'icône de la modal -->
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Game Over
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Vous avez perdu ! Essayez encore ?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" id="game-over-restart">
          Recommencer
        </button>
        <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" id="game-over-exit">
          Quitter
        </button>
      </div>
    </div`
    return modal
}