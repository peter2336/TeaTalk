const router = require("express").Router();
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//accessChat 個別用戶
router.post("/", async (req, res) => {
  const { userId, pic } = req.body;
  if (!userId) {
    console.log("userId param not sent with request");
    res.status(400);
  }

  let isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [{ users: req.user._id }, { users: userId }],
  })
    .populate("users", "-password")
    .populate("latestMessage") //except password
    .exec();

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (isChat) {
    res.send(isChat);
  } else {
    const chatData = new Chat({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
      pic: pic,
    });

    try {
      const groupChat = await chatData.save();
      const fullChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .exec();
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).send("create chat failed");
      console.log(error);
    }
  }
});

//fetchChat 取得個別或群組聊天
router.get("/", async (req, res) => {
  try {
    await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .exec()
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email pic",
        });

        res.status(200).send(result);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send("fetch chat failed");
  }
});

//createGroupChat
router.post("/group", async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send("fill all the feilds");
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("more than 2 users are required to create groupChat");
  }
  users.push(req.user);

  const groupChat = await new Chat({
    chatName: req.body.chatName,
    users: users,
    pic: req.body.pic,
    isGroupChat: true,
    groupAdmin: req.user,
  });
  try {
    await groupChat.save();

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .exec();

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.status(400).send("create groupChat failed");
  }
});

//renameGroupChat
router.patch("/rename", async (req, res) => {
  const { chatId, chatName } = req.body;
  const updateChateName = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .exec();
  if (!updateChateName) {
    res.status(404).send("chat not found");
  } else {
    res.status(200).json(updateChateName);
  }
});

//edit
router.patch("/edit", async (req, res) => {
  const { chatId, chatName, pic } = req.body;
  const editedGroup = await Chat.findByIdAndUpdate(
    chatId,

    {
      chatName: chatName,
      pic: pic,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .exec();
  if (!editedGroup) {
    res.status(404).send("chat not found");
  } else {
    res.status(200).json(editedGroup);
  }
});

//groupAdd
router.patch("/group-add", async (req, res) => {
  const { chatId, userId } = req.body;
  let users = JSON.parse(req.body.users);
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: users },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .exec();

  if (!added) {
    res.status(404).send("add user failed");
  } else {
    res.json(added);
  }
});

//groupRemove
router.patch("/group-remove", async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .exec();

  if (!removed) {
    res.status(404).send("add user failed");
  } else {
    res.json(removed);
  }
});

module.exports = router;
