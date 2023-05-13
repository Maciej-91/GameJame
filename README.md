# Star Flyer

Star Flyer est un jeu de type "Flappy Bird" où le joueur pilote un vaisseau spatial à travers un champ d'astéroïdes en évitant les planètes.

## Installation
1. Clonez le dépôt
```bash
git clone https://github.com/Simonbrl/star-flyer.git
```
2. Installez les dépendances
```bash
npm install
```
3. Renommez le fichier .env.template en .env et ajoutez-y l'URI MongoDB
```bash
DATABASE="<URI MongoDB>"
```
4. Buildez le projet
```bash
npm run build
```
5. Lancez le serveur
```bash
npm start
```
6. Ouvrez votre navigateur et allez à l'adresse suivante
```bash
http://localhost:8000
```


## Comment jouer

1. Appuyez sur la barre d'espace pour faire voler le vaisseau spatial.
2. Évitez les planètes en les survolant ou en les contournant.
3. Essayez de survivre aussi longtemps que possible et de marquer le plus de points.

## Technologies utilisées

- Tailwindcss
- TypeScript
- Node.js
- Express
- MongoDB
