import React from "react";

import { Avatar, Box, Text } from "@chakra-ui/react";
import { CheckCircle2, Circle } from "lucide-react";

const GroupUserListItem = ({
  user,
  handleFunction,
  selectedUsers,
  existUser,
}) => {
  const selectedUser = selectedUsers?.find((u) => u._id === user._id);
  const disableUser = existUser?.find((u) => u._id === user._id);

  return (
    <Box
      onClick={disableUser ? () => {} : handleFunction}
      cursor="pointer"
      bg="#313338"
      _light={{ bg: "white" }}
      _hover={{
        bg: "#404249",
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
      opacity={disableUser ? "20%" : "100%"}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box ml={2}>
        <Text>{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
      <Box position="absolute" right={2}>
        {selectedUser ? (
          <CheckCircle2 color="#06C755" />
        ) : (
          <Circle color="#9F9F9F" />
        )}
      </Box>
    </Box>
  );
};

export default GroupUserListItem;
