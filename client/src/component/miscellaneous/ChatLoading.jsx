import { Stack, Skeleton } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="58px" borderRadius="lg" />
      <Skeleton height="58px" borderRadius="lg" />
      <Skeleton height="58px" borderRadius="lg" />
      <Skeleton height="58px" borderRadius="lg" />
      <Skeleton height="58px" borderRadius="lg" />
      <Skeleton height="58px" borderRadius="lg" />
      <Skeleton height="58px" borderRadius="lg" />
    </Stack>
  );
};

export default ChatLoading;
