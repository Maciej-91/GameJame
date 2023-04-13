export default class Players {

  username;
  key;
  score;
  health;
  level;

  constructor(username) {
    this.username = username;
    this.key = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
    this.score = 0;
    this.health = 3;
    this.level = 1;
  }

  static async get(username, key) {
    return await fetch(`/api/players/${username}${key}`);
  }

  static async create(player) {
    return await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
  }
}