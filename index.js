const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const Config = require('./config/config');
const router = require('./routes/router');

const app = express();
app.use(session({
  secret: Config.private.secret,
  resave: false,
  saveUninitialized: false,
}));
const port = process.env.PORT || 3000;
app.set('port', port);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use(express.static(`${__dirname}/node_modules/tether/dist`));
app.use(express.static(`${__dirname}/node_modules/vue/dist`));
app.use(express.static(`${__dirname}/node_modules/js-base64`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.listen(port, () => console.log(`Server listening on port ${port}!`));

try {
  mongoose.connect(Config.private.db.connectionString);
} catch (e) {
  console.error(e);
  process.exit(1);
}

/**
 *
  res.render('bingo', {
    mainConfig: appConfig,
    bingo: {
      config: {
        cardCount: Config.cardCount,
        tickedCenter: Config.alwaysTickedCenter,
      },
      contents: new Bingo(),
    },
    pageTitle: 'bingo!',
  });
 */
