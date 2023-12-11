import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../component/miscellaneous/SideDrawer";
import MyChat from "../component/miscellaneous/MyChat";
import ChatBox from "../component/miscellaneous/ChatBox";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { user, setUser } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    if (!user) navigate("/login");
  }, [navigate, fetchAgain]);

  return (
    <>
      {!user && <div>請先登入</div>}
      <div style={{ width: "100%", height: "100dvh" }}>
        <Box display="flex" w="100%" h="100%">
          {user && (
            <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
          {user && <MyChat fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;
