export default class Ranking {
    static async get(ranking) {
      return await fetch(`/api/rankings/${ranking}`);
    }
    static async create(ranking) {
        return await fetch('/api/rankings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ranking)
        });
      }
  }