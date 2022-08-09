import React from "react";
import { useDispatch } from "react-redux";
import {
  cancelInvitation,
  confirmInvitation,
  UserInvitation,
} from "../../features/users/usersSlice";
const InvitationStatus = ({ me_user, user, setIsUserFormOpen }) => {
  const dispatch = useDispatch();
  if (user?.id == me_user?.id)
    return (
      <button
        onClick={() => {
          setIsUserFormOpen(true);
          document
            .querySelector("body")
            .style.setProperty("overflow", "hidden");
          window.scrollTo(0, 0);
        }}
      >
        Edit Profile
      </button>
    );
  else if (
    me_user?.invitations.some(
      (x) => x.user._id == user?.id || x.user == user?.id
    )
  ) {
    return (
      <div className="profilestatus">
        <button
          onClick={() => {
            dispatch(
              confirmInvitation({ me_user: me_user.id, user: user._id })
            );
          }}
        >
          confirm
        </button>{" "}
        <button
          onClick={() => {
            dispatch(cancelInvitation({ me_user: me_user.id, user: user._id }));
          }}
        >
          Cancel
        </button>
      </div>
    );
  } else if (
    user?.invitations.some(
      (x) => x.user._id == me_user?.id || x.user == me_user?.id
    )
  ) {
    return <button>invitation sent!</button>;
  } else if (
    user?.friends.some(
      (x) => x.user == me_user?.id || x.user._id == me_user?.id
    )
  ) {
    return (
      <button className="btn">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Font_Awesome_5_solid_user-friends.svg/512px-Font_Awesome_5_solid_user-friends.svg.png?20180810222633"
          alt=""
          width="30px"
        />
        friends
      </button>
    );
  } else {
    return (
      <button
        onClick={() => {
          dispatch(UserInvitation({ from: me_user.id, to: user.id }));
        }}
      >
        Invite{" "}
      </button>
    );
  }
};

export default InvitationStatus;
