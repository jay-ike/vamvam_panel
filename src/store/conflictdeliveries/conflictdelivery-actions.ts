import { Dispatch } from "redux";
import { getAllConflictDeliveries } from "../../api/admin/http";
import { uiActions } from "../ui/ui-slice";
import { conflictdeliveryActions } from "./conflictdelivery-slice";
import { json } from "react-router-dom";
import { GetConflictDeliveriesArgs } from "../../models/conflict_manager/conflict_manager";

export function fetchconflictdeliverysList({ skip, pageToken}: GetConflictDeliveriesArgs) {
  return async (dispatch: Dispatch) => {
    const isInitialReq = !skip && !pageToken;

    try {
      if (isInitialReq) {
        dispatch(conflictdeliveryActions.changeLoading(true));
      } else {
        dispatch(uiActions.showLinearLoader(true));
      }

      const { nextPageToken, refreshed, conflictdeliveries } = await getAllConflictDeliveries({
        pageToken,
        skip
      });

      if (isInitialReq) {
        dispatch(conflictdeliveryActions.changeInitialRequest(true));
      }
      dispatch(
        conflictdeliveryActions.changeData({ conflictdeliveries, refreshed, pageToken: nextPageToken })
      );
    } catch (error: any) {
      throw json({ message: error.message }, { status: 500 });
    } finally {
      if (isInitialReq) {
        dispatch(conflictdeliveryActions.changeLoading(false));
      } else {
        dispatch(uiActions.showLinearLoader(false));
      }
    }
  };
}
