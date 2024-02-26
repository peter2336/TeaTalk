import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Smileys } from "../../emoji/EmojiData";

const EmojiMenu = ({ setNewMessage, newMessage, emojiFilter }) => {
  const [recentlyUsed, setRecentlyUsed] = useState([]);
  return (
    <Box>
      {recentlyUsed.length > 0 && (
        <Text p={1} fontSize="14px" userSelect="none">
          最近使用
        </Text>
      )}
      <Box textAlign="center">
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
      </Box>
      <Text p={1} fontSize="14px" userSelect="none">
        表情符號
      </Text>
      <Box textAlign="center">
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
            mx="auto"
            _hover={{ bg: "#394353" }}
            _light={{ _hover: { bg: "#EDF2F7" } }}
          >
            {btn.icon}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default EmojiMenu;
