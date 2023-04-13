export default class Player {
    static async get(player) {
      return await fetch(`/api/players/${player}`);
    }
  }