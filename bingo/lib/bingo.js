const Card = require('./card')
const config = require('config')

class Bingo {
  constructor(values) {
    if (!Array.isArray(values)) throw new Error('Unsupported parameter')

    if (values.length < (config.get('Bingo.Height') * config.get('Bingo.Width'))) {
      throw new Error('Not enough values to construct the bingo board')
    }

    this.values = []

    values.forEach(val => {
      val.checked = false
      this.values.push(val)
    })
  }

  static async get () {
    const arr = await Card.aggregate([{ $sample: { size: (config.get('Bingo.Height') * config.get('Bingo.Width')) } }])
    return new Bingo(arr)
  }
}

module.exports = Bingo