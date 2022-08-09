import { nanoid } from "@reduxjs/toolkit";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../App";
import {
  fetchInvitations,
  fetchUsers,
  selectAllUsers,
  userChange,
} from "../features/users/usersSlice";
import InvitationCard from "./InvitationCard";
import "./Invitations.css";
import UserItem from "./UserItem";
const Invitations = () => {
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();
  const _user = useAuth();
  const [user, setUser] = useState(_user);
  useEffect(() => {
    setUser(_user);
  }, [_user]);
  useEffect(() => {
    dispatch(fetchInvitations(user?.id));
    dispatch(fetchUsers());
  }, [user]);
  useEffect(() => {
    const pusher = new Pusher("d0fbdfbd3a54091bb50d", {
      cluster: "eu",
    });
    var channel = pusher.subscribe("invitations");
    channel.bind("confirmInvitation", function (data) {
      dispatch(userChange(data.user));
      dispatch(userChange(data.user_me));
      setUser(data.user_me);
    });
    channel.bind("cancelInvitation", function (data) {
      dispatch(userChange(data.user_me));
      setUser(data.user_me);
    });
    channel.bind("sendInvitation", function (data) {
      if (user && (data.user._id = user?._id)) {
        setUser(data.user);
      }
    });
    var channel_users = pusher.subscribe("users");

    channel_users.bind("edituser", function (data) {
      dispatch(userChange(data.user));
    });

    return () => {
      pusher.unsubscribe("users");
      pusher.unsubscribe("posts");
    };
  }, [user]);
  return (
    <div className="invitationspage">
      <h1>Invitations</h1>
      {users.invitations.length == 0 ? (
        <div className="noinvitation">No invitation</div>
      ) : (
        ""
      )}
      <div className="invitationscontainer">
        {users.invitations.map((inv) => (
          <InvitationCard invitation={inv} key={nanoid()} />
        ))}
      </div>
      <h1>Users</h1>

      <div className="invitationscontainer">
        {users.users.map((user) =>
          user.friends.some(
            (x) => x.user == _user.id || x.user._id == _user.id
          ) || user.id == _user.id ? (
            ""
          ) : (
            <UserItem user={user} key={nanoid()} />
          )
        )}
      </div>
    </div>
  );
};

export default Invitations;
