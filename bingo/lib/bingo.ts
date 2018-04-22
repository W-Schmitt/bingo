const Config = require('../settings.ts');

class Bingo {
  words: Array<string>;
  wordsStates: Array<boolean>;

  constructor(words: Array<string>, state: Array<boolean>) {
    if (words.length !== Config.wordsPerCard) {
      if (words.length < Config.wordsPerCard) {
        throw new Error(`Too little words in the provided array.`);
      }
      this.words = []
      while (this.words.length !== Config.wordsPerCard) {
        const i = Math.floor((Math.random() * words.length));
        this.words.push(words.splice(i)[0]);
      }

      this.wordsStates = [];
      for (let i = 0; i < Config.wordsPerCard; i++) {
        this.wordsStates.push(false);
      }
    } else {
      this.words = words;
      this.wordsStates = state;
    }

  }
}

module.exports = Bingo;
