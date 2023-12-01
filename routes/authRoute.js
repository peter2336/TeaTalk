const router = require("express").Router();
const User = require("../models/userModel");
const { loginValidation } = require("../validation");
const { registerValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.use("/", (req, res, next) => {
  console.log("Authenticating...");
  next();
});

router.post("/register", async (req, res) => {
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    pic: req.body.pic,
  });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(401).send("此電子信箱已被使用");

  await newUser
    .save()
    .then((result) => {
      if (result) {
        const token = jwt.sign({ _id: result._id }, process.env.TOKEN_KEY);
        res.status(200).send({
          token: "JWT " + token,
          user: result,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("註冊失敗");
    });
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await User.findOne({ email: req.body.email })
    .then(async (user) => {
      await bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY);
            res.status(200).send({ token: "JWT " + token, user });
          } else {
            res.status(401).send("電子信箱或密碼錯誤");
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(401).send("電子信箱或密碼錯誤");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("電子信箱或密碼錯誤");
    });
});

module.exports = router;
