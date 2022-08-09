import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUserById } from "../../features/users/usersSlice";
const ConversationHeader = ({ userID }) => {
  const dispatch = useDispatch();
  const User = useSelector((state) => selectUserById(state, userID));
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  return (
    <div className="ConversationHeader">
      <div className="ConversationHeaderImg">
        {" "}
        <img src={User?.imageProfileURL} alt="user" />
      </div>
      <div className="ConversationHeaderText">
        <div className="UserName">{User?.fullname}</div>
        <div className="lastlogintime">active now</div>
      </div>
    </div>
  );
};

export default ConversationHeader;
