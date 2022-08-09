import React from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../App";
import {
  cancelInvitation,
  confirmInvitation,
} from "../features/users/usersSlice";

const InvitationCard = ({ invitation }) => {
  const user = useAuth();
  const dispatch = useDispatch();
  return (
    <div className="invitationcard">
      <div className="invitationimage">
        <img src={invitation?.user?.imageProfileURL} alt="" />
      </div>
      <div className="userName">{invitation.user.fullname}</div>
      <div className="invitationbody">
        <button
          onClick={() => {
            dispatch(
              confirmInvitation({ me_user: user.id, user: invitation.user._id })
            );
          }}
        >
          confirm
        </button>
        <button
          onClick={() => {
            dispatch(
              cancelInvitation({ me_user: user.id, user: invitation.user._id })
            );
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default InvitationCard;
