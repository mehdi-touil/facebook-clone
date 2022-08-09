import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../App";
import { fetchUsers, selectUserById } from "../features/users/usersSlice";
import ConversationBody from "./conversation/ConversationBody";
import ConversationHeader from "./conversation/ConversationHeader";
import ConversationInput from "./conversation/ConversationInput";
import "./Messages.css";
import UserCard from "./UserCard";

const MessagesHome = () => {
  const dispatch = useDispatch();
  const userInfo = useAuth();
  const user = useSelector((state) => selectUserById(state, userInfo.id));
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  useEffect(() => {
    if (user && user?.friends) {
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
      <div className="messagesBoard"></div>
    </div>
  );
};

export default MessagesHome;
