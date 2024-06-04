import { createSlice } from "@reduxjs/toolkit";
import ConflictDeliveryData from "../../models/deliveries/conflictdelivery";

interface conflictdeliveryState {
  conflictdeliveries: ConflictDeliveryData[];
  pageToken?: string;
  refreshed: boolean;
  currentPage: number;
  loading: boolean;
  initialReqSent: boolean;
}

const initialState: conflictdeliveryState = {
  conflictdeliveries: [],
  initialReqSent: false,
  refreshed: false,
  currentPage: 0,
  loading: false,
};

const conflictdeliverySlice = createSlice({
  name: "conflictdeliveries",
  initialState,
  reducers: {
    changeData(state, action) {
      const { conflictdeliveries, pageToken, refreshed } = action.payload;
      state.pageToken = pageToken;
      state.refreshed = refreshed;

      if (refreshed) {
        const newconflictdeliveries = (conflictdeliveries as ConflictDeliveryData[]).filter(
          (newconflictdelivery) =>
            state.conflictdeliveries.findIndex((conflictdelivery) => conflictdelivery.id === newconflictdelivery.id) === -1
        );
        state.conflictdeliveries = [...state.conflictdeliveries, ...newconflictdeliveries];
      } else {
        state.conflictdeliveries = [...state.conflictdeliveries, ...conflictdeliveries];
      }
      state.currentPage = state.currentPage + 1;
    },
    changeconflictdeliveries(state, action) {
      state.conflictdeliveries = action.payload;
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
    emptyState(state) {
      state.conflictdeliveries = [];
      state.pageToken = undefined;
      state.refreshed = false;
      state.currentPage = 0;
      state.loading = false;
      state.initialReqSent = false;
    },
  },
});

export const conflictdeliveryActions = conflictdeliverySlice.actions;

export default conflictdeliverySlice.reducer;
