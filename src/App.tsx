import { RouterProvider } from "react-router-dom";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import router from "./routes";
import "../i18n";
import i18n from "../i18n";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STORAGE_KEY } from "./helper/enums";
import useThemeMode from "./hooks/useThemeMode";

import Toast from "./components/UI/Toast";
import { fetchUserData } from "./store/profile/profile-actions";
import { AppDispatch, RootState } from "./store";
import CircularLoader from "./components/UI/CircularLoader";
import { getAuthToken, getUserRole } from "./helper/utils";
import { handleIncomingRegistration } from "./helper/socket";
import { notificationActions } from "./store/notifications/notification-slice";
import NotificationData from "./models/common/notification";
import { useTranslation } from "react-i18next";

const customTheme = extendTheme(
  {
    colors: {
      brand: {
        100: "#3C50E0",
      },
      initialColorMode: "system",
      useSystemColorMode: true,
    },
  },
  withDefaultColorScheme({
    colorScheme: "blue",
    components: ["Button", "Badge"],
  })
);
function App() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, userData } = useSelector(
    (state: RootState) => state.profile
  );

  const handleSocketEvents = () => {
    handleIncomingRegistration((data) => {
      const notification: NotificationData = {
        data,
        date: new Date(),
        url: `${getUserRole()}/new-registrations/${data.id}`,
        title: t("notifications.new_registration_title"),
        description: t("notifications.new_registration_description"),
        id: data.id,
      };
      console.log("new registration notification", notification);
      dispatch(notificationActions.addNotification(notification));
    });

    // handle conflict notification...
  };

  useThemeMode();

  useEffect(() => {
    const lng = localStorage.getItem(STORAGE_KEY.lang) ?? navigator.language;
    i18n.changeLanguage(lng);
  }, []);

  useEffect(() => {
    if (!userData && getAuthToken()) {
      dispatch(fetchUserData());
      handleSocketEvents();
    }
  }, [dispatch, userData]);

  let mainContent = <RouterProvider router={router} />;

  if (loading) {
    mainContent = <CircularLoader />;
  }

  if (error) {
    mainContent = (
      <div className="flex flex-col gap-2 items-center justify-center h-screen dark:bg-boxdark-2 dark:text-bodydark">
        <h1 className="text-4xl font-bold">An error occured</h1>
        <p className="text-lg font-semibold">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-2 mt-4 cursor-pointer rounded-lg border border-primary bg-primary"
        >
          reload
        </button>
      </div>
    );
  }

  return (
    <ChakraProvider theme={customTheme}>
      <Toast />
      {mainContent}
    </ChakraProvider>
  );
}

export default App;
