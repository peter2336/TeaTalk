import React from "react";

import { Avatar, Box, Text } from "@chakra-ui/react";
import { UserPlus } from "lucide-react";

const UserListItem = ({ user, handleFunction }) => {
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
        <UserPlus size="20px" />
      </Box>
    </Box>
  );
};

export default UserListItem;
