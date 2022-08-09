import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import {
  submitLike,
  addNewComment,
  deletePost,
  selectAllPosts,
  deletePostLoading,
} from "./postSlice";
import { useSelector, useDispatch } from "react-redux";
import ClockLoader from "react-spinners/ClockLoader";
import { useAuth } from "../../App";
export function Post({ post, setIsEditFormOpen, setEditedPost, editDelete }) {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const deleteLoading = useSelector(deletePostLoading);
  const user = useAuth();
  useEffect(() => {
    var input = inputRef.current;
    input.addEventListener("keypress", async function (event) {
      if (event.key == "Enter") {
        await dispatch(
          addNewComment({
            postId: post.id,
            comment: {
              author: user.id,
              content: event.target.value,
            },
          })
        );
      }
    });
  }, []);
  return (
    <div className="postcontainer">
      <div className="postheader">
        <div className="userimage">
          <img src={post.author.imageProfileURL} alt="" width="40px" />
        </div>
        <div className="userinfo">
          <div className="fullname">{post.author.fullname}</div>
          <div className="publishtime">
            <ReactTimeAgo date={Date.parse(post.createdDate)} locale="en-US" />
          </div>
          {editDelete && post.author.id == user.id && (
            <div className="threedots delete">
              {deleteLoading[post.id] ? (
                <ClockLoader size={20} />
              ) : (
                <img
                  onClick={() => {
                    dispatch(deletePost(post.id));
                  }}
                  src="https://img.icons8.com/color/48/000000/delete-forever.png"
                />
              )}
            </div>
          )}
          {editDelete && post.author.id == user.id && (
            <img
              onClick={() => {
                setIsEditFormOpen(true);
                document
                  .querySelector("body")
                  .style.setProperty("overflow", "hidden");
                setEditedPost(post.id);
              }}
              className="threedots edit"
              src="https://img.icons8.com/external-febrian-hidayat-flat-febrian-hidayat/64/000000/external-Edit-user-interface-febrian-hidayat-flat-febrian-hidayat.png"
            />
          )}
        </div>
      </div>
      <div className="postbody">{post.content}</div>
      {post.imageUrl == undefined ? null : (
        <div className="postImage">
          <img src={post.imageUrl} loading="lazy" />{" "}
        </div>
      )}
      <div className="postfooter">
        <div className="poststatistics">
          <div className="likecount">
            <img
              src="https://w7.pngwing.com/pngs/886/3/png-transparent-white-and-blue-like-icon-facebook-like-button-computer-icons-thumb-signal-thumbs-up-blue-text-hand.png"
              alt=""
              width="20px"
            />
            <span>{post.likecount}</span>
          </div>
          <div className="commentcount">{post.commentcount} comments</div>
          <div className="sharecount">{post.sharecount} shares</div>
        </div>
        <div className="like-share-comment">
          <div
            className="like"
            onClick={() => {
              dispatch(submitLike({ postID: post.id, userID: user.id }));
            }}
          >
            <div
              className={
                post.likes.find((x) => x.user == user.id) == undefined
                  ? "likeicon"
                  : "likeicon liked"
              }
            ></div>
            <div className="icontext">Like</div>
          </div>
          <div className="comment">
            <div className="commenticon"></div>
            <div className="icontext">Comment</div>
          </div>
          <div className="share">
            <div className="icon"></div>
            <div className="icontext">Share</div>
          </div>
        </div>
        <div className="commentscontainer">
          <span className="commentstitle">Comments</span>
          {post.comments.map((comment) => {
            return (
              <div className="commentcontainer" key={nanoid()}>
                <div className="commenterimage">
                  <img
                    src={comment.author.imageProfileURL}
                    alt=""
                    width="40px"
                  />
                </div>
                <div className="commenttext">
                  <div className="commentername">{comment.author.fullname}</div>
                  <div className="commentercontent">{comment.content}</div>
                </div>
              </div>
            );
          })}

          {/* for new comment */}
          <div className="commentcontainer">
            <div className="commenterimage">
              <img src={user.imageProfileURL} alt="" width="40px" />
            </div>
            <div className="commentinputwrapper">
              {" "}
              <input
                type="text"
                className="commentinput"
                placeholder="Write a comment ..."
                ref={inputRef}
              />
              <span>Press Enter to submit post</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
