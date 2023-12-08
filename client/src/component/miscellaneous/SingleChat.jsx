import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import { Image, SendHorizontal, Smile } from "lucide-react";
import EmojiMenu from "./EmojiMenu";

const socket = io("https://teatalk.onrender.com");
let selectedChatCompare = {};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [emojiFilter, setEmojiFilter] = useState("");
  const [startX, setStartX] = useState("");
  const [deltaX, setDeltaX] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const toast = useToast();
  const API_URL = "https://teatalk.onrender.com";

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("socket.io connection: " + socket.connected);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("socket.io connection: " + socket.connected);
    });

    socket.emit("setup", user);

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      //沒有選擇chat 或 我進入的chat跟收到的訊息所在的chat不一樣時 要收到notification
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.get(
        `${API_URL}/api/message/${selectedChat._id}`,
        { headers: { Authorization: token } }
      );
      setMessages(data);
      setLoading(false);
      setNotification(
        notification.filter((n) => n.chat._id !== selectedChat._id)
      );

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setSendLoading(true);
        setNewMessage(""); //因為requst是aync function 所以不會影響到 為了要enter後趕快消除input value
        const token = JSON.parse(localStorage.getItem("token"));
        const { data } = await axios.post(
          `${API_URL}/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setFetchAgain(!fetchAgain);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setSendLoading(false);
      } catch (error) {
        toast({
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        console.log(error);
        setSendLoading(false);
      }
    }
  };

  const clickSend = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setSendLoading(true);
        setNewMessage(""); //因為requst是aync function 所以不會影響到 為了要enter後趕快消除input value
        const token = JSON.parse(localStorage.getItem("token"));
        const { data } = await axios.post(
          `${API_URL}/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setFetchAgain(!fetchAgain);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setSendLoading(false);
      } catch (error) {
        toast({
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        console.log(error);
        setSendLoading(false);
      }
    }
  };

  const sendPic = async (imgUrl) => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.post(
        `${API_URL}/api/message`,
        { content: imgUrl, chatId: selectedChat._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setFetchAgain(!fetchAgain);
      socket.emit("new message", data);
      setMessages([...messages, data]);
      setLoading(false);
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 2500;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //按esc取消選擇聊天室
  window.onkeydown = function (event) {
    if (event.keyCode == 27) {
      setSelectedChat("");
      event.preventDefault();
    }
  };

  //上傳圖片
  const postDetails = async (pic) => {
    if (pic === undefined) {
      toast({
        description: "請選擇一張照片",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "tea-talk");
      data.append("cloud_name", "tea-talk");
      fetch("https://api.cloudinary.com/v1_1/tea-talk/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          sendPic(data.url);
          console.log("圖片傳送成功");
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      toast({
        description: "請選擇一張照片",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleScroll = () => {
    const isAtBottom =
      messagesRef.current.scrollHeight - messagesRef.current.scrollTop - 1 <=
      messagesRef.current.clientHeight;

    setShowScrollButton(!isAtBottom);
  };

  const handleScrollToBottom = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            pb={3}
            px={2}
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
          >
            <Tooltip label="返回" hasArrow placement="bottom">
              <IconButton
                display={{ base: "flex" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                variant="unstyled"
                _hover={{ color: "#a1a1aa" }}
                h="20px"
              />
            </Tooltip>

            {!selectedChat.isGroupChat ? (
              <>
                {
                  <Text
                    fontSize="20px"
                    px={3}
                    w="100%"
                    display="flex"
                    alignItems="center"
                    userSelect="none"
                  >
                    {getSender(user, selectedChat.users)}
                  </Text>
                }
                <ProfileModal
                  user={user}
                  otherUser={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {
                  <Text
                    fontSize="20px"
                    px={3}
                    w="100%"
                    display="flex"
                    alignItems="center"
                    userSelect="none"
                  >
                    {`${selectedChat.chatName} (${selectedChat.users.length})`}
                  </Text>
                }
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>

          <Divider />

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg={"#313338"}
            _light={{ bg: "#FFFFFF" }}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            overflowX="hidden"
            onTouchStart={(e) => setStartX(e.touches[0].clientX)}
            onTouchMove={(e) => {
              const currentX = e.touches[0].clientX;
              setDeltaX(currentX - startX);
              if (deltaX > 150) {
                setSelectedChat("");
                setDeltaX("");
              }
            }}
          >
            {loading ? (
              <Spinner size="xl" alignSelf="center" margin="auto" />
            ) : (
              <Box
                className="chatLog"
                _light={{
                  bgGradient: "linear(#FFFFFF, #FFFFFF)",
                  _hover: { backgroundColor: "#B7B7B7" },
                }}
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                ref={messagesRef}
                onScroll={handleScroll}
              >
                <ScrollableChat
                  messages={messages}
                  showScrollButton={showScrollButton}
                />
              </Box>
            )}

            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
              display="flex"
              alignItems="center"
            >
              {isTyping ? (
                <Text position="fixed" bottom="65px" fontSize="sm">
                  {getSender(user, selectedChat.users)}輸入中...
                </Text>
              ) : (
                <></>
              )}
              <Box p={1}></Box>
              <InputGroup>
                <Input
                  type="text"
                  bgColor="#3B3C42"
                  _light={{
                    bgColor: "#E7E7E9",
                  }}
                  placeholder="輸入訊息"
                  onChange={typingHandler}
                  value={newMessage}
                  variant="unstyled"
                  height="40px"
                  maxLength="256"
                  isInvalid
                />
                <InputLeftElement>
                  <label>
                    <Input
                      style={{ display: "none" }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => postDetails(e.target.files[0])}
                    />
                    <Box
                      color="#A1A1AA"
                      _hover={{ color: "#d4d4d8" }}
                      _light={{
                        color: "#71717A",
                        _hover: { color: "#52525b" },
                      }}
                    >
                      <Image size="22px" cursor="pointer" />
                    </Box>
                  </label>
                </InputLeftElement>
                <InputRightElement>
                  <Popover placement="top-start" arrowPadding={0}>
                    <PopoverTrigger>
                      <Box
                        color="#A1A1AA"
                        _hover={{ color: "#d4d4d8" }}
                        _light={{
                          color: "#71717A",
                          _hover: { color: "#52525b" },
                        }}
                      >
                        <Smile size="22px" cursor="pointer" />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverHeader>
                        <Input
                          type="search"
                          placeholder="請搜尋表情符號😄"
                          variant="unstyled"
                          h="40px"
                          p={3}
                          bg="#232A37"
                          _light={{ bg: "#E7E7E9", opacity: "60%" }}
                          onChange={(e) => setEmojiFilter(e.target.value)}
                          value={emojiFilter}
                        />
                      </PopoverHeader>
                      <PopoverBody>
                        <Box display="flex">
                          <EmojiMenu
                            setNewMessage={setNewMessage}
                            newMessage={newMessage}
                            emojiFilter={emojiFilter}
                          />
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </InputRightElement>
              </InputGroup>
              <Button
                isLoading={sendLoading}
                mx={2}
                p={1}
                colorScheme="messenger"
                onClick={() => clickSend()}
              >
                <SendHorizontal size="22px" />
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          bg={"#313338"}
          _light={{ bg: "#FFFFFF" }}
          userSelect="none"
        >
          <Text fontSize="2xl">開始聊天吧 !</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
