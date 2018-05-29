const bcrypt = require('bcrypt');
const User = require('./model');

const findOne = async (name, password) => {
  let res;
  try {
    const usr = await User.findOne({
      name,
    });
    res = await bcrypt.compare(password, usr.password);
  } catch (e) {
    console.error(e);
  }
  return res;
};

const auth = async (name, password) => {
  const res = await findOne(name, password);
  return res;
};

const signup = async (name, password) => {
  try {
    await User.create({
      name,
      password,
    });
  } catch (e) {
    if (e.message.match(/(.*)duplicate(.*)/)) {
      throw new Error('User already exists.');
    }
    throw e;
  }
};


module.exports = {
  findOne,
  auth,
  signup,
};
