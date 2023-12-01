import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
  FormLabel,
  Avatar,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import GroupUserListItem from "./GroupUserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { EditIcon } from "@chakra-ui/icons";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenStep2,
    onOpen: onOpenStep2,
    onClose: onCloseStep2,
  } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState(
    "https://icon-library.com/images/what-is-the-discord-icon/what-is-the-discord-icon-18.jpg"
  );
  const toast = useToast();
  const { chat, setChat } = ChatState();
  const API_URL = "https://teatalk.onrender.com";

  //上傳圖片
  const postDetails = (pic) => {
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

  const searchHandler = async (query) => {
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
    if (!groupChatName || !selectedUsers) {
      toast({
        description: "未填寫完整",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast({
        description: "至少須新增2位成員",
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
      const { data } = await axios.post(
        `${API_URL}/api/chat/group`,
        {
          chatName: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
          pic,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);

      setChat([data, ...chat]);
      onClose();
      setPic(
        "https://icon-library.com/images/what-is-the-discord-icon/what-is-the-discord-icon-18.jpg"
      );
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
      setLoading(false);
      toast({
        description: "建立完成",
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

  const groupAddHandler = (addUser) => {
    if (selectedUsers.includes(addUser)) {
      userAddCancel(addUser);
      return;
    }

    setSelectedUsers([...selectedUsers, addUser]);
  };

  const userAddCancel = (addCancel) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== addCancel._id)
    );
  };

  const handleClose = () => {
    onClose();
    setPic(
      "https://icon-library.com/images/what-is-the-discord-icon/what-is-the-discord-icon-18.jpg"
    );
    setGroupChatName("");
  };

  const handleClostStep2 = () => {
    onCloseStep2();
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
  };

  const handleOpenStep2 = () => {
    if (!groupChatName) {
      toast({
        description: "群組名稱未填寫",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    onOpenStep2();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="xs" isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center">
            建立群組
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box position="relative">
              <FormControl id="pic">
                <Avatar borderRadius="full" size="2xl" src={pic} />
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
              </FormControl>
            </Box>
            <br />
            <FormControl>
              <FormLabel fontSize="sm">群組名稱</FormLabel>
              <Input
                placeholder="群組名稱"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                variant="unstyled"
                h="40px"
                p={3}
                bg="#232A37"
                _light={{ bg: "#E7E7E9" }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleOpenStep2}
              isLoading={loading}
            >
              下一步
            </Button>
            {/* 建立群組step 2 */}
            <Modal
              size="xs"
              isOpen={isOpenStep2}
              onClose={handleClostStep2}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader display="flex" justifyContent="center">
                  新增成員
                </ModalHeader>
                <ModalBody>
                  <FormControl>
                    <FormLabel fontSize="sm">新增成員</FormLabel>
                    <Input
                      placeholder="請輸入成員Email"
                      mb={1}
                      onChange={(e) => searchHandler(e.target.value)}
                      variant="unstyled"
                      h="40px"
                      p={3}
                      bg="#232A37"
                      _light={{ bg: "#E7E7E9" }}
                    />
                  </FormControl>

                  <Box
                    h="200px"
                    overflowY="scroll"
                    className="chatLog"
                    _light={{
                      bgGradient: "linear(#FFFFFF, #FFFFFF)",
                      _hover: { backgroundColor: "#B7B7B7" },
                    }}
                    _dark={{
                      bgGradient: "linear(#2D3748, #2D3748)",
                      _hover: { backgroundColor: "#636F82" },
                    }}
                    px="4px"
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
                        />
                      ))
                    )}
                  </Box>

                  <Box display="block" minH="38px">
                    {selectedUsers.map((user) => (
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
                  >
                    建立群組
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
