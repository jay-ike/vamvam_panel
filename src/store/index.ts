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
import conflictdeliverynReducer from "./conflictdeliveries/conflictdelivery-slice";

const store = configureStore({
  reducer: {
    deliveries: listingSlice,
    profile: profileReducer,
    ui: uiReducer,
    users: userReducer,
    bundles: bundleReducer,
    sponsors: sponsorReducer,
    userSponsored: usersSponsorReducer,
    newRegistrations: newRegistrationReducer,
    settledRegistrations: settledRegistrationReducer,
    transactions: transactionReducer,
    conflictdeliveries: conflictdeliverynReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
