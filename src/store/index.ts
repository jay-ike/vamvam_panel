import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profile-slice";
import uiReducer from "./ui/ui-slice";
import listingSlice from "./deliveries/listing";
import userReducer from "./users/user-slice";
import newRegistrationReducer from "./registration/new/slice";
import settledRegistrationReducer from "./registration/settled/slice";
import bundleReducer from "./bundles/bundle-slice";
import sponsorReducer from "./sponsors/sponsor-slice";
import usersSponsorReducer from "./sponsors/users-sponsored/user-sponsored-slice";
import transactionReducer from "./transactions/transaction-slice";
import notificationSlice from "./notifications/notification-slice";
import driverSlice from "./users/drivers-listing";

const store = configureStore({
  reducer: {
    notifications: notificationSlice,
    deliveries: listingSlice,
    drivers: driverSlice,
    profile: profileReducer,
    ui: uiReducer,
    users: userReducer,
    bundles: bundleReducer,
    sponsors: sponsorReducer,
    userSponsored: usersSponsorReducer,
    newRegistrations: newRegistrationReducer,
    settledRegistrations: settledRegistrationReducer,
    transactions: transactionReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
