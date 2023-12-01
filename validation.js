const Joi = require("joi");

const registerValidation = (data) => {
  const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(3).max(50).email().required().messages({
      "string.email": "電子信箱格式錯誤",
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.min": "密碼至少為6個字元",
    }),
    pic: Joi.string(),
  });

  return userSchema.validate(data);
};

const loginValidation = (data) => {
  const loginSchema = Joi.object({
    email: Joi.string().min(3).max(50).required().messages({
      "string.email": "電子信箱格式錯誤",
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.min": "密碼至少為6個字元",
    }),
  });

  return loginSchema.validate(data);
};

module.exports = {
  registerValidation: registerValidation,
  loginValidation: loginValidation,
};
