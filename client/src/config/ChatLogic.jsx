export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderPic = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id || //下一則訊息是不同人發的或是
      messages[i + 1].sender._id === undefined) && //沒有下一則訊息=最後一則訊息
    messages[i].sender._id !== userId //且訊息不是我發的
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 && //最後一則訊息
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isFirstMessage = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id || //下一則訊息是不同人發的或是
      messages[i + 1].sender._id === undefined) && //沒有下一則訊息=最後一則訊息
    messages[i].sender._id !== userId //且訊息不是我發的
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 0;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id && //下一個訊息是不同人發的
      messages[i].sender._id !== userId) || //當前訊息不是我發的
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

//判斷同個sender訊息 以用來增加之間的距離
export const isSameUser = (messages, m, i) => {
  return (i > 0 && messages[i - 1].sender._id === m.sender._id) || i === 0; //上一個訊息與當前訊息是同個人發的
};

export const differentDate = (messages, m, i) => {
  return (
    (i > 1 &&
      new Date(m.createdAt).toDateString() !==
        new Date(messages[i - 1].createdAt).toDateString()) ||
    i === 0 ||
    new Date(m.createdAt).toDateString() !==
      new Date(messages[i - 1].createdAt).toDateString()
  ); //上一個訊息與當前訊息日期不同
};

export const isToday = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
