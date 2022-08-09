import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiURL } from "../../api";

const initialState = {
  loading: false,
  conversations: [],
  error: "",
};
// fetch Posts from server
export const fetchConversations = createAsyncThunk(
  "Conversation/getConversations",
  async (data) => {
    const response = await axios.post(apiURL + "/conversations", data, {
      headers: {
        "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
      },
    });
    return response.data;
  }
);
//add conversation
export const addConversation = createAsyncThunk(
  "Conversation/addConversation",
  async (Conversation) => {
    const response = await axios.post(
      apiURL + "/conversations/newconversation",
      Conversation,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
        },
      }
    );
    return response.data;
  }
);
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    conversationAdded(state, action) {
      state.conversations.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
      state.error = "";
    });
    builder.addCase(addConversation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addConversation.fulfilled, (state, action) => {
      state.loading = false;
      //   state.conversations.push(action.payload);
      state.error = "";
    });
  },
});

export default conversationSlice.reducer;
export const { conversationAdded } = conversationSlice.actions;
export const selectAllConversations = (state) =>
  state.conversations.conversations;
