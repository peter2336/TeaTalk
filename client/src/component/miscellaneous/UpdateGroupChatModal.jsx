import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronRight,
  PenSquare,
  Settings,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import UserBadgeItem from "./UserBadgeItem";
import GroupUserListItem from "./GroupUserListItem";
import ManageUserListItem from "./ManageUserListItem";
import axios from "axios";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import API_URL from "../../apiConfig";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isManageOpen,
    onOpen: onManageOpen,
    onClose: onManageClose,
  } = useDisclosure();

  const {
    isOpen: isInviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pic, setPic] = useState(selectedChat.pic);
  const [disable, setDisable] = useState(true);
  const [existUser, setExistUser] = useState([]);
  const toast = useToast();

  //上傳圖片
  const postDetails = async (pic) => {
    setLoading(true);
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
          setPic(data.url.toString());
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

  const editGroupChat = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.patch(
        `${API_URL}/api/chat/edit`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
          pic: pic,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      onEditClose();
      setLoading(false);
      toast({
        description: "修改完成",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
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
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setSearch(query);
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.get(`${API_URL}/api/user?search=${search}`, {
        headers: {
          Authorization: token,
        },
      });
      const existUserData = data.filter((d) => {
        return selectedChat.users.some((u) => {
          return u._id === d._id;
        });
      });
      setExistUser(existUserData);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    if (selectedUsers.length < 1) {
      toast({
        description: "尚未選取邀請的成員",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.patch(
        `${API_URL}/api/chat/group-add`,
        {
          chatId: selectedChat._id,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      handleClose();
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
      setLoading(false);
    }
  };

  const userAddCancel = (addCancel) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== addCancel._id)
    );
    if (selectedUsers.length < 2) {
      setDisable(true);
    }
  };

  const groupAddHandler = (addUser) => {
    if (selectedUsers.includes(addUser)) {
      userAddCancel(addUser);
      return;
    }
    setDisable(false);
    setSelectedUsers([...selectedUsers, addUser]);
  };

  const handleRemove = async (removeUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      removeUser._id !== user._id
    ) {
      toast({
        description: "您未擁有權限",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.patch(
        `${API_URL}/api/chat/group-remove`,
        {
          chatId: selectedChat._id,
          userId: removeUser._id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      removeUser._id === user._id ? setSelectedChat("") : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      onManageClose();
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
      setLoading(false);
    }
  };

  const handleClose = () => {
    onEditClose();
    onInviteClose();
    setSearch("");
    setSearchResult([]);
    setSelectedUsers([]);
    setDisable(true);
    setGroupChatName(selectedChat.chatName);
    setPic(selectedChat.pic);
  };

  return (
    <>
      <Tooltip label="群組設定" hasArrow placement="bottom">
        <IconButton
          display={{ base: "flex" }}
          icon={<Settings size="20px" />}
          onClick={onOpen}
          onFocus={(e) => e.preventDefault()}
          variant="unstyled"
          _hover={{ color: "#a1a1aa" }}
          h="20px"
          mr={2}
        />
      </Tooltip>

      <Modal size="xs" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent _dark={{ bg: "#313338" }}>
          <ModalHeader display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar
              size="2xl"
              src={selectedChat.pic}
              name={selectedChat.chatName}
            />

            <Text fontSize="16px" userSelect="none" mt={4}>
              成員{`(${selectedChat.users?.length})`}
            </Text>
            <Box display="flex" p={3}>
              {selectedChat.users?.slice(0, 4).map((user) => (
                <Box key={user._id}>
                  <Avatar mr={2} size="sm" name={user.name} src={user.pic} />
                </Box>
              ))}
              {selectedChat.users.length > 0 && (
                <Text
                  bg="#60B1B2"
                  borderRadius="full"
                  w="32px"
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                  color="#FFFFFF"
                  opacity="0.8"
                  onClick={onManageOpen}
                  cursor="pointer"
                >
                  <ChevronRight size="18px" />
                </Text>
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            {/* 群組設定下拉選單 */}
            <Menu autoSelect={false}>
              <MenuButton colorScheme="blue" as={Button}>
                設定
              </MenuButton>
              <MenuList _dark={{ bg: "#313338" }}>
                <MenuItem
                  _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                  icon={<PenSquare size="20px" />}
                  transition="ease all 0.1s"
                  onClick={onEditOpen}
                >
                  編輯群組
                </MenuItem>
                <MenuItem
                  _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                  icon={<Users size="20px" />}
                  transition="ease all 0.1s"
                  onClick={onManageOpen}
                >
                  成員管理
                </MenuItem>
                <MenuItem
                  _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                  icon={<UserPlus size="20px" />}
                  transition="ease all 0.1s"
                  onClick={onInviteOpen}
                >
                  邀請
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  _dark={{ bg: "#313338", _hover: { bg: "#404249" } }}
                  icon={<XCircle size="20px" />}
                  color="#B86B5E"
                  transition="ease all 0.1s"
                  onClick={() => handleRemove(user)}
                >
                  退出群組
                </MenuItem>
              </MenuList>
            </Menu>

            {/* 編輯群組 */}
            <>
              <Modal
                size="xs"
                isOpen={isEditOpen}
                onClose={handleClose}
                isCentered
              >
                <ModalOverlay />
                <ModalContent _dark={{ bg: "#313338" }}>
                  <ModalHeader display="flex" justifyContent="center">
                    編輯群組
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box position="relative" mb={3}>
                      <Avatar
                        borderRadius="full"
                        size="2xl"
                        src={pic}
                        name={user.name}
                      />
                      <Box position="absolute" bottom={1} right={1}>
                        <label className="editAvatar">
                          <Input
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(e) => postDetails(e.target.files[0])}
                          />
                          <EditIcon
                            cursor="pointer"
                            color="white"
                            h="26px"
                            w="26px"
                            bg="black"
                            p={1}
                            borderRadius="full"
                            opacity="0.8"
                          />
                        </label>
                      </Box>
                    </Box>

                    <FormControl
                      display="flex"
                      id="groupChatName"
                      flexDirection="column"
                      mt={4}
                    >
                      <FormLabel fontSize="sm">群組名稱</FormLabel>
                      <Input
                        variant="filled"
                        value={groupChatName}
                        type="text"
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="whatsapp"
                      onClick={editGroupChat}
                      isLoading={loading}
                    >
                      儲存
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>

            {/* 成員管理 */}
            <>
              <Modal
                size="xs"
                isOpen={isManageOpen}
                onClose={onManageClose}
                isCentered
              >
                <ModalOverlay />
                <ModalContent _dark={{ bg: "#313338" }}>
                  <ModalHeader display="flex" justifyContent="center">
                    成員管理
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <SimpleBar style={{ maxHeight: 250 }}>
                      <Box
                        h="250px"
                        className="chatLog"
                        _light={{
                          bgGradient: "linear(#FFFFFF, #FFFFFF)",
                          _hover: { backgroundColor: "#B7B7B7" },
                        }}
                        _dark={{
                          bgGradient: "linear(#313338, #313338)",
                          _hover: { backgroundColor: "#616161" },
                        }}
                        px={3}
                      >
                        {selectedChat.users?.map((user) => (
                          <ManageUserListItem
                            key={user._id}
                            user={user}
                            handleFunction={handleRemove}
                            selectedChat={selectedChat}
                          />
                        ))}
                      </Box>
                    </SimpleBar>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" onClick={onManageClose}>
                      關閉
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* 邀請 */}
              <Modal
                size="xs"
                isOpen={isInviteOpen}
                onClose={handleClose}
                isCentered
              >
                <ModalOverlay />
                <ModalContent _dark={{ bg: "#313338" }}>
                  <ModalHeader display="flex" justifyContent="center">
                    邀請
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl>
                      <FormLabel fontSize="sm">邀請成員</FormLabel>
                      <Input
                        placeholder="請輸入成員Email"
                        mb={2}
                        onChange={(e) => handleSearch(e.target.value)}
                        variant="unstyled"
                        h="40px"
                        p={3}
                        bg="#3B3C42"
                        _light={{ bg: "#E7E7E9" }}
                      />
                    </FormControl>

                    <SimpleBar style={{ maxHeight: 200 }}>
                      <Box
                        h="200px"
                        _light={{
                          bgGradient: "linear(#FFFFFF, #FFFFFF)",
                          _hover: { backgroundColor: "#B7B7B7" },
                        }}
                        _dark={{
                          bgGradient: "linear(#313338, #313338)",
                          _hover: { backgroundColor: "#616161" },
                        }}
                        px={3}
                      >
                        {loading ? (
                          <></>
                        ) : (
                          searchResult?.map((user) => (
                            <GroupUserListItem
                              key={user._id}
                              user={user}
                              handleFunction={() => groupAddHandler(user)}
                              selectedUsers={selectedUsers}
                              existUser={existUser}
                            />
                          ))
                        )}
                      </Box>
                    </SimpleBar>

                    <Box display="block" minH="38px">
                      {selectedUsers?.map((user) => (
                        <UserBadgeItem
                          key={user._id}
                          user={user}
                          handleFunction={() => userAddCancel(user)}
                        />
                      ))}
                    </Box>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="whatsapp"
                      onClick={submitHandler}
                      isLoading={loading}
                      isDisabled={disable}
                    >
                      邀請
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
