// Validation
const Joi = require('joi');
const registerValidation = (data) => {
  const schema  =  Joi.object().keys({ 
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return Joi.validate(data, schema);
}

const loginValidation = (data) => {
  const schema  =  Joi.object().keys({ 
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return Joi.validate(data, schema);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;