import React, { useState } from "react";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Input,
  useToast,
  Tooltip,
  FormControl,
  FormLabel,
  Avatar,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { UserSquare } from "lucide-react";
import axios from "axios";

const ProfileModal = ({
  user,
  otherUser,
  children,
  fetchAgain,
  setFetchAgain,
}) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isOtherUserOpen,
    onOpen: onOtherUserOpen,
    onClose: onOtherUserClose,
  } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState(user.pic);
  const [name, setName] = useState(user.name);
  const toast = useToast();
  const API_URL = "https://teatalk.onrender.com";

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

  const fetchCurrentUser = async () => {
    const { data } = await axios.get(`${API_URL}/api/user/current-user`, {
      headers: {
        Authorization: token,
      },
    });
    localStorage.setItem("user", JSON.stringify(data));
    setFetchAgain(!fetchAgain);
  };

  const editUserInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${API_URL}/api/user/edit`,
        {
          userId: user._id,
          userName: name,
          pic: pic,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchCurrentUser();
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

  const handleClose = () => {
    onEditClose();
    setPic(user.pic);
    setName(user.name);
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Tooltip label="用戶資訊" hasArrow placement="bottom">
          <IconButton
            display={{ base: "flex" }}
            icon={<UserSquare size="20px" />}
            onClick={onOtherUserOpen}
            onFocus={(e) => e.preventDefault()}
            variant="unstyled"
            _hover={{ color: "#a1a1aa" }}
            h="20px"
            mr={2}
          />
        </Tooltip>
      )}

      {user._id === currentUser._id && (
        <Modal size="xs" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent _dark={{ bg: "#313338" }}>
            <ModalHeader display="flex" justifyContent="center">
              {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar
                borderRadius="full"
                size="2xl"
                src={user.pic}
                name={user.name}
              />

              <br />
              <Text fontSize="16px" userSelect="none">
                電子郵件
              </Text>
              <Text fontSize="18px">{user.email}</Text>
            </ModalBody>

            {/* 編輯個人資料 */}
            <ModalFooter>
              <Button colorScheme="blue" onClick={onEditOpen}>
                編輯
              </Button>
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
                      編輯個人資料
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box position="relative">
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
                      <br />
                      <FormControl
                        id="Name"
                        display="flex"
                        flexDirection="column"
                      >
                        <FormLabel fontSize="sm">使用者名稱</FormLabel>
                        <Input
                          variant="filled"
                          value={name}
                          type="text"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="whatsapp"
                        onClick={editUserInfo}
                        isLoading={loading}
                      >
                        儲存
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* 別人的用戶資訊-1v1 */}
      {otherUser && (
        <Modal
          size="xs"
          isOpen={isOtherUserOpen}
          onClose={onOtherUserClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent _dark={{ bg: "#313338" }}>
            <ModalHeader display="flex" justifyContent="center">
              {otherUser.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar
                borderRadius="full"
                size="2xl"
                src={otherUser.pic}
                name={otherUser.name}
              />

              <br />
              <Text fontSize="16px" userSelect="none">
                電子郵件
              </Text>
              <Text fontSize="18px">{otherUser.email}</Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={onOtherUserClose}>
                關閉
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* 別人的用戶資訊-群組用 */}
      {user._id !== currentUser._id && (
        <Modal size="xs" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent _dark={{ bg: "#313338" }}>
            <ModalHeader display="flex" justifyContent="center">
              {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar
                borderRadius="full"
                size="2xl"
                src={user.pic}
                name={user.name}
              />

              <br />
              <Text fontSize="16px" userSelect="none">
                電子郵件
              </Text>
              <Text fontSize="18px">{user.email}</Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                關閉
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
