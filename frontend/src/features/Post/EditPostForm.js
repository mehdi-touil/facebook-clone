import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPost,
  editPost,
  selectAllPosts,
  selectPostById,
} from "./postSlice";
import ClipLoader from "react-spinners/ClipLoader";
const EditPostForm = ({
  setIsEditFormOpen,
  isEditFormOpen,
  scrollPosition,
  editedPostId,
}) => {
  const dispatch = useDispatch();
  const [postBody, setPostBody] = useState("");
  const submitPost = async (event) => {
    event.preventDefault();
    try {
      if (postBody) {
        await dispatch(editPost({ content: postBody, id: editedPostId }));
      }
      setIsEditFormOpen(false);
      setPostBody("");
      document.querySelector("body").style.setProperty("overflow", "scroll");
    } catch (err) {
      console.error("Failed to save the post: ", err);
    }
  };
  const editedPost = useSelector((state) =>
    selectPostById(state, editedPostId)
  );
  useEffect(() => {
    if (editedPostId) {
      setPostBody(editedPost.content);
    }
  }, [editedPostId]);

  return (
    <div
      className="createpostpage"
      style={{
        display: isEditFormOpen ? "flex" : "none",
        marginTop: scrollPosition,
      }}
    >
      <div className="createpostform">
        <h1>
          <p>Edit Post</p>{" "}
          <div className="closeicon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-8"
              fill="none"
              viewBox="0 0 25 25"
              stroke="currentColor"
              strokeWidth={2}
              onClick={() => {
                setIsEditFormOpen((prevstate) => !prevstate);
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
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt=""
              width="40px"
            />
          </div>
          <div className="userinfo">
            <div className="fullname">Mehdi Touil</div>
            <div className="publishtime"></div>
          </div>
        </div>
        <form onSubmit={submitPost}>
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
            disabled={postBody.length == 0 ? true : false}
            className={postBody.length == 0 ? "notclickable" : "clickable"}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditPostForm;
