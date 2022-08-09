import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "../App";
import { PostsListByAuthor } from "../features/Post/PostListByAuthor";
import BeatLoader from "react-spinners/BeatLoader";
import {
  fetchUsers,
  getLoading,
  selectUserById,
  userChange,
  UserInvitation,
} from "../features/users/usersSlice";

import "./Profile.css";
import InvitationStatus from "./_components/InvitationStatus";
import Pusher from "pusher-js";
import EditUser from "../features/Post/EditUser";
const Profile = () => {
  const dispatch = useDispatch();
  let { userId } = useParams();
  const Me_user = useAuth();
  if (userId == undefined) {
    userId = Me_user.id;
  }
  const user = useSelector((state) => selectUserById(state, userId));
  const me_user = useSelector((state) => selectUserById(state, Me_user.id));
  const loading = useSelector(getLoading);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchUsers());
    const pusher = new Pusher("d0fbdfbd3a54091bb50d", {
      cluster: "eu",
    });
    var channel = pusher.subscribe("invitations");
    var channel_users = pusher.subscribe("users");
    channel.bind("confirmInvitation", function (data) {
      dispatch(userChange(data.user));
      dispatch(userChange(data.user_me));
    });
    channel.bind("cancelInvitation", function (data) {
      dispatch(userChange(data.user_me));
    });
    channel.bind("sendInvitation", function (data) {
      dispatch(userChange(data.user));
    });
    channel_users.bind("edituser", function (data) {
      dispatch(userChange(data.user));
    });
    return () => {
      pusher.unsubscribe("posts");
      pusher.unsubscribe("users");
    };
  }, []);
  return loading ? (
    <BeatLoader />
  ) : (
    <div className="profilecontainer">
      <EditUser
        isUserFormOpen={isUserFormOpen}
        setIsUserFormOpen={setIsUserFormOpen}
      />
      <div className="profileheader">
        <div className="coverImage">
          <img
            src={
              user?.coverProfileURL ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShm8st2nmCoJgrAMWxkNoIdomnKZBZYRQeAevccyD49nfYzo1kL4899sukCWUEdAZMOO8&usqp=CAU"
            }
            alt="coverImage"
          />
        </div>
        <div className="userOverview">
          <div className="profileimage">
            <img src={user?.imageProfileURL} alt="userimage" />
          </div>
          <div className="userOverviewText">
            <span className="username">{user?.fullname}</span>
            <span className="friendscount">
              {user?.friends?.length} friends
            </span>
          </div>
          <InvitationStatus
            me_user={me_user}
            user={user}
            setIsUserFormOpen={setIsUserFormOpen}
          />
        </div>
      </div>
      <div id="mypoststitle"> Posts</div>
      <PostsListByAuthor userId={user?.id} />
    </div>
  );
};
export default Profile;
