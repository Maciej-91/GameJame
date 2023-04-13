export default class Players {
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