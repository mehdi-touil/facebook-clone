import React from "react";
import { Link } from "react-router-dom";

const UserItem = ({ user }) => {
  return (
    <div className="invitationcard">
      {" "}
      <div className="invitationimage">
        <img src={user?.imageProfileURL} alt="" />
      </div>
      <div className="userName">{user.fullname}</div>
      <div className="invitationbody">
        <Link to={`/profile/${user.id}`}>Go to Profile </Link>
      </div>
    </div>
  );
};

export default UserItem;
