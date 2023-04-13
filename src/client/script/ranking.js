export default class Ranking {
    static async get(limit) {
      return await fetch(`/api/ranking/${limit}`);
    }
    static async create(ranking) {
        return await fetch('/api/ranking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ranking)
        });
      }
  }