import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Box, Divider, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { getSender, getSenderPic } from "../../config/ChatLogic";

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chat, setChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const API_URL = "https://teatalk.onrender.com";

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
      display={{ base: selectedChat ? "none" : "flex", lg: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="#2B2D31"
      _light={{ bg: "#F2F3F5" }}
      w={{ base: "100%", md: "31%" }}
      minWidth="240px"
      borderWidth="0px"
    >
      <Box
        pb={3}
        px={3}
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
        pt={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        userSelect="none"
      >
        {chat.length > 0 ? (
          <Stack overflowY="scroll">
            {chat?.map((chatData) => (
              <Box
                onClick={() => setSelectedChat(chatData)}
                cursor="pointer"
                bg={selectedChat?._id === chatData._id ? "#3F3F46" : "#2B2D31"}
                _light={
                  selectedChat?._id === chatData._id
                    ? { bg: "#CFCFD2" }
                    : { bg: "#F2F3F5" }
                }
                px={3}
                py={2}
                borderRadius="lg"
                key={chatData._id}
                _hover={{
                  bg: "#3F3F46",
                  _light: { _hover: { bg: "#CFCFD2" } },
                }}
                h="58px"
                display="flex"
                alignItems="center"
                transition="ease 0.1s"
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
                      : chatData.chatName}
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
              </Box>
            ))}
          </Stack>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default MyChat;