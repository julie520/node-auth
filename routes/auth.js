const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
  // let's validate the data before we a user
  const { error } = registerValidation(req.body); 
  if (error) return res.status(400).send(error.details.map(i => i.message).join(','));

  // checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({user: user._id});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async(req, res) => {
  // let's validate the data before we a user
  const { error } = loginValidation(req.body); 
  if (error) return res.status(400).send(error.details.map(i => i.message).join(','));
 
  // checking if the eamil exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email or password is wrong');
 
  // password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  // create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);

});

module.exports = router;