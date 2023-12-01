import React, { useEffect, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  differentDate,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";
import { Avatar, Box, Image, Link, Text, Tooltip } from "@chakra-ui/react";
import moment from "moment";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const boxRef = useRef(null);
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  const imgRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*\.(png|jpg))/;

  const timeRegex = /\S{2}\d+\:+\d+/;

  function getDayOfWeek(day) {
    const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
    return daysOfWeek[day];
  }

  useEffect(() => {
    boxRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <Box ref={boxRef}>
      <>
        {messages &&
          messages.map((m, i) => (
            <div key={m.createdAt}>
              {differentDate(messages, m, i) && (
                <Box display="flex" justifyContent="center">
                  <Text
                    my={3}
                    userSelect="none"
                    bg="#262729"
                    color="#949494"
                    _light={{ bg: "#F8F8F8", color: "#949494" }}
                    px={2}
                    borderRadius="full"
                    fontSize="xs"
                  >{`${new Date(m.createdAt).getFullYear()}年${(
                    new Date(m.createdAt).getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}月${new Date(m.createdAt)
                    .getDate()
                    .toString()
                    .padStart(2, "0")}日(${getDayOfWeek(
                    new Date(m.createdAt).getDay()
                  )})`}</Text>
                </Box>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: isSameUser(messages, m, i, user._id) ? 5 : 25,
                  paddingRight: "4px",
                  paddingLeft: "4px",
                }}
                key={m._id}
              >
                {m.sender._id !== user._id && (
                  <Tooltip label={m.sender.name} placement="bottom" hasArrow>
                    <Avatar
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}

                {imgRegex.test(m.content) &&
                isSameSenderMargin(messages, m, i, user._id) === "auto" ? (
                  <>
                    <Text
                      fontSize="xs"
                      color="#767778"
                      userSelect="none"
                      mr={2}
                      style={{
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                      }}
                    >
                      {moment(m.createdAt)
                        .toDate()
                        .toLocaleString()
                        .match(timeRegex)}
                    </Text>
                    <Image
                      //image要加高度scrolltoview才不會出問題
                      h="200px"
                      style={{
                        maxWidth: "60%",
                      }}
                      borderRadius="15px"
                      src={m.content}
                    />
                  </>
                ) : imgRegex.test(m.content) &&
                  isSameSenderMargin(messages, m, i, user._id) === 0 ? (
                  <>
                    <Image
                      //image要加高度scrolltoview才不會出問題
                      h="200px"
                      style={{
                        maxWidth: "60%",
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                      }}
                      borderRadius="15px"
                      src={m.content}
                    />
                    <Text
                      fontSize="xs"
                      color="#767778"
                      userSelect="none"
                      ml={2}
                    >
                      {moment(m.createdAt)
                        .toDate()
                        .toLocaleString()
                        .match(timeRegex)}
                    </Text>
                  </>
                ) : urlRegex.test(m.content) &&
                  isSameSenderMargin(messages, m, i, user._id) === "auto" ? (
                  <>
                    <Text
                      fontSize="xs"
                      color="#767778"
                      userSelect="none"
                      mr={2}
                      style={{
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                      }}
                    >
                      {moment(m.createdAt)
                        .toDate()
                        .toLocaleString()
                        .match(timeRegex)}
                    </Text>
                    <Link
                      _light={{
                        bg: `${
                          m.sender._id === user._id ? "#2BED82" : "#EFEFEF"
                        }`,
                        color: "#1F5EFF",
                      }}
                      bg={`${
                        m.sender._id === user._id ? "#2BED82" : "#506362"
                      }`}
                      color={`${
                        m.sender._id === user._id ? "#1F5EFF" : "#4EACFF"
                      }`}
                      style={{
                        borderRadius: "15px",
                        padding: "5px 10px",
                        maxWidth: "60%",
                      }}
                      href={m.content}
                      target="_blank"
                      textDecoration="underline"
                    >
                      {m.content}
                    </Link>
                  </>
                ) : urlRegex.test(m.content) &&
                  isSameSenderMargin(messages, m, i, user._id) === 0 ? (
                  <>
                    <Link
                      _light={{
                        bg: `${
                          m.sender._id === user._id ? "#2BED82" : "#EFEFEF"
                        }`,
                        color: "#1F5EFF",
                      }}
                      bg={`${
                        m.sender._id === user._id ? "#2BED82" : "#506362"
                      }`}
                      color={`${
                        m.sender._id === user._id ? "#1F5EFF" : "#4EACFF"
                      }`}
                      style={{
                        borderRadius: "15px",
                        padding: "5px 10px",
                        maxWidth: "60%",
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                      }}
                      href={m.content}
                      target="_blank"
                      textDecoration="underline"
                    >
                      {m.content}
                    </Link>

                    <Text
                      fontSize="xs"
                      color="#767778"
                      userSelect="none"
                      ml={2}
                    >
                      {moment(m.createdAt)
                        .toDate()
                        .toLocaleString()
                        .match(timeRegex)}
                    </Text>
                  </>
                ) : isSameSenderMargin(messages, m, i, user._id) === "auto" ? (
                  <>
                    <Text
                      fontSize="xs"
                      color="#767778"
                      userSelect="none"
                      mr={2}
                      style={{
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                      }}
                    >
                      {moment(m.createdAt)
                        .toDate()
                        .toLocaleString()
                        .match(timeRegex)}
                    </Text>
                    <Text
                      _light={{
                        bg: `${
                          m.sender._id === user._id ? "#2BED82" : "#EFEFEF"
                        }`,
                        color: "black",
                      }}
                      bg={`${
                        m.sender._id === user._id ? "#2BED82" : "#506362"
                      }`}
                      color={`${m.sender._id === user._id ? "black" : "white"}`}
                      style={{
                        borderRadius: "15px",
                        padding: "5px 10px",
                        maxWidth: "60%",
                      }}
                    >
                      {m.content}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      _light={{
                        bg: `${
                          m.sender._id === user._id ? "#2BED82" : "#EFEFEF"
                        }`,
                        color: "black",
                      }}
                      bg={`${
                        m.sender._id === user._id ? "#2BED82" : "#506362"
                      }`}
                      color={`${m.sender._id === user._id ? "black" : "white"}`}
                      style={{
                        borderRadius: "15px",
                        padding: "5px 10px",
                        maxWidth: "60%",
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                      }}
                    >
                      {m.content}
                    </Text>

                    <Text
                      fontSize="xs"
                      color="#767778"
                      userSelect="none"
                      ml={2}
                    >
                      {moment(m.createdAt)
                        .toDate()
                        .toLocaleString()
                        .match(timeRegex)}
                    </Text>
                  </>
                )}
              </div>
            </div>
          ))}
      </>
    </Box>
  );
};

export default ScrollableChat;
