import React, { useEffect, useRef, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  GridItem,
  Link as ChakraLink,
  Image,
  Text,
  Link,
  Flex,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
} from "@chakra-ui/react";
import SimpleBar from "simplebar-react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

const AnimatedBox = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const props = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
    config: { duration: 1500 },
  });

  return (
    <animated.div ref={ref} style={props}>
      {children}
    </animated.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [navbarBg, setNavbarBg] = useState("transparent");
  const simplebarRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, [navigate]);

  useEffect(() => {
    const simplebarEl = simplebarRef.current.getScrollElement();
    simplebarEl.addEventListener("scroll", handleScroll);

    return () => {
      simplebarEl.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (simplebarRef.current.contentWrapperEl.scrollTop > 1) {
      setNavbarBg("rgba(39, 43, 46, .95)");
    } else {
      setNavbarBg("transparent");
    }
  };

  return (
    <SimpleBar style={{ maxHeight: "100%", width: "100%" }} ref={simplebarRef}>
      <Grid templateAreas={`"header" "main" "footer"`}>
        <GridItem
          bg={navbarBg}
          area={"header"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="sticky"
          top={0}
          transition="all .2s"
          zIndex={10}
          h="80px"
        >
          <ChakraLink as={ReactRouterLink} to="/" pr={5}>
            <Image
              h="60px"
              src="https://res.cloudinary.com/tea-talk/image/upload/v1708583548/teatalk_zjriap.png"
            />
          </ChakraLink>
          <ChakraLink
            as={ReactRouterLink}
            to={user ? "/chat" : "/login"}
            bg="#5865F2"
            borderRadius="full"
            padding="7px 16px"
            transition="all .2s"
            _hover={{
              bg: "#7289DA",
            }}
          >
            {user ? "開始聊天！" : "登入"}
          </ChakraLink>
        </GridItem>

        <GridItem bg="#FFFFFF" area={"main"}>
          <Box
            bg="#1D2022"
            h={{ base: "500px", md: "700px" }}
            color="#FFFFFF"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={5}
          >
            <AnimatedBox>
              <Text fontSize="20px" textAlign="center">
                在TeaTalk，您可以隨時隨地與三五好友一起排遣閒暇時光。這裡就是您輕鬆聊天的最佳去處。
              </Text>
              <Image
                w={{ base: "600px", md: "800px" }}
                src="https://res.cloudinary.com/tea-talk/image/upload/v1708662984/Conversation-pana_j14ebr.svg"
              />
            </AnimatedBox>
          </Box>

          <Box
            bg="#FFFFFF"
            h={{ base: "500px", md: "600px" }}
            color="#000000"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AnimatedBox>
              <Box
                display={{ base: "block", md: "flex" }}
                alignItems="center"
                justifyContent="center"
                px={5}
              >
                <Box textAlign="center" mr={{ md: "10" }}>
                  <Image
                    display="inline-block"
                    boxShadow="2px 2px 2px 1px rgba(0, 0, 0, 0.2)"
                    mb={{ base: 6, md: 0 }}
                    alt="groupchat"
                    w={{ base: "300px", md: "400px" }}
                    borderRadius="md"
                    src="https://res.cloudinary.com/tea-talk/image/upload/v1708666494/groupchat_jhs76l.png"
                  />
                </Box>

                <Box>
                  <Text
                    fontSize={{ base: "24px", md: "32px", lg: "40px" }}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    建立與親朋好友的聊天群組＋
                  </Text>
                  <Text
                    color="#777777"
                    fontSize="20px"
                    textAlign="center"
                    mt="24px"
                  >
                    您可以在這裡與他人一起分享，或是聊聊自己今天過得怎樣。
                  </Text>
                </Box>
              </Box>
            </AnimatedBox>
          </Box>

          <Box
            bg="#F6F6F6"
            h={{ base: "500px", md: "600px" }}
            color="#000000"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AnimatedBox>
              {useBreakpointValue({
                base: (
                  <Box
                    display={{ base: "block", md: "flex" }}
                    alignItems="center"
                    justifyContent="center"
                    px={5}
                  >
                    <Box textAlign="center" ml={{ md: "10" }}>
                      <Image
                        display="inline-block"
                        boxShadow="2px 2px 2px 1px rgba(0, 0, 0, 0.2)"
                        mb={{ base: 6, md: 0 }}
                        alt="groupchat"
                        w={{ base: "500px", md: "600px" }}
                        borderRadius="md"
                        src="https://res.cloudinary.com/tea-talk/image/upload/v1708671993/realtimechat_qqcoru.gif"
                      />
                    </Box>

                    <Box>
                      <Text
                        fontSize={{ base: "24px", md: "32px", lg: "40px" }}
                        fontWeight="bold"
                        textAlign="center"
                      >
                        即時通訊～
                      </Text>
                      <Text
                        color="#777777"
                        fontSize="20px"
                        textAlign="center"
                        mt="24px"
                      >
                        您發送的訊息可以零時差傳遞給對方彷彿彼此身處同一空間。
                      </Text>
                    </Box>
                  </Box>
                ),
                md: (
                  <Box
                    display={{ base: "block", md: "flex" }}
                    alignItems="center"
                    justifyContent="center"
                    px={5}
                  >
                    <Box>
                      <Text
                        fontSize={{ base: "24px", md: "32px", lg: "40px" }}
                        fontWeight="bold"
                        textAlign="center"
                      >
                        即時通訊～
                      </Text>
                      <Text
                        color="#777777"
                        fontSize="20px"
                        textAlign="center"
                        mt="24px"
                      >
                        您發送的訊息可以零時差傳遞給對方彷彿彼此身處同一空間。
                      </Text>
                    </Box>

                    <Box textAlign="center" ml={{ md: "10" }}>
                      <Image
                        display="inline-block"
                        boxShadow="2px 2px 2px 1px rgba(0, 0, 0, 0.2)"
                        mt={{ base: 6, md: 0 }}
                        alt="groupchat"
                        w={{ base: "500px", md: "600px" }}
                        borderRadius="md"
                        src="https://res.cloudinary.com/tea-talk/image/upload/v1708671993/realtimechat_qqcoru.gif"
                      />
                    </Box>
                  </Box>
                ),
              })}
            </AnimatedBox>
          </Box>

          <Box
            bg="#FFFFFF"
            h={{ base: "500px", md: "600px" }}
            color="#000000"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AnimatedBox>
              <Box
                display={{ base: "block", md: "flex" }}
                alignItems="center"
                justifyContent="center"
                px={5}
              >
                <Box textAlign="center" mr={{ md: "10" }}>
                  <Image
                    display="inline-block"
                    boxShadow="2px 2px 2px 1px rgba(0, 0, 0, 0.2)"
                    mb={{ base: 6, md: 0 }}
                    alt="groupchat"
                    w={{ base: "500px", md: "600px" }}
                    borderRadius="md"
                    src="https://res.cloudinary.com/tea-talk/image/upload/v1709879699/notification-demo_xu8mia.gif"
                  />
                </Box>

                <Box>
                  <Text
                    fontSize={{ base: "24px", md: "32px", lg: "40px" }}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    訊息通知！
                  </Text>
                  <Text
                    color="#777777"
                    fontSize="20px"
                    textAlign="center"
                    mt="24px"
                  >
                    對方發送的訊息會立刻通知您，確保不會錯過對方的任何訊息。
                  </Text>
                </Box>
              </Box>
            </AnimatedBox>
          </Box>

          <Box
            bg="#F6F6F6"
            h={{ base: "550px", md: "650px" }}
            color="#000000"
            display="block"
            px="15%"
            py={{ base: "10", md: "20" }}
          >
            <Text
              fontSize={{ base: "24px", md: "32px", lg: "40px" }}
              fontWeight="bold"
              textAlign="center"
            >
              常見問題？
            </Text>
            <Accordion allowToggle my={6} h="250px">
              <AccordionItem>
                <h2>
                  <AccordionButton borderRadius="lg">
                    <Box as="span" flex="1" textAlign="left" fontSize="20px">
                      如何註冊會員？
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize="18px" color="#06C755">
                  <Link onClick={() => navigate("/register")} cursor="pointer">
                    這裡開始註冊！
                  </Link>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton borderRadius="lg">
                  <Box as="span" flex="1" textAlign="left" fontSize="20px">
                    如何建立群組聊天？
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel fontSize="18px" color="#06C755">
                  點擊建立群組並設定群組資訊，即可開始聊天！
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton borderRadius="lg">
                  <Box as="span" flex="1" textAlign="left" fontSize="20px">
                    如何加入好友？
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel fontSize="18px" color="#06C755">
                  點擊搜尋用戶並輸入好友電子信箱！
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Text
              mb={5}
              fontSize={{ base: "24px", md: "32px" }}
              textAlign="center"
            >
              準備好開始您的旅程了嗎？
            </Text>

            <Flex justifyContent="center">
              <Box
                cursor="pointer"
                onClick={() => navigate("/login")}
                bg="#5865F2"
                color="#FFFFFF"
                borderRadius="full"
                fontSize="20px"
                padding="14px 32px"
                transition="all .2s"
                _hover={{
                  bg: "#7289DA",
                }}
              >
                開始聊天！
              </Box>
            </Flex>
          </Box>
        </GridItem>

        <GridItem
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="#23272A"
          area={"footer"}
          flexDirection="column"
          h="200px"
        >
          <Text>Peter Hsu © 2024</Text>
          <Flex my={5}>
            <Link href="https://github.com/peter2336" mr={5}>
              <Image
                h="40px"
                src="https://res.cloudinary.com/tea-talk/image/upload/v1708584713/github_upjqlg.png"
                opacity="0.7"
                _hover={{ opacity: 1 }}
                transition="all .2s"
              />
            </Link>
            <Link href="https://www.linkedin.com/in/peter-hsu-859a43276/">
              <Image
                h="40px"
                src="https://res.cloudinary.com/tea-talk/image/upload/v1708584713/linkedin_dhiaf1.png"
                opacity="0.7"
                _hover={{ opacity: 1 }}
                transition="all .2s"
              />
            </Link>
          </Flex>
          <Text>
            Web illustrations by
            <Link href="https://storyset.com/"> Storyset</Link>
          </Text>
        </GridItem>
      </Grid>
    </SimpleBar>
  );
};

export default HomePage;
