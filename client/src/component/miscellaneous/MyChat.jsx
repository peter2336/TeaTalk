import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderPic, isToday } from "../../config/ChatLogic";
import {
  Avatar,
  Box,
  Divider,
  Img,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import API_URL from "../../apiConfig";

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    chat,
    setChat,
    notification,
    setNotification,
    unreadMsg,
    setUnreadMsg,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const timeRegex = /\S{2}\d+\:+\d+/;
  const dateRegex = /\d+\/\d+\/\d+/;

  const readMessage = async (chatData) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.patch(
        `${API_URL}/api/message/read`,
        {
          chat: chatData._id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChat = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.get(`${API_URL}/api/chat`, {
        headers: {
          Authorization: token,
        },
      });
      setChat(data);
      setLoading(false);
    } catch (error) {
      toast({
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChat();
  }, [fetchAgain]);

  return (
    <Box
      display={{
        base: selectedChat ? "none" : "flex",
        md: "flex",
        lg: "flex",
      }}
      flexDirection="column"
      alignItems="center"
      bg="#2B2D31"
      _light={{ bg: "#F2F3F5" }}
      w={{ base: "100%", md: "31%" }}
      minWidth="280px"
    >
      <Box
        p={3}
        fontSize="20px"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        userSelect="none"
        _light={{ color: "black" }}
      >
        聊天室
      </Box>
      <Divider />
      <Box
        display="flex"
        flexDirection="column"
        w="100%"
        h="100%"
        overflowY="hidden"
        userSelect="none"
      >
        {chat.length > 0 ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <Stack overflowY="auto" p={3}>
              {chat?.map((chatData) => (
                <Box
                  onClick={() => {
                    setSelectedChat(chatData);
                    readMessage(chatData);
                    setNotification(
                      notification.filter(
                        (n) => n.chat._id !== selectedChat._id
                      )
                    );
                    setUnreadMsg(
                      unreadMsg.filter((n) => n.chat._id !== chatData._id)
                    );
                  }}
                  cursor="pointer"
                  bg={
                    selectedChat?._id === chatData._id ? "#3F3F46" : "#2B2D31"
                  }
                  _light={
                    selectedChat?._id === chatData._id
                      ? { bg: "#E0E1E5" }
                      : { bg: "#F2F3F5" }
                  }
                  px={3}
                  borderRadius="lg"
                  key={chatData._id}
                  _hover={{
                    bg: "#3F3F46",
                    _light: { _hover: { bg: "#E0E1E5" } },
                  }}
                  h="58px"
                  display="flex"
                  alignItems="center"
                  transition="ease 0.1s"
                  position="relative"
                >
                  <Avatar
                    size="md"
                    src={
                      chatData.isGroupChat == false && loggedUser
                        ? getSenderPic(loggedUser, chatData.users)
                        : chatData.pic
                    }
                  />
                  <Box ml={3}>
                    <Text>
                      {chatData.isGroupChat == false && loggedUser
                        ? getSender(loggedUser, chatData.users)
                        : `${chatData.chatName} (${chatData.users.length})`}
                    </Text>
                    {chatData.latestMessage && (
                      <Text fontSize="xs" color="#949494">
                        <b>{chatData.latestMessage.sender.name} : </b>
                        {chatData.latestMessage.content.length > 10
                          ? chatData.latestMessage.content.substring(0, 11) +
                            "..."
                          : chatData.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                  <Box position="absolute" right={3} top={2}>
                    {!chatData.hasOwnProperty("latestMessage") ? (
                      <></>
                    ) : isToday(
                        new Date(),
                        new Date(chatData.latestMessage?.createdAt)
                      ) ? (
                      <Text fontSize="xs" color="#949494">
                        {moment(chatData.latestMessage?.createdAt)
                          .toDate()
                          .toLocaleString()
                          .match(timeRegex)}
                      </Text>
                    ) : (
                      <Text fontSize="xs" color="#949494">
                        {moment(chatData.latestMessage?.createdAt)
                          .toDate()
                          .toLocaleString()
                          .match(dateRegex)}
                      </Text>
                    )}
                  </Box>
                  <Box position="absolute" right={3} bottom={2}>
                    {notification?.find((n) => n.chat._id === chatData._id) ? (
                      <Text
                        fontSize="xs"
                        bg="#44AD53"
                        borderRadius="full"
                        minW="18px"
                        px={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                      >
                        {notification.filter((n) => n.chat._id === chatData._id)
                          .length +
                          unreadMsg.filter((n) => n.chat._id === chatData._id)
                            .length}
                      </Text>
                    ) : unreadMsg?.find((n) => n.chat._id === chatData._id) ? (
                      <Text
                        fontSize="xs"
                        bg="#44AD53"
                        borderRadius="full"
                        minW="18px"
                        px={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                      >
                        {
                          unreadMsg.filter((n) => n.chat._id === chatData._id)
                            .length
                        }
                      </Text>
                    ) : (
                      <Text color="transparent" fontSize="xs">
                        0
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </SimpleBar>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="lg"
            h="100%"
            w="100%"
            flexDirection="column"
            opacity="50%"
            _light={{ opacity: "70%" }}
          >
            <Img
              src="https://res.cloudinary.com/tea-talk/image/upload/v1706270805/Job_hunt-pana_heb61q.svg"
              h="30%"
              alt="Job hunt-pana"
            />
            搜尋好友開始聊天！
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
