const router = require("express").Router();
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//create new message
router.post("/", async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400).send("invalid data");
  }

  let newMessage = new Message({
    sender: req.user._id,
    content: content,
    chat: chatId,
  });

  try {
    await newMessage.save();

    let message = await Message.findOne({ _id: newMessage._id })
      .populate("sender", "name pic")
      .populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email pic",
    });

    await Chat.findByIdAndUpdate(
      req.body.chatId,
      { latestMessage: message },
      { new: true }
    );
    res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

//search message
router.get("/", async (req, res) => {
  try {
    let keyword = new RegExp(req.query.search, "i");
    const messages = await Message.find({
      content: keyword,
      chat: req.body.chat,
    })
      .populate("sender", "name email pic")
      .populate("chat");

    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//read message
router.patch("/read", async (req, res) => {
  try {
    await Message.updateMany(
      { $and: [{ chat: req.body.chat }, { sender: { $ne: req.user._id } }] },
      {
        $addToSet: { read: req.user._id }, //如果read中沒有我(沒已讀)才加入
      }
    );

    const result = await Message.find({ chat: req.body.chat })
      .populate("chat")
      .exec();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//get unread message
router.get("/notification", async (req, res) => {
  try {
    const inChat = await Chat.find({ users: { $in: [req.user._id] } });
    const inChatId = inChat.flatMap((c) => c._id);
    let notification = await Message.find({
      $and: [
        { chat: { $in: inChatId } },
        { read: { $nin: [req.user._id] } },
        { sender: { $ne: req.user._id } },
      ],
    })
      .populate("sender", "name pic")
      .populate("chat")
      .sort({ createdAt: -1 });

    notification = await User.populate(notification, {
      path: "chat.users",
      select: "name email pic",
    });

    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//get all message
router.get("/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email pic")
      .populate("chat");
    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
