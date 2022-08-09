import React from "react";
import TimeRow from "./TimeRow";

const ConversationRow = ({ type, conversation }) => {
  return (
    <div>
      <TimeRow date={conversation.createdDate} />
      <div className="conversationContainer">
        <div className={`conversationText ${type}`}>
          {conversation.content}{" "}
        </div>
      </div>
    </div>
  );
};

export default ConversationRow;
