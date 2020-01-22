const express = require('express')
const config = require('config')

const router = express.Router()

router.get('/', (req, res) => res.render('bingo', {
  title: 'Bingo?'
}))

module.exports = router
