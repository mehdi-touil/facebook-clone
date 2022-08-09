import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiURL } from "../../api";
import { useAuth } from "../../App";

const initialState = {
  loading: false,
  addpostloading: false,
  deletepostloading: {},
  editpostloading: false,
  posts: [],
  error: "",
};
// fetch Posts from server
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(apiURL + "/posts", {
    headers: {
      "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
    },
  });
  return response.data;
});
// add post to server
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    // We send the initial data to the fake API server
    const response = await axios.post(apiURL + "/posts", initialPost, {
      headers: {
        "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
      },
    });
    // The response includes the complete post object, including unique ID
    return response.data;
  }
);
// edit post to server
export const editPost = createAsyncThunk(
  "posts/editPost",
  // The payload creator receives the partial `{title, content, user}` object
  async (Post) => {
    // We send the initial data to the fake API server
    const response = await axios.put(
      apiURL + "/posts/" + Post.id,
      {
        content: Post.content,
        createdDate: Date.now(),
      },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
        },
      }
    );
    // The response includes the complete post object, including unique ID
    return response.data;
  }
);
export const submitLike = createAsyncThunk(
  "posts/LikePost",
  // The payload creator receives the partial `{title, content, user}` object
  async (data) => {
    // We send the initial data to the fake API server
    const info = { userID: data.userID };
    const response = await axios.post(
      apiURL + "/posts/" + data.postID + "/like",
      info,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
        },
      }
    );
    return response.data;
  }
);
export const addNewComment = createAsyncThunk(
  "posts/CommentPost",
  // The payload creator receives the partial `{title, content, user}` object
  async (data) => {
    const response = await axios.post(
      apiURL + "/posts/" + data.postId + "/comment",
      data.comment,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
        },
      }
    );

    return response.data;
  }
);
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (PostId) => {
    // We send the initial data to the fake API server
    const response = await axios.delete(apiURL + "/posts/" + PostId, {
      headers: {
        "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
      },
    });
    // The response includes the complete post object, including unique ID
    return response.data;
  }
);
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postAdded(state, action) {
      state.posts.push(action.payload);
      state.posts.sort(function (a, b) {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
    },
    postChange(state, action) {
      var index = state.posts.findIndex((el) => el._id == action.payload._id);
      state.posts[index] = action.payload;
    },
    postDelete(state, action) {
      var index = state.posts.findIndex((el) => el._id == action.payload._id);
      state.posts.splice(index, 1);
    },
    postAuthorChange(state, action) {
      state.posts.map((post) => {
        if (post.author._id == action.payload._id) post.author = action.payload;
      });
      state.posts.map((post) => {
        post.comments.map((comment) => {
          if (comment.author._id == action.payload._id)
            comment.author = action.payload;
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload.posts;
      state.error = "";
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.posts = [];
      state.error = action.error.message;
    });
    builder.addCase(addNewPost.pending, (state, action) => {
      state.addpostloading = true;
    });
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      // We can directly add the new post object to our posts array
      state.posts.sort(function (a, b) {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });

      state.addpostloading = false;
    });
    builder.addCase(submitLike.fulfilled, (state, action) => {
      // We can directly add the new post object to our posts array
      var index = state.posts.findIndex((el) => el._id == action.payload._id);
      state.posts[index] = action.payload;
    });
    builder.addCase(addNewComment.fulfilled, (state, action) => {
      // We can directly add the new post object to our posts array
      var index = state.posts.findIndex((el) => el.id == action.payload.id);
      state.posts[index] = action.payload;
    });
    builder.addCase(deletePost.pending, (state, action) => {
      state.deletepostloading[action.meta.arg] = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      // We can directly delete the  post object from our posts array
      // state.deletepostloading[action.payload.deletedPost._id] = false;
      // var index = state.posts.findIndex((el) => el.id == action.payload._id);
      // state.posts.splice(index, 1);
      state.deletepostloading[action.payload._id] = false;
    });
    builder.addCase(editPost.pending, (state, action) => {
      state.editpostloading = true;
    });
    builder.addCase(editPost.fulfilled, (state, action) => {
      state.editpostloading = false;
      var index = state.posts.findIndex((el) => el._id == action.payload._id);
      state.posts[index] = action.payload;
    });
  },
});

export default postSlice.reducer;
export const { postAdded, postChange, postDelete, postAuthorChange } =
  postSlice.actions;
export const selectAllPosts = (state) => state.post;
export const selectPostsByAuthor = (state, userId) =>
  state.post.posts.filter((post) => post.author._id == userId);
export const deletePostLoading = (state) => state.post.deletepostloading;
export const selectPostById = (state, PostId) =>
  state.post.posts.find((post) => post._id == PostId);
