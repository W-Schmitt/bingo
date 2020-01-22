const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  }
})

const card = mongoose.model('Card', schema)

module.exports = card