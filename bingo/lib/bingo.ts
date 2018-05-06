import { Config } from "../config";

const Config: Config = require('../config.json');
const fs = require('fs');
const path = require('path');

export module Bingo {
  export class Bingo {
    tiles: Array<BingoTile>;

    constructor(words: Array<string>, state?: Array<boolean>) {
      if (words.length < Config.cardCount) {
        throw new Error(`Too little words in the provided array.`);
      }
      if (!words) {
        const wordsFilePath = path.resolve('../', Config.PATH);
        const buf = fs.readFile(wordsFilePath);
        const wds = JSON.parse(buf);
        return new Bingo(buf);
      } else if (!state) {
        this.tiles = [];
        for (let i = 0; i < Config.cardCount; i++) {
          if (Config.alwaysTickedCenter && (i === Math.floor(Config.cardCount/2))) {
            this.tiles.push(new BingoTile(null, true));
          } else {
            const j = Math.floor((Math.random() * words.length));
            const word = words.splice(j)[0];
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

    updateTickState(index:number): void;
    updateTickState(word: string): void;

    updateTickState(arg: any) {
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

    hasWinningLine(): boolean {
      let columnsToExplore: Array<number> = [];
      let winnableRow = true;
      for (let i = 0; i < Math.sqrt(Config.cardCount); i++) {
        columnsToExplore.push(i);
      }
      for (let i = 0; i < this.tiles.length; i++) {
        if (i % Math.sqrt(Config.cardCount) === 0) {
          // TODO: Assert previous row as won/lost
          winnableRow = true;
        }
        winnableRow = winnableRow && this.tiles[i].ticked;

        if (!this.tiles[i].ticked) {
          const colValue = i % Math.sqrt(Config.cardCount);
          columnsToExplore.findIndex((x) => x === colValue)
        }

        // TODO: fast-forward to next row if relevant
      }
      return false;
    }
  }

  class BingoTile {
    word: string;
    ticked: boolean;

    constructor(word: string, ticked?: boolean) {
      this.word = word;
      this.ticked = ticked || false;
    }

    tick() {
      this.ticked = true;
    }

    getWord() {
      return this.word;
    }
  }
}
module.exports = Bingo;
