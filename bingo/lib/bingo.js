const Config = require('../config.json');
const fs = require('fs');
const path = require('path');
const { BingoTile } = require('./bingoTile');

class Bingo {
  constructor(words, state) {
    if (words && words.length < Config.cardCount) {
      throw new Error('Too little words in the provided array.');
    }
    if (!words) {
      const wordsFilePath = path.resolve(__dirname, '../', Config.PATH);
      const buf = fs.readFileSync(wordsFilePath, 'utf8');
      const wds = JSON.parse(buf);
      return new Bingo(wds);
    } else if (!state) {
      this.tiles = [];
      for (let i = 0; i < Config.cardCount; i++) {
        if (Config.alwaysTickedCenter && (i === Math.floor(Config.cardCount / 2))) {
          this.tiles.push(new BingoTile(null, true));
        } else {
          const j = Math.floor((Math.random() * words.length));
          const word = words.splice(j, 1)[0];
          this.tiles.push(new BingoTile(word, false));
        }
      }
    } else {
      this.tiles = [];
      for (let i = 0; i < words.length && i < state.length; i++) {
        this.tiles.push(new BingoTile(words[i], state[i]));
      }
    }
  }
  updateTickState(arg) {
    if (typeof arg === 'number') {
      this.tiles[arg].tick();
    } else if (typeof arg === 'string') {
      this.tiles.map((word) => {
        if (word.getWord() === arg) {
          word.tick();
        }
      });
    } else {
      throw new TypeError('Invalid argument type for updateTickState.');
    }
  }
  hasWinningLine() {
    const columnsToExplore = [];
    let winnableRow = true;
    for (let i = 0; i < Math.sqrt(Config.cardCount); i++) {
      columnsToExplore.push(i);
    }
    for (let i = 0; i < this.tiles.length; i++) {
      if (i % Math.sqrt(Config.cardCount) === 0) {
        winnableRow = true;
      }
      winnableRow = winnableRow && this.tiles[i].ticked;
      if (!this.tiles[i].ticked) {
        const colValue = i % Math.sqrt(Config.cardCount);
        columnsToExplore.findIndex(x => x === colValue);
      }
    }
    return false;
  }
}

module.exports = { Bingo };
