import { createSlice } from "@reduxjs/toolkit";
import UserData from "../../models/auth/user-data";

interface UserState {
  users: UserData[];
  pageToken?: string;
  refreshed: boolean;
  prevRole?: string;
  currentPage: number;
  loading: boolean;
  initialReqSent: boolean;
}

const initialState: UserState = {
  users: [],
  initialReqSent: false,
  refreshed: false,
  currentPage: 0,
  loading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    changeData(state, action) {
      const { users, pageToken, refreshed } = action.payload;
      state.pageToken = pageToken;
      state.refreshed = refreshed;

      if (refreshed) {
        const newUsers = (users as UserData[]).filter(
          (newUser) =>
            state.users.findIndex((user) => user.id === newUser.id) === -1
        );
        state.users = [...state.users, ...newUsers];
      } else {
        state.users = [...state.users, ...users];
      }
      state.currentPage = state.currentPage + 1;
    },
    changeRole(state, action) {
      state.prevRole = action.payload;
      state.currentPage = 0;
    },
    changeUsers(state, action) {
      state.users = action.payload;
    },
    changeCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    changeInitialRequest(state, action) {
      state.initialReqSent = action.payload;
    },
    changeLoading(state, action) {
      state.loading = action.payload;
    },
    changeUserStatus(state, action) {
      const { id, status } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === id);

      if (userIndex !== -1) {
        state.users[userIndex].status = status;
      }
    },
    changeUserBonus(state, action) {
      const { id, bonus } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === id);

      if (userIndex !== -1) {
        state.users[userIndex].bonus += bonus;
      }
    },
    emptyState(state) {
      state.users = [];
      state.pageToken = undefined;
      state.refreshed = false;
      state.prevRole = undefined;
      state.currentPage = 0;
      state.loading = false;
      state.initialReqSent = false;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
