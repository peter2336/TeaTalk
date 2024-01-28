import React from "react";

import { Avatar, Box, Spinner, Text } from "@chakra-ui/react";
import { UserCheck, UserPlus } from "lucide-react";
import { ChatState } from "../../context/ChatProvider";

const UserListItem = ({ user, handleFunction, loadingChat, selectedUser }) => {
  const { chat } = ChatState();

  const userCheck = chat
    .flatMap((c) => c.users)
    .flatMap((u) => u._id)
    .includes(user._id);

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#313338"
      _light={{ bg: "white" }}
      _hover={{
        bg: "#3F3F46",
        _light: { _hover: { bg: "#EDF2F7" } },
      }}
      w="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      transition="ease 0.1s"
      position="relative"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        userSelect="none"
      />
      <Box ml={2} userSelect="none">
        <Text>{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
      <Box p={1} position="absolute" right={1}>
        {loadingChat && selectedUser?._id === user._id ? (
          <Spinner size="md" display="flex" />
        ) : userCheck ? (
          <UserCheck size="20px" color="#06C755" />
        ) : (
          <UserPlus size="20px" color="#9F9F9F" />
        )}
      </Box>
    </Box>
  );
};

export default UserListItem;
