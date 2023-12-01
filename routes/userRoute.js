const router = require("express").Router();
const User = require("../models/userModel");

router.get("/", async (req, res) => {
  let keyword = new RegExp(req.query.search, "i");
  await User.find({ email: keyword, _id: { $ne: req.user._id } }).then(
    (result) => {
      res.send(result);
    }
  );
});

router.get("/current-user", async (req, res) => {
  await User.findOne({ _id: req.user._id }).then((result) => {
    res.send(result);
  });
});

router.patch("/edit", async (req, res) => {
  const { userId, userName, pic } = req.body;
  if (req.user.id !== userId) {
    return res.status(401).send("Unauthorized");
  }
  const updateUser = await User.findByIdAndUpdate(
    userId,
    {
      name: userName,
      pic: pic,
    },
    {
      new: true,
    }
  );

  if (!updateUser) {
    res.status(404).json("Internal Error");
  } else {
    res.status(200).json(updateUser);
  }
});

router.patch("/edit/avatar", async (req, res) => {
  const { userId, pic } = req.body;
  if (req.user.id !== userId) {
    return res.status(401).send("Unauthorized");
  }
  const updateUserName = await User.findByIdAndUpdate(
    userId,
    {
      pic: pic,
    },
    {
      new: true,
    }
  );

  if (!updateUserName) {
    res.status(404).json("Internal Error");
  } else {
    res.status(200).json(updateUserName);
  }
});

module.exports = router;
