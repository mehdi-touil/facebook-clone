import { nanoid } from "@reduxjs/toolkit";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "../App";
import {
  fetchUsers,
  selectUserById,
  userChange,
} from "../features/users/usersSlice";
import ConversationBody from "./conversation/ConversationBody";
import ConversationHeader from "./conversation/ConversationHeader";
import ConversationInput from "./conversation/ConversationInput";
import "./Messages.css";

import UserCard from "./UserCard";
const Messages = () => {
  const dispatch = useDispatch();
  const userInfo = useAuth();
  const user = useSelector((state) => selectUserById(state, userInfo.id));
  const [friends, setFriends] = useState([]);
  let { receiverID } = useParams();
  useEffect(() => {
    dispatch(fetchUsers());
    const pusher = new Pusher("d0fbdfbd3a54091bb50d", {
      cluster: "eu",
    });
    var channel_users = pusher.subscribe("users");
    channel_users.bind("edituser", function (data) {
      dispatch(userChange(data.user));
    });
    return () => {
      pusher.unsubscribe("users");
    };
  }, []);

  useEffect(() => {
    if (user && user.friends) {
      setFriends(
        user?.friends.map((friend) => {
          return <UserCard user={friend.user} key={nanoid()} />;
        })
      );
    }
  }, [user]);

  return (
    <div className="messagesparent">
      <div className="usersPanel">
        <h3>Chats</h3>
        {friends}
      </div>
      <div className="messagesBoard">
        <ConversationHeader userID={receiverID} />
        <ConversationBody />
        <ConversationInput />
      </div>
    </div>
  );
};

export default Messages;
