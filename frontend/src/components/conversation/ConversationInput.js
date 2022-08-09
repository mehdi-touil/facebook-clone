import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "../../App";
import { addConversation } from "../../features/Conversation/conversationSlice";

const ConversationInput = () => {
  const dispatch = useDispatch();
  const [content, setcontent] = useState("");
  let { receiverID } = useParams();
  const senderID = useAuth().id;
  const submitConversation = () => {
    dispatch(addConversation({ content, receiverID, senderID }));
    setcontent("");
  };
  return (
    <div className="ConversationInput">
      <div className="input">
        <input
          type="text"
          placeholder="Aa"
          value={content}
          onChange={(e) => setcontent(e.target.value)}
        />
      </div>
      <div className="send" onClick={submitConversation}>
        <img
          src="https://flyclipart.com/thumbs/file-svg-send-message-icon-1611672.png"
          alt="input"
          width="30px"
        />
      </div>
    </div>
  );
};

export default ConversationInput;
