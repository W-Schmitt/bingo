const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  clients: [
    String,
  ],
  score: {
    type: Number,
    default: 0,
  },
});

User.pre('save', async function tryHash(next) {
  const user = this;
  let hash;
  try {
    hash = await bcrypt.hash(user.password, 10);
  } catch (e) {
    throw e;
  }
  user.password = hash;
  next();
});

User.statics.authenticate = async function authenticate(name, password) {
  let currentUser;
  try {
    currentUser = await this.findOne({ name }).exec();
  } catch (e) {
    throw e;
  }
  if (!currentUser) {
    throw new Error('No such user');
  }
  if (bcrypt.compare(password, currentUser.password)) return currentUser;
  return false;
};

module.exports = mongoose.model('User', User);
