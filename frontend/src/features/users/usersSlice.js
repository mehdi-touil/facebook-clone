import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiURL } from "../../api";
import { useAuth } from "../../App";
const initialState = { users: [], loading: false, invitations: [] };
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(apiURL + "/users", {
    headers: {
      "x-auth-token": localStorage.getItem("token"), //the token is a variable which holds the token
    },
  });
  return response.data;
});
export const fetchInvitations = createAsyncThunk(
  "users/fetchInvitations",
  async (userId) => {
    const response = await axios.get(apiURL + "/users/invitations/" + userId);
    return response.data;
  }
);
export const UserInvitation = createAsyncThunk(
  "users/userInvitation",
  async (user) => {
    const response = await axios.post(
      apiURL + "/users/invitations/" + user.to,
      { userId: user.from }
    );
    return response.data;
  }
);
export const confirmInvitation = createAsyncThunk(
  "users/confirmInvitation",
  async (data) => {
    const response = await axios.post(
      apiURL + "/users/InvitationConfirmation/" + data.user,
      { userId: data.me_user }
    );
    return response.data;
  }
);
export const cancelInvitation = createAsyncThunk(
  "users/cancelInvitation",
  async (data) => {
    const response = await axios.post(
      apiURL + "/users/InvitationCancel/" + data.user,
      { userId: data.me_user }
    );
    return response.data;
  }
);
export const editUser = createAsyncThunk("users/editUser", async (data) => {
  const response = await axios.put(apiURL + "/users/" + data.userId, data.info);
  return response.data;
});
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userChange(state, action) {
      var index = state.users.findIndex((el) => el._id == action.payload._id);
      state.users[index] = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchInvitations.fulfilled, (state, action) => {
      state.invitations = action.payload;
    });
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(UserInvitation.fulfilled, (state, action) => {
      var index = state.users.findIndex((el) => el._id == action.payload._id);
      state.users[index] = action.payload;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(cancelInvitation.fulfilled, (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});
export const { userChange } = usersSlice.actions;
export default usersSlice.reducer;
export const selectAllUsers = (state) => state.users;
export const selectUserById = (state, userID) =>
  state.users.users.find((user) => user._id == userID);
export const getLoading = (state) => state.users.loading;
