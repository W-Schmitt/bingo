const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');

const { Bingo } = require('./bingo');
const Config = require('./bingo/config.json');

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use(express.static(`${__dirname}/node_modules/jquery/dist`));
app.use(express.static(`${__dirname}/node_modules/tether/dist`));
app.use(express.static(`${__dirname}/node_modules/vue/dist`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => console.log(`Server listening on port ${port}!`));

app.get('/', (req, res) => {
  const bingo = new Bingo();
  res.render('bingo', {
    mainConfig: {
      appName: 'bingo?',
    },
    bingo: {
      config: {
        cardCount: Config.cardCount,
        tickedCenter: Config.alwaysTickedCenter,
      },
      contents: bingo,
    },
    pageTitle: 'bingo!',
  });
});

app.get('/api/v0/bingo/new', (req, res) => {
  res.send(new Bingo());
});
