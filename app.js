const http = require('http')
const config = require('config')

const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

// Server "hardening"
const helmet = require('helmet')

const logger = require('morgan')

const router = require('./routes')

const app = express()
app.use(bodyParser.json())

app.set('view engine', 'pug')

app.use(helmet())
app.use(logger('dev'))

if (process.env.NODE_ENV !== 'CI') {
  mongoose.connect(`mongodb://${config.get('Database.Host')}:${config.get('Database.Port')}/${config.get('Database.Name')}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}


// REST API routes
app.use('/api/v0', router.api)

// Web pages
app.use('/', router.web)

// Vendor style & client-side JS
// TODO: webpack this
app.use('/vendor/socket.io', express.static(`${__dirname}/node_modules/socket.io-client/dist/`))
app.use('/vendor/materialize', express.static(`${__dirname}/node_modules/materialize-css/dist/`))

// Own style & client-side JS
// TODO: webpack this
app.use('/client', express.static(`${__dirname}/client/`))

// Quick and dirty route for the favicon
app.use('/favicon.ico', express.static(`${__dirname}/client/favicon.ico`))

// Default route handling for 404
app.use((req, res, next) => {
  res.status(404).send('Oops - page not found.')
})

const port = process.env.PORT || config.get('Server.Port')

const server = http.createServer(app)

global.io = require('socket.io')(server)

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
