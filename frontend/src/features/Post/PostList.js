import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CreatePostForm from "./CreatePostForm";
import { Post } from "./Post";
import {
  postChange,
  fetchPosts,
  postAdded,
  selectAllPosts,
  postDelete,
  postAuthorChange,
} from "./postSlice";
import ClipLoader from "react-spinners/ClipLoader";
import Pusher from "pusher-js";
export const PostsList = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const dispatch = useDispatch();
  const post = useSelector(selectAllPosts);
  useEffect(() => {
    dispatch(fetchPosts());
    const pusher = new Pusher("d0fbdfbd3a54091bb50d", {
      cluster: "eu",
    });
    var channel = pusher.subscribe("posts");
    var channel_users = pusher.subscribe("users");

    channel.bind("addpost", function (data) {
      dispatch(postAdded(data.post));
    });
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
    };
  }, []);

  return (
    <div className="postscontainer">
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
        <div
          className="postscontainer"
          style={{
            height: isPostFormOpen ? "calc(100vh - 60px)" : "",
            overflow: isPostFormOpen ? "hidden" : "",
          }}
        >
          <div className="createpost">
            <div
              className="createpost-row"
              onClick={() => {
                setIsPostFormOpen((prevstate) => !prevstate);
                document
                  .querySelector("body")
                  .style.setProperty("overflow", "hidden");
                window.scrollTo(0, 0);
              }}
            >
              <img
                src="https://scontent.frba3-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?stp=cp0_dst-png_p40x40&_nc_cat=1&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Xui_C6PlBu4AX_OgxNr&_nc_ht=scontent.frba3-1.fna&oh=00_AT-WMarS4lEHKLbFJFwqQ3kaSySe_njsggVUqulcsaW3xQ&oe=6305CB78"
                alt=""
              />
              <p>What's On your mind ?" </p>
            </div>
            <div className="createpost-row">
              <div>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/005/260/819/non_2x/live-icon-live-stream-video-news-symbol-free-vector.jpg"
                  alt=""
                  width="40px"
                />
                <span>Live</span>
              </div>
              <div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm_0cWe3MXD2v1x9JXjqCHXM600_ENsbmIsA&usqp=CAU"
                  alt=""
                  width="40px"
                />
                <span>Photo/video</span>
              </div>
            </div>
            <CreatePostForm
              setIsPostFormOpen={setIsPostFormOpen}
              isPostFormOpen={isPostFormOpen}
            />
          </div>
          {post.posts.map((post) => {
            return <Post post={post} key={nanoid()} editDelete={false} />;
          })}
        </div>
      )}
      {!post.loading && post.error && <div>{post.error}</div>}
    </div>
  );
};
