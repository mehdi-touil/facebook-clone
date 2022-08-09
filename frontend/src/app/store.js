import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/Post/postSlice";
import usersReducer from "../features/users/usersSlice";
import conversationReducer from "../features/Conversation/conversationSlice";

export const store = configureStore({
  reducer: {
    post: postReducer,
    users: usersReducer,
    conversations: conversationReducer,
  },
});
