import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Post } from "./Post";
import {
  fetchPosts,
  postAuthorChange,
  postChange,
  postDelete,
  selectAllPosts,
  selectPostsByAuthor,
} from "./postSlice";
import ClipLoader from "react-spinners/ClipLoader";
import EditPostForm from "./EditPostForm";
import Pusher from "pusher-js";

export const PostsListByAuthor = ({ userId }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  const dispatch = useDispatch();
  const post = useSelector(selectAllPosts);
  const myposts = useSelector((state) => selectPostsByAuthor(state, userId));
  const [editedPostId, setEditedPostId] = useState(null);
  useEffect(() => {
    dispatch(fetchPosts());
    window.addEventListener("scroll", handleScroll, { passive: true });
    const pusher = new Pusher("d0fbdfbd3a54091bb50d", {
      cluster: "eu",
    });
    var channel = pusher.subscribe("posts");
    var channel_users = pusher.subscribe("users");
    channel.bind("addcomment", function (data) {
      dispatch(postChange(data.post));
    });
    channel.bind("postChange", function (data) {
      dispatch(postChange(data.post));
    });
    channel.bind("postDelete", function (data) {
      dispatch(postDelete(data.deletedPost));
    });
    channel_users.bind("edituser", function (data) {
      dispatch(postAuthorChange(data.user));
    });
    return () => {
      pusher.unsubscribe("posts");
      pusher.unsubscribe("users");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="postscontainer">
      <EditPostForm
        isEditFormOpen={isEditFormOpen}
        setIsEditFormOpen={setIsEditFormOpen}
        scrollPosition={scrollPosition}
        editedPostId={editedPostId}
      />
      {post.loading ? (
        <div className="loadingposts">
          <ClipLoader
            color="#7492b9"
            cssOverride={{
              marginTop: "30px",
            }}
            loading
            size={100}
            speedMultiplier={0.8}
          />
        </div>
      ) : (
        <div className="postscontainer">
          {myposts.map((post) => {
            return (
              <Post
                post={post}
                key={nanoid()}
                setIsEditFormOpen={setIsEditFormOpen}
                setEditedPost={setEditedPostId}
                editDelete={true}
              />
            );
          })}
        </div>
      )}
      {!post.loading && post.error && <div>{post.error}</div>}
    </div>
  );
};
