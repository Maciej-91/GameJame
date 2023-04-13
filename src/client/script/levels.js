export default class Levels {
  static async get(level) {
    return await fetch(`/api/levels/${level}`);
  }
}