import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../component/authentication/Login";
import Singup from "../component/authentication/Singup";
import {
  Container,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  ScaleFade,
} from "@chakra-ui/react";

const HomePage = () => {
  const navigate = useNavigate();
  const { onOpen } = useDisclosure();
  const [user, setUser] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    if (user) {
      navigate("/chat");
    }
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Container maxW="md" centerContent justifyContent="center">
      <Box bg="#313338" w="100%" p={4} borderRadius="lg">
        <Tabs variant="unstyled">
          <ScaleFade in={onOpen}>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>

              <TabPanel>
                <Singup />
              </TabPanel>
            </TabPanels>
          </ScaleFade>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
