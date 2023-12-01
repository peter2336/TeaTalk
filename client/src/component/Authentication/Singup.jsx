import React, { useState } from "react";
import {
  FormControl,
  Input,
  VStack,
  FormLabel,
  InputGroup,
  Button,
  InputRightElement,
  Container,
  Box,
  Text,
  Link,
  useDisclosure,
  Link as ChakraLink,
  ScaleFade,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Singup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(); //空值
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { onOpen } = useDisclosure();

  //註冊帳號
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        description: "未填寫完整",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        description: "密碼不一致",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/user/register",
        { name, email, password, pic },
        {
          headers: {
            "Content-Type": "application/json", //不加這個還沒有看出有啥影響
          },
        }
      );
      toast({
        description: "註冊完成",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Container maxW="lg" centerContent justifyContent="center">
      <ScaleFade in={onOpen} initialScale={0.5}>
        <Box bg="#313338" w="100%" p="32px" borderRadius="lg">
          <VStack spacing="16px">
            <Text fontSize="20px" color="white">
              建立新帳號
            </Text>
            <FormControl id="Name" isRequired>
              <FormLabel fontSize="sm" color="#B5BAC1">
                使用者名稱
              </FormLabel>
              <Input
                type="text"
                onChange={(e) => setName(e.target.value)}
                variant="unstyled"
                h="40px"
                bg="#1E1F22"
                color="white"
                p={3}
              />
            </FormControl>

            <FormControl id="Email" isRequired>
              <FormLabel fontSize="sm" color="#B5BAC1">
                電子郵件
              </FormLabel>
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                variant="unstyled"
                h="40px"
                bg="#1E1F22"
                color="white"
                p={3}
              />
            </FormControl>

            <FormControl id="Password" isRequired>
              <FormLabel fontSize="sm" color="#B5BAC1">
                密碼
              </FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="unstyled"
                  h="40px"
                  bg="#1E1F22"
                  color="white"
                  p={3}
                />
                <InputRightElement w="52px">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShow(!show)}
                    bg="#303133"
                    color="white"
                    _hover={{ bg: "#424346" }}
                  >
                    {show ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="ConfirmPassword" isRequired>
              <FormLabel fontSize="sm" color="#B5BAC1">
                確認密碼
              </FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="unstyled"
                  h="40px"
                  bg="#1E1F22"
                  color="white"
                  p={3}
                />
                <InputRightElement w="52px">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShow(!show)}
                    bg="#303133"
                    color="white"
                    _hover={{ bg: "#424346" }}
                  >
                    {show ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              w="100%"
              fontWeight="normal"
              bg="#0078FF"
              color="white"
              _hover={{ bg: "#0063D1" }}
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}
            >
              建立
            </Button>

            <ChakraLink
              as={ReactRouterLink}
              to="/login"
              fontSize="14px"
              color="#00A8FC"
            >
              已經有一個帳號？
            </ChakraLink>
          </VStack>
        </Box>
      </ScaleFade>
    </Container>
  );
};

export default Singup;
