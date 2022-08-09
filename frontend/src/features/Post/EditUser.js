import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "../../App";
import { storage } from "../../firebase";
import { nanoid } from "@reduxjs/toolkit";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { editUser } from "../users/usersSlice";

const EditUser = ({ setIsUserFormOpen, isUserFormOpen }) => {
  const user = useAuth();
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [userImage, setUserImage] = useState(null);
  const [userImageStatus, setUserImageStatus] = useState(
    "No User Image Selected "
  );
  const [coverImageStatus, setCoverImageStatus] = useState(
    "No Cover Image Selected "
  );
  const [coverImage, setCoverImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const uploadimages = async () => {
    const userimageRef = ref(storage, `users/${userImage?.name + nanoid()}`);
    const coverimageRef = ref(storage, `users/${coverImage?.name + nanoid()}`);
    const userSnapshot = await uploadBytes(userimageRef, userImage);
    const coverSnapshot = await uploadBytes(coverimageRef, coverImage);
    const userImageUrl = await getDownloadURL(userSnapshot.ref);
    const coverImageUrl = await getDownloadURL(coverSnapshot.ref);
    return Promise.all([userImageUrl, coverImageUrl]);
  };
  const submitUserEdit = (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      uploadimages().then((urls) => {
        let info = {};
        if (fullName !== "") info.fullname = fullName;
        if (userImage !== null) info.imageProfileURL = urls[0];
        if (coverImage !== null) info.coverProfileURL = urls[1];

        dispatch(
          editUser({
            info,
            userId: user.id,
          })
        );
        setIsUserFormOpen(false);
        setIsLoading(false);
        document.querySelector("body").style.setProperty("overflow", "scroll");
      });
    } catch (err) {
      console.error("Failed to save the post: ", err);
    }
  };

  return (
    <div
      className="createpostpage"
      style={{ display: isUserFormOpen ? "flex" : "none" }}
    >
      {isloading ? (
        <div className="loadingmenu">
          <ClipLoader />
          <p>loading...</p>
        </div>
      ) : (
        <div className="createpostform">
          <h1>
            <p>Edit Profile</p>{" "}
            <div className="closeicon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-8"
                fill="none"
                viewBox="0 0 25 25"
                stroke="currentColor"
                strokeWidth={2}
                onClick={() => {
                  setIsUserFormOpen((prevstate) => !prevstate);
                  document
                    .querySelector("body")
                    .style.setProperty("overflow", "scroll");
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </h1>
          <div className="postheader">
            <div className="userimage">
              <img src={user.imageProfileURL} alt="" width="40px" />
            </div>
            <div className="userinfo">
              <div className="fullname">{user.fullname}</div>
              <div className="publishtime"></div>
            </div>
          </div>
          <form onSubmit={submitUserEdit}>
            <input
              type="text"
              className="inputcontainer"
              id="fullname"
              placeholder="Enter Your New Name..."
              onChange={(e) => {
                setFullName(e.target.value);
              }}
            />
            <div className="inputcontainer">
              <div className="inputstatus">{userImageStatus}</div>
              <label htmlFor="userimage">Upload</label>
              <input
                type="file"
                id="userimage"
                onChange={(event) => {
                  setUserImage(event.target.files[0]);
                  setUserImageStatus(event.target.files[0].name);
                }}
              />
            </div>
            <div className="inputcontainer">
              <div className="inputstatus">{coverImageStatus}</div>
              <label htmlFor="coverimage">Upload</label>
              <input
                type="file"
                id="coverimage"
                onChange={(event) => {
                  setCoverImage(event.target.files[0]);
                  setCoverImageStatus(event.target.files[0].name);
                }}
              />
            </div>

            <button id="edituserbtn" aria-disabled="true" className="clickable">
              <p>Submit</p>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default EditUser;
