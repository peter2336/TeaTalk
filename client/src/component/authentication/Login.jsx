import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import {
  FormControl,
  Input,
  VStack,
  FormLabel,
  InputGroup,
  Button,
  InputRightElement,
  Text,
  Container,
  Box,
  ScaleFade,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { X } from "lucide-react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import API_URL from "../../apiConfig";

const Login = () => {
  const { setUser } = ChatState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { onOpen } = useDisclosure();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    if (user) navigate("/chat");
  }, [navigate]);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password,
      });
      toast({
        description: "登入成功",
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

  const guestLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/api/user/login`, {
        email: "guest@example.com",
        password: "123456",
      });
      toast({
        description: "登入成功",
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

  //按enter登入
  window.onkeydown = function (event) {
    if (event.keyCode == 13) {
      submitHandler();
      event.preventDefault();
    }
  };

  return (
    <Container maxW="350px" centerContent justifyContent="center">
      <Box
        position="absolute"
        top={5}
        right={5}
        cursor="pointer"
        color="#B5BAC1"
        _hover={{ color: "#FFFFFF" }}
        transition="all .2s"
        onClick={() => navigate("/")}
      >
        <X />
      </Box>
      <ScaleFade in={onOpen} initialScale={0.5}>
        <Box bg="#313338" w="100%" p="32px" borderRadius="lg">
          <VStack spacing="16px">
            <Text fontSize="20px" color="white">
              歡迎回來！
            </Text>
            <FormControl id="email" isRequired>
              <FormLabel fontSize="sm" color="#B5BAC1">
                電子郵件
              </FormLabel>
              <Input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                variant="unstyled"
                h="40px"
                bg="#1E1F22"
                color="white"
                p={3}
                autoFocus
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel fontSize="sm" color="#B5BAC1">
                密碼
              </FormLabel>
              <InputGroup>
                <Input
                  value={password}
                  type={show ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="unstyled"
                  h="40px"
                  bg="#1E1F22"
                  color="white"
                  p={3}
                  pr="3rem"
                />
                <InputRightElement w="3rem">
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
              登入
            </Button>

            <Button
              variant="link"
              color="#B5BAC1"
              fontSize="sm"
              fontWeight="normal"
              onClick={guestLogin}
            >
              訪客登入
            </Button>
            <Text fontSize="14px" color="white">
              需要一個帳號？
              <ChakraLink
                as={ReactRouterLink}
                to="/register"
                fontSize="14px"
                color="#00A8FC"
              >
                註冊
              </ChakraLink>
            </Text>
          </VStack>
        </Box>
      </ScaleFade>
    </Container>
  );
};

export default Login;
