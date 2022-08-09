import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, selectAllPosts } from "./postSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "../../App";
import { storage } from "../../firebase";
import { nanoid } from "@reduxjs/toolkit";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
const CreatePostForm = ({ setIsPostFormOpen, isPostFormOpen }) => {
  const user = useAuth();
  var isloading = useSelector(selectAllPosts).addpostloading;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [postBody, setPostBody] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageStatus, setImageStatus] = useState("No Selected Image");
  const uploadimage = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + nanoid()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };
  const submitPost = (event) => {
    event.preventDefault();
    try {
      if (postBody) {
        setIsLoading(true);
        uploadimage().then((url) => {
          dispatch(
            addNewPost({ content: postBody, author: user.id, imageUrl: url })
          );
          setIsLoading(false);
          setIsPostFormOpen(false);
        });
        setPostBody("");
        document.querySelector("body").style.setProperty("overflow", "scroll");
      }
    } catch (err) {
      console.error("Failed to save the post: ", err);
    }
  };

  return (
    <div
      className="createpostpage"
      style={{ display: isPostFormOpen ? "flex" : "none" }}
    >
      {isloading || isLoading ? (
        <div className="loadingmenu">
          <ClipLoader />
          <p>loading...</p>
        </div>
      ) : (
        <div className="createpostform">
          <h1>
            <p>Create Post</p>{" "}
            <div className="closeicon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-8"
                fill="none"
                viewBox="0 0 25 25"
                stroke="currentColor"
                strokeWidth={2}
                onClick={() => {
                  setIsPostFormOpen((prevstate) => !prevstate);
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

          {/*Header user image + user name  */}
          <div className="postheader">
            <div className="userimage">
              <img src={user.imageProfileURL} alt="" width="40px" />
            </div>
            <div className="userinfo">
              <div className="fullname">{user.fullname}</div>
              <div className="publishtime"></div>
            </div>
          </div>
          <form onSubmit={submitPost}>
            <div className="inputcontainer">
              <div className="inputstatus">{imageStatus}</div>
              <label htmlFor="image">Upload</label>
            </div>
            <input
              type="file"
              name="image"
              id="image"
              onChange={(event) => {
                setImageStatus(event.target.files[0].name);
                setImageUpload(event.target.files[0]);
              }}
            />
            <textarea
              name="postbody"
              id="postbody"
              placeholder="What's on your mind ?"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              autoFocus
            ></textarea>
            <button
              id="postbtn"
              aria-disabled="true"
              className={postBody.length == 0 ? "notclickable" : "clickable"}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default CreatePostForm;
