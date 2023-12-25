import React from "react";

import { Avatar, Box, Text } from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import { ShieldCheck } from "lucide-react";

const ManageUserListItem = ({ user, handleFunction, selectedChat }) => {
  return (
    <Box
      bg="#313338"
      _light={{ bg: "white" }}
      w="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      transition="ease 0.1s"
      position="relative"
      className="manageUserItem"
    >
      <Avatar
        mr={2}
        size="sm"
        name={user.name}
        src={user.pic}
        userSelect="none"
      />
      <Box ml={2} userSelect="none">
        <Box display="flex" alignItems="center">
          <Text mr={1}>{user.name}</Text>
          {selectedChat.groupAdmin._id === user._id && (
            <ShieldCheck color="#00A8FC" size="18px" />
          )}
        </Box>

        <Text fontSize="xs">{user.email}</Text>
      </Box>
      <Box
        position="absolute"
        right={2}
        cursor="pointer"
        onClick={() => handleFunction(user)}
      >
        <CloseIcon
          className="cancelBtn"
          color="transparent"
          fontSize="12px"
          transition="all 0.1s"
        />
      </Box>
    </Box>
  );
};

export default ManageUserListItem;
