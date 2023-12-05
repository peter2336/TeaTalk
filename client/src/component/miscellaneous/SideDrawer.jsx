import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
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
  Spinner,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { Bell, Sun, Moon, LogOut, UserSquare } from "lucide-react";
import React, { useState, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";

const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chat,
    setChat,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const API_URL = "https://teatalk.onrender.com";

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
      console.log(chat);
      console.log(data);
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

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", lg: "flex" }}
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
            _hover={{ color: "#a1a1aa" }}
            w="48px"
            h="48px"
          >
            <SearchIcon />
          </Button>
        </Tooltip>

        <Menu>
          <Tooltip label="訊息通知" hasArrow placement="right">
            <MenuButton
              as={Button}
              variant="unstyled"
              position="relative"
              _hover={{ color: "#a1a1aa" }}
              w="48px"
              h="48px"
            >
              {notification.length > 0 && (
                <Box
                  position="absolute"
                  minW="18px"
                  top="3px"
                  left="3px"
                  bg="red"
                  borderRadius="full"
                  px={1}
                  fontSize="xs"
                  color="white"
                >
                  {notification.length}
                </Box>
              )}
              <Box justifyContent="center" display="flex">
                <Bell size="20px" />
              </Box>
            </MenuButton>
          </Tooltip>
          <MenuList>
            {!notification.length && <MenuItem>目前沒有新的訊息</MenuItem>}
            {notification.map((msg) => (
              <MenuItem
                key={msg._id}
                onClick={() => {
                  setSelectedChat(msg.chat);
                  setNotification(
                    notification.filter((n) => n.chat._id !== msg.chat._id)
                  );
                }}
              >
                {msg.chat.isGroupChat
                  ? `${msg.chat.chatName}有新訊息`
                  : `${getSender(user, msg.chat.users)}有新訊息`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <GroupChatModal>
          <Tooltip label="建立群組" hasArrow placement="right">
            <Button
              variant="unstyled"
              _hover={{ color: "#a1a1aa" }}
              display="flex"
              w="48px"
              h="48px"
            >
              <ChatIcon />
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

            <MenuList>
              <ProfileModal
                user={user}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              >
                <MenuItem
                  icon={<UserSquare size="12.8px" />}
                  transition="ease all 0.1s"
                >
                  個人資料
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                icon={<LogOut size="12.8px" />}
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
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">搜尋用戶</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="請輸入用戶Email"
                marginRight={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="unstyled"
                h="40px"
                p={3}
                bg="#232A37"
                _light={{ bg: "#E7E7E9" }}
              />
              <Button onClick={searchHandler} isLoading={loading}>
                <SearchIcon />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id, user.pic)}
                />
              ))
            )}
            <Box w="100%" display="flex" justifyContent="center">
              {loadingChat && <Spinner display="flex" />}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
