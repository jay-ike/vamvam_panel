import { RouteObject } from "react-router-dom";
import { conflictLoader } from "../api/auth/loader";
import ProfilePage from "../pages/Profile";
import ChangePasswordPage from "../pages/auth/ChangePassword";
import ConflictDeliveriesList from "../pages/admin/deliveries/ConflictDeliveriesList";

const conflictRoute: RouteObject = {
  path: "conflict-manager",
  loader: conflictLoader,
  children: [
    {
      index: true,
      // element: <HomePage />
    },
    {
      path: "users",
    },
    {
      path: "profile",
      element: <ProfilePage />,
    },
    {
      path: "change-password",
      element: <ChangePasswordPage />,
    },
    {
      path: "conflict-deliveries/list",
      element: <ConflictDeliveriesList />,
    }
  ],
};

export default conflictRoute;
