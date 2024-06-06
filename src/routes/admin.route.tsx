import { RouteObject } from "react-router-dom";
import { adminLoader } from "../api/auth/loader";
import UsersPage from "../pages/admin/UsersList";
import CreateUserPage from "../pages/admin/CreateUser";
import ProfilePage from "../pages/Profile";
import ChangePasswordPage from "../pages/auth/ChangePassword";
import SettingsPage from "../pages/admin/Settings";
import { loadSettings } from "../api/admin/loader";
import { Home, Deliveries, DriverVisualization } from "../pages/admin";
import DisconnectAllPage from "../pages/admin/DisconnectAll";
import BundlesPage from "../pages/admin/bundles/BundlesList";
import CreateBundlePage from "../pages/admin/bundles/CreateBundle";
import CreateSponsorPage from "../pages/admin/sponsors/CreateSponsor";
import SponsorsPage from "../pages/admin/sponsors/SponsorsList";
import SponsoredUsersPage from "../pages/admin/sponsors/SponsoredUserList";
import TransactionsPage from "../pages/admin/transactions/TransactionsList";

const adminRoute: RouteObject = {
    path: "admin",
    loader: adminLoader,
    children: [
        {
            index: true,
            element: <Home />,
        },
        {
            path: "users",
            element: <UsersPage />,
        },
        {
            path: "create-user",
            element: <CreateUserPage />,
        },
        {
            path: "profile",
            element: <ProfilePage />,
        },
        {
            path: "settings",
            element: <SettingsPage />,
            loader: loadSettings,
        },
        {
            path: "disconnect-all",
            element: <DisconnectAllPage />,
        },
        {
            path: "change-password",
            element: <ChangePasswordPage />,
        },
        {
            path: "deliveries",
            element: <Deliveries />,
        },
        {
            path: "locate-drivers",
            element: <DriverVisualization />,
        },

        {
            path: "recharges",
        },
        {
            path: "subscriptions",
        },
        {
            path: "bundles",
            element: <BundlesPage />,
        },
        {
            path: "create-bundle",
            element: <CreateBundlePage />,
        },
        {
            path: "edit-bundle",
            element: <CreateBundlePage />,
        },
        {
            path: "sponsors",
            element: <SponsorsPage />,
        },
        {
            path: "create-sponsor",
            element: <CreateSponsorPage />,
        },
        {
            path: "edit-sponsor",
            element: <CreateSponsorPage />,
        },
        {
            path: "sponsor/:id",
            element: <SponsoredUsersPage />,
        },
        {
            path: "transactions",
            element: <TransactionsPage />,
        }
    ],
};

export default adminRoute;
