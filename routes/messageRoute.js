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

//get unread message
router.get("/check/unread", async (req, res) => {
  try {
    const unreadMessage = await Message.find({ read: false })
      .populate("sender", "name email pic")
      .populate("chat");
    res.status(200).send(unreadMessage);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//read message
router.patch("/read", async (req, res) => {
  const { chatId } = req.body;
  try {
    const readMessage = await Message.updateMany(
      { chat: chatId, read: false },
      { read: true },
      { new: true }
    );
    res.status(200).send(readMessage);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
