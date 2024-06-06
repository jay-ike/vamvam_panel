import { Dispatch } from "redux";
import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "../ui/ui-slice";
import { json } from "react-router-dom";
import { getAllUsers } from "../../api/admin/http";
import UserData from "../../models/auth/user-data";

interface ListingState {
    alreadyRequested: boolean;
    drivers: Array<UserData>;
    loading: boolean;
    pageSize: number;
    pageToken?: string;
    paginationCompleted?: boolean;
    refreshed: boolean;
}

const initialState: ListingState = {
    alreadyRequested: false,
    drivers: [],
    loading: false,
    pageSize: 20,
    refreshed: false
};
function mergeDrivers(initial: Array<any>, newDatas: Array<any>): Array<any> {
    const result = initial.reduce(function(acc: any, delivery: any) {
        acc[delivery.id] = delivery;
        return acc;
    }, Object.create(null));
    newDatas.forEach(function(delivery: any) {
        result[delivery.id] = delivery;
    });
    return Object.values(result);
}
const listingSlice = createSlice({
    name: "drivers",
    initialState,
    reducers: {
        updateDrivers(state, action) {
            const { pageToken, refreshed, users } = action.payload;
            state.pageToken = pageToken;
            state.refreshed = refreshed;

            if (users.length < state.pageSize) {
                state.paginationCompleted = true;
            }

            if (refreshed) {
                state.drivers = mergeDrivers(state.drivers, users);
            } else {
                state.drivers = state.drivers.concat(users);
            }
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setRequested(state, action) {
            state.alreadyRequested = action.payload;
        }
    }
});

export function fetchDrivers({ pageToken, skip }: {
    pageToken?: string;
    skip?: number
}) {
    const { actions } = listingSlice;
    function load(dispatch: Dispatch, initialized: boolean, val: boolean) {
        if (initialized) {
            dispatch(actions.setLoading(val));
        } else {
            dispatch(uiActions.showLinearLoader(val));
        }
    }
    return async function(dispatch: Dispatch) {
        const isInitial = !pageToken && !skip;
        try {
            if (isInitial) {
                dispatch(actions.setRequested(true));
            }
            load(dispatch, isInitial, true);
            const { nextPageToken, refreshed, users } = await getAllUsers({
                pageToken,
                role: "driver",
                skip,
            });
            dispatch(actions.updateDrivers(
                { users, refreshed, pageToken: nextPageToken }
            ));
        } catch (error: any) {
            throw json({ message: error.message }, { status: 500 });
        } finally {
            load(dispatch, isInitial, false);
        }
    };
};
export default listingSlice.reducer;
export const driverActions = listingSlice.actions;
