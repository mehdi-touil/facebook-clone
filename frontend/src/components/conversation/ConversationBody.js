import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "../../App";
import {
  conversationAdded,
  fetchConversations,
  selectAllConversations,
} from "../../features/Conversation/conversationSlice";
import ConversationRow from "./ConversationRow";
import Pusher from "pusher-js";
const ConversationBody = () => {
  const conversations = useSelector(selectAllConversations);
  const dispatch = useDispatch();
  const user = useAuth();
  let { receiverID } = useParams();
  useEffect(() => {
    dispatch(
      fetchConversations({ senderID: user._id, receiverID: receiverID })
    );
    const pusher = new Pusher("d0fbdfbd3a54091bb50d", {
      cluster: "eu",
    });
    var channel = pusher.subscribe("conversations");
    channel.bind("addconversation", function (data) {
      dispatch(conversationAdded(data.conversation));
    });
    return () => {
      pusher.unsubscribe("conversations");
    };
  }, [user, receiverID]);
  return (
    <div className="ConversationBody">
      {conversations?.map((conversation) => {
        console.log(conversation.senderID, "->", receiverID);
        return conversation.senderID._id != receiverID ? (
          <ConversationRow
            type={"right"}
            conversation={conversation}
            key={nanoid()}
          />
        ) : (
          <ConversationRow
            type={"left"}
            conversation={conversation}
            key={nanoid()}
          />
        );
      })}
    </div>
  );
};

export default ConversationBody;
