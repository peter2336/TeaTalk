import {
  Avatar,
  Box,
  IconButton,
  Input,
  InputGroup,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { isToday } from "../../config/ChatLogic";
import moment from "moment";

const SearchChatHistory = ({ messages, boxRef }) => {
  const [search, setSearch] = useState("");

  const reversedMessages = messages
    .map((m) => ({
      chat: m.chat,
      content: m.content,
      createdAt: m.createdAt,
      sender: m.sender,
      _id: m._id,
    }))
    .reverse();

  const timeRegex = /\S{2}\d+\:+\d+/;
  const dateRegex = /\d+\/\d+\/\d+/;

  const scrollToSearch = (m) => {
    const element = boxRef.current.querySelector(`#message-${m._id}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  return (
    <>
      <Popover placement="bottom-end" onClose={() => setSearch("")}>
        <Tooltip label="搜尋訊息" hasArrow placement="bottom">
          <Box>
            <PopoverTrigger>
              <IconButton
                display={{ base: "flex" }}
                icon={<Search size="20px" />}
                onFocus={(e) => e.preventDefault()}
                variant="unstyled"
                _hover={{ color: "#a1a1aa" }}
                h="20px"
              />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent _dark={{ bg: "#313338" }}>
          <PopoverHeader>
            <InputGroup>
              <Input
                type="search"
                placeholder="搜尋訊息"
                variant="unstyled"
                h="40px"
                bg="#3B3C42"
                _light={{ bg: "#E7E7E9", opacity: "60%" }}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                p={3}
              />
            </InputGroup>
          </PopoverHeader>
          <PopoverBody pr={1}>
            <Text fontSize="14px" userSelect="none">
              搜尋結果
            </Text>
            <Box
              className="chatLog"
              _light={{
                bgGradient: "linear(#FFFFFF, #FFFFFF)",
                _hover: { backgroundColor: "#B7B7B7" },
              }}
              overflowY="scroll"
              maxH="290px"
              mt={1}
              ml="0px"
              px={1}
              py={1}
            >
              {messages &&
                search &&
                reversedMessages.map((m, i) => (
                  <Box
                    id={`message-${m._id}`}
                    key={m._id}
                    display={m.content.includes(search) ? "flex" : "none"}
                    alignItems="center"
                    onClick={() => scrollToSearch(m, i)}
                    cursor="pointer"
                    _hover={{ bg: "#404249" }}
                    _light={{ _hover: { bg: "#EDF2F7" } }}
                    transition="all 0.1s"
                    borderRadius="lg"
                    py={2}
                    px={3}
                    position="relative"
                  >
                    <Avatar
                      mr={2}
                      size="sm"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                    <Box>
                      <Text>{m.sender.name}</Text>
                      <Text fontSize="xs" color="#949494">
                        {m.content.length > 28
                          ? m.content.substring(0, 37) + "..."
                          : m.content}
                      </Text>
                    </Box>
                    <Box position="absolute" right={3} top={2}>
                      {isToday(new Date(), new Date(m.createdAt)) ? (
                        <Text fontSize="xs" color="#949494">
                          {moment(m.createdAt)
                            .toDate()
                            .toLocaleString()
                            .match(timeRegex)}
                        </Text>
                      ) : (
                        <Text fontSize="xs" color="#949494">
                          {moment(m.createdAt)
                            .toDate()
                            .toLocaleString()
                            .match(dateRegex)}
                        </Text>
                      )}
                    </Box>
                  </Box>
                ))}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SearchChatHistory;
