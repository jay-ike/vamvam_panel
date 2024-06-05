import { createSlice } from "@reduxjs/toolkit";
import NotificationData from "../../models/common/notification";

interface NotificationState {
  notifications: NotificationData[];
  newNotification: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  newNotification: false,
};

const notificationSlice = createSlice({
  name: "notificatitons",
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      state.newNotification = true;
    },
    readNotifications(state) {
      state.newNotification = false;
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
