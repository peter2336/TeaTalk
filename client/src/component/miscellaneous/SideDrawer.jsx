import React, { useState, useRef, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { getSender, isToday } from "../../config/ChatLogic";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  UserSquare,
  Search,
  MessageCircleMore,
  UserSearch,
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import GroupChatModal from "./GroupChatModal";
import UserListItem from "./UserListItem";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import moment from "moment";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const {
    user,
    selectedChat,
    setSelectedChat,
    chat,
    setChat,
    notification,
    setNotification,
    unreadMsg,
    setUnreadMsg,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const API_URL = "https://teatalk.onrender.com";

  const timeRegex = /\S{2}\d+\:+\d+/;
  const dateRegex = /\d+\/\d+\/\d+/;

  const unread = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const { data } = await axios.get(`${API_URL}/api/message/notification`, {
      headers: {
        Authorization: token,
      },
    });
    setUnreadMsg(data);
  };

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

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSelectedChat("");
    navigate("/");
  };

  const searchHandler = async () => {
    if (!search) {
      toast({
        title: "請輸入用戶Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.get(`${API_URL}/api/user?search=${search}`, {
        headers: {
          Authorization: token,
        },
      });

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      console.log(error);
    }
    setSearch("");
  };

  const accessChat = async (userId, pic) => {
    try {
      setLoadingChat(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.post(
        `${API_URL}/api/chat`,
        { userId, pic },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!chat.find((c) => c._id === data._id)) {
        setChat([data, ...chat]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
    setSearch("");
    setSearchResult([]);
  };

  useEffect(() => {
    unread();
  }, []);

  return (
    <>
      <Box
        display={{
          base: selectedChat ? "none" : "flex",
          md: "flex",
          lg: "flex",
        }}
        flexDirection="column"
        alignItems="center"
        bg="#1E1F22"
        _light={{ bg: "#E3E5E8" }}
        w="72px"
        minWidth="72px"
        p={2}
        borderWidth="0px"
        position="relative"
      >
        <Tooltip label="搜尋用戶" hasArrow placement="right">
          <Button
            variant="unstyled"
            ref={btnRef}
            onClick={onOpen}
            onFocus={(e) => e.preventDefault()}
            _hover={{ color: "#a1a1aa" }}
            w="48px"
            h="48px"
          >
            <Box justifyContent="center" display="flex">
              <UserSearch size="20px" />
            </Box>
          </Button>
        </Tooltip>

        <Popover placement="bottom-end" autoSelect={false}>
          <Tooltip label="訊息通知" hasArrow placement="right">
            <Box>
              <PopoverTrigger>
                <Box
                  onFocus={(e) => e.preventDefault()}
                  as={Button}
                  variant="unstyled"
                  position="relative"
                  _hover={{ color: "#a1a1aa" }}
                  w="48px"
                  h="48px"
                >
                  {!notification.length && !unreadMsg.length ? (
                    <></>
                  ) : notification.length ? (
                    <Box
                      position="absolute"
                      top="3px"
                      left="3px"
                      bg="red"
                      borderRadius="full"
                      w="18px"
                      fontSize="xs"
                      color="white"
                    >
                      {notification.length + unreadMsg.length}
                    </Box>
                  ) : (
                    <Box
                      position="absolute"
                      top="3px"
                      left="3px"
                      bg="red"
                      borderRadius="full"
                      w="18px"
                      fontSize="xs"
                      color="white"
                    >
                      {unreadMsg.length}
                    </Box>
                  )}
                  <Box justifyContent="center" display="flex">
                    <Bell size="20px" />
                  </Box>
                </Box>
              </PopoverTrigger>
            </Box>
          </Tooltip>
          <PopoverContent _dark={{ bg: "#313338" }}>
            <PopoverHeader fontSize="20px" userSelect="none">
              訊息通知
            </PopoverHeader>
            {!notification.length && !unreadMsg.length && (
              <PopoverBody
                _dark={{ bg: "#313338" }}
                display="flex"
                alignItems="center"
                userSelect="none"
              >
                <Box display="flex" alignItems="center">
                  <Text>目前沒有新的訊息</Text>
                </Box>
              </PopoverBody>
            )}
            <PopoverBody px={0}>
              <SimpleBar style={{ maxHeight: 270 }}>
                <Box
                  _light={{
                    bgGradient: "linear(#FFFFFF, #FFFFFF)",
                    _hover: { backgroundColor: "#B7B7B7" },
                  }}
                  px={3}
                  py={1}
                >
                  {notification.length > 0 &&
                    notification?.map((msg) => (
                      <Box
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        py={2}
                        px={3}
                        borderRadius="lg"
                        position="relative"
                        transition="all 0.1s"
                        _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                        _light={{ _hover: { bg: "#EDF2F7" } }}
                        key={msg._id}
                        onClick={() => {
                          setSelectedChat(msg.chat);
                          readMessage(msg.chat);
                          setNotification(
                            notification.filter(
                              (n) => n.chat._id !== msg.chat._id
                            )
                          );
                        }}
                      >
                        <Avatar
                          mr={2}
                          name={
                            msg.chat.isGroupChat
                              ? msg.chat.chatName
                              : msg.sender.name
                          }
                          src={
                            msg.chat.isGroupChat ? msg.chat.pic : msg.sender.pic
                          }
                          size="sm"
                        />
                        <Box>
                          <Text>
                            {msg.chat.isGroupChat
                              ? `${msg.chat.chatName}`
                              : `${getSender(user, msg.chat.users)}`}
                          </Text>
                          <Text fontSize="xs" color="#949494">
                            <b>{msg.sender.name} : </b>
                            {msg.content.length > 28
                              ? msg.content.substring(0, 31) + "..."
                              : msg.content}
                          </Text>
                        </Box>
                        <Box position="absolute" right={3} top={2}>
                          {isToday(new Date(), new Date(msg.createdAt)) ? (
                            <Text fontSize="xs" color="#949494">
                              {moment(msg.createdAt)
                                .toDate()
                                .toLocaleString()
                                .match(timeRegex)}
                            </Text>
                          ) : (
                            <Text fontSize="xs" color="#949494">
                              {moment(msg.createdAt)
                                .toDate()
                                .toLocaleString()
                                .match(dateRegex)}
                            </Text>
                          )}
                        </Box>
                      </Box>
                    ))}
                  {unreadMsg.length > 0 &&
                    unreadMsg?.map((msg) => (
                      <Box
                        display="flex"
                        alignItems="center"
                        cursor="pointer"
                        py={2}
                        px={3}
                        borderRadius="lg"
                        position="relative"
                        transition="all 0.1s"
                        _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                        _light={{ _hover: { bg: "#EDF2F7" } }}
                        key={msg._id}
                        onClick={() => {
                          setSelectedChat(msg.chat);
                          readMessage(msg.chat);
                          setUnreadMsg(
                            unreadMsg.filter((n) => n.chat._id !== msg.chat._id)
                          );
                        }}
                      >
                        <Avatar
                          mr={2}
                          name={
                            msg.chat.isGroupChat
                              ? msg.chat.chatName
                              : msg.sender.name
                          }
                          src={
                            msg.chat.isGroupChat ? msg.chat.pic : msg.sender.pic
                          }
                          size="sm"
                        />
                        <Box>
                          <Text>
                            {msg.chat.isGroupChat
                              ? `${msg.chat.chatName}`
                              : `${getSender(user, msg.chat.users)}`}
                          </Text>
                          <Text fontSize="xs" color="#949494">
                            <b>{msg.sender.name} : </b>
                            {msg.content.length > 29
                              ? msg.content.substring(0, 30) + "..."
                              : msg.content}
                          </Text>
                        </Box>
                        <Box position="absolute" right={3} top={2}>
                          {isToday(new Date(), new Date(msg.createdAt)) ? (
                            <Text fontSize="xs" color="#949494">
                              {moment(msg.createdAt)
                                .toDate()
                                .toLocaleString()
                                .match(timeRegex)}
                            </Text>
                          ) : (
                            <Text fontSize="xs" color="#949494">
                              {moment(msg.createdAt)
                                .toDate()
                                .toLocaleString()
                                .match(dateRegex)}
                            </Text>
                          )}
                        </Box>
                      </Box>
                    ))}
                </Box>
              </SimpleBar>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <GroupChatModal>
          <Tooltip label="建立群組" hasArrow placement="right">
            <Button
              onFocus={(e) => e.preventDefault()}
              variant="unstyled"
              _hover={{ color: "#a1a1aa" }}
              display="flex"
              w="48px"
              h="48px"
            >
              <MessageCircleMore size="20px" />
            </Button>
          </Tooltip>
        </GroupChatModal>

        <Button
          onClick={toggleColorMode}
          variant="unstyled"
          _hover={{ color: "#a1a1aa" }}
          w="48px"
          h="48px"
          display="flex"
          alignItems="center"
        >
          {colorMode === "light" ? <Moon size="20px" /> : <Sun size="20px" />}
        </Button>

        <Popover>
          <Menu autoSelect={false}>
            <MenuButton
              position="absolute"
              bottom="1rem"
              as={IconButton}
              icon={<Avatar name={user.name} src={user.pic} />}
              variant="unstyled"
            />

            <MenuList _dark={{ bg: "#313338" }}>
              <ProfileModal
                user={user}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              >
                <MenuItem
                  _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                  icon={<UserSquare size="20px" />}
                  transition="ease all 0.1s"
                >
                  個人資料
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                icon={<LogOut size="20px" />}
                onClick={logoutHandler}
                transition="ease all 0.1s"
              >
                登出
              </MenuItem>
            </MenuList>
          </Menu>
        </Popover>
      </Box>

      <Drawer placement="left" onClose={handleClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent _dark={{ bg: "#313338" }}>
          <DrawerCloseButton mt="2px" />
          <DrawerHeader
            display="flex"
            alignItems="center"
            borderBottomWidth="1px"
            fontWeight="normal"
            userSelect="none"
            h="54px"
          >
            搜尋用戶
          </DrawerHeader>
          <DrawerHeader userSelect="none" p={2} alignItems="center">
            <Box display="flex">
              <Input
                placeholder="請輸入用戶Email"
                marginRight={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="unstyled"
                h="40px"
                p={3}
                bg="#3B3C42"
                _light={{ bg: "#E7E7E9" }}
                autoFocus
              />
              <Button
                onClick={searchHandler}
                isLoading={loading}
                p={1}
                colorScheme="blue"
              >
                <Search size="20px" />
              </Button>
            </Box>
          </DrawerHeader>

          <SimpleBar style={{ maxHeight: "calc(100% - 110px)" }}>
            <DrawerBody pt={0} px={3}>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      accessChat(user._id, user.pic);
                      setSelectedUser(user);
                    }}
                    loadingChat={loadingChat}
                    selectedUser={selectedUser}
                  />
                ))
              )}
            </DrawerBody>
          </SimpleBar>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
