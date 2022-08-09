import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const UserCard = ({ user }) => {
  return (
    <NavLink
      to={`/messages/${user._id}`}
      className={({ isActive }) =>
        isActive ? "UserCardContainer activeuser" : "UserCardContainer"
      }
    >
      <div className="userImg">
        <img src={user?.imageProfileURL} alt="" width="50px" />
        <div></div>
      </div>
      <div className="username">{user?.fullname}</div>
    </NavLink>
  );
};

export default UserCard;
