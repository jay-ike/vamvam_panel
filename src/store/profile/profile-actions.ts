import { Dispatch } from "redux";
import { getUserInfo } from "../../api/auth/http";
import { profileActions } from "./profile-slice";
import toast from "react-hot-toast";
import { connectSocketIO } from "../../helper/socket";

export function fetchUserData() {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(profileActions.changeIsLoading());
      const userData = await getUserInfo();
      dispatch(profileActions.changeUserData({ userData }));
      connectSocketIO();
    } catch (error: any) {
      toast.error(error.message);
      dispatch(profileActions.changeError({ error }));
    }
  };
}
