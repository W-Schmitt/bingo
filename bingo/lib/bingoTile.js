let nextId = 0;
class BingoTile {
  constructor(word, ticked) {
    this.word = word;
    this.ticked = ticked || false;
    this.id = nextId;
    nextId += 1;
  }
  tick() {
    this.ticked = true;
  }
  getWord() {
    return this.word;
  }
  static resetNextId() {
    nextId = 0;
  }
}

module.exports = { BingoTile };
