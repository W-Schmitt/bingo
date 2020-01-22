const express = require('express')
const config = require('config')
const bingo = require('../bingo')

const api = express.Router()

api.route('/api-status')
  .get(async (req, res) => {
    res.json({
      status: 'ok'
    })
  })

api.route('/bingo/params')
  .get(async (req, res) => {
    res.json({
      height: config.get('Bingo.Height'),
      width: config.get('Bingo.Width')
    })
  })

api.route('/bingo/board')
  .get(async (req, res) => {
    res.json({
      board: await bingo.get()
    })
  })

module.exports = api
