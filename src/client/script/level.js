export default class Level {
  static async get(level) {
    return await fetch(`/api/levels/${level}`);
  }
}