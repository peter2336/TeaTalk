import { Box, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Smileys } from "../../emoji/EmojiData";

const EmojiMenu = ({ setNewMessage, newMessage, emojiFilter }) => {
  const [recentlyUsed, setRecentlyUsed] = useState([]);
  return (
    <Box h="270px">
      {recentlyUsed.length > 0 && (
        <Text fontSize="14px" userSelect="none">
          最近使用
        </Text>
      )}
      {recentlyUsed?.map((btn) => {
        return (
          <Button
            key={btn.name}
            p={1}
            fontSize="24px"
            onClick={() => {
              setNewMessage(`${newMessage}${btn.icon}`);
            }}
            colorScheme="none"
            m="0.5px"
            _hover={{ bg: "#394353" }}
            _light={{ _hover: { bg: "#EDF2F7" } }}
          >
            {btn.icon}
          </Button>
        );
      })}
      <Text fontSize="14px" userSelect="none">
        表情符號
      </Text>
      {Smileys.map((btn) => (
        <Button
          display={
            btn.name.includes(emojiFilter) ||
            btn.name.toLowerCase().includes(emojiFilter) ||
            btn.name.toUpperCase().includes(emojiFilter)
              ? "inline-block"
              : "none"
          }
          key={btn.name}
          p={1}
          fontSize="24px"
          onClick={() => {
            setNewMessage(`${newMessage}${btn.icon}`);
            if (recentlyUsed.includes(btn)) return;
            setRecentlyUsed([...recentlyUsed, btn]);
          }}
          colorScheme="none"
          m="0.5px"
          _hover={{ bg: "#394353" }}
          _light={{ _hover: { bg: "#EDF2F7" } }}
        >
          {btn.icon}
        </Button>
      ))}
    </Box>
  );
};

export default EmojiMenu;
