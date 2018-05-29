const express = require('express');

const router = express.Router();
const { Bingo } = require('../bingo');
const User = require('../user');
const Config = require('../config/config').public;

router.get('/', (req, res) => {
  const { session } = req;
  res.render('home', {
    Config,
    message: session.message,
    user: session.user ? session.user.name : null,
  });
  delete req.session.message;
});

router.get('/api/v0/bingo/new', (req, res) => {
  res.send(new Bingo());
});

router.get('/signin', (req, res) => {
  res.render('signin', {
    Config,
  });
});

router.get('/signout', (req, res) => {
  delete req.session;
  res.redirect('/');
});

router.post('/signin', async (req, res) => {
  const { name, password } = req.body;
  const loggedIn = await User.authenticate(name, password);
  if (loggedIn) {
    req.session.message = {
      title: 'Logged in!',
      body: 'You were successfully logged in.',
      user: loggedIn.name,
    };
    req.session.user = {
      id: loggedIn._id,
      name: loggedIn.name,
    };
    res.redirect('/');
  } else {
    res.status(401).render('signin', {
      Config,
      error: {
        title: 'Invalid credentials',
        message: 'Try again!',
      },
    });
  }
});

router.get('/signup', (req, res) => {
  res.render('signup', {
    Config,
    user: res.locals.user,
  });
});

router.get('/bingo', (req, res) => {
  const { session } = req;
  res.render('bingo', {
    Config,
    message: session.message,
    user: session.user ? session.user.name : null,
    bingo: {
      contents: new Bingo(),
    },
  });
});

router.post('/signup', async (req, res) => {
  try {
    await User.signup(req.body.name, req.body.password);
    res.status(201).render('signup', {
      Config,
    });
  } catch (e) {
    switch (e.message) {
      case 'User already exists.':
        res.status(500).render('signup', {
          Config,
          error: {
            name: 'User already exists',
            message: 'User already exists. Please try another username.',
          },
          code: 500,
        });
        break;
      default:
        res.status(500).render('error', {
          Config,
          error: {
            title: 'TODO',
            message: e,
          },
          code: 500,
        });
    }
  }
});

module.exports = router;
