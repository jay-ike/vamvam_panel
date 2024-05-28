import { Dispatch } from "redux";
import {json} from "react-router-dom";
import {uiActions} from "../ui/ui-slice.ts";
import { createSlice } from "@reduxjs/toolkit";
import { getAllDeliveries } from "../../api/deliveries/http.ts";
import {DeliveryData, ListingArgs} from "../../models/delivery.ts";

interface DeliveryState {
    alreadyRequested: boolean;
    currentPage: number;
    deliveries: DeliveryData[];
    hasFilterChanged: boolean;
    loading: boolean;
    pageToken?: string;
    pageSize: number;
    paginationCompleted: boolean;
    refreshed: boolean;

}
const initialState : DeliveryState = {
    alreadyRequested: false,
    currentPage: 0,
    deliveries: [],
    hasFilterChanged: false,
    loading: false,
    paginationCompleted: false,
    pageSize: 1,
    refreshed: false
};

function mergeDeliveries(initial: Array<any>, newDatas: Array<any>): Array<any> {
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
    name: "delivery-listing",
    initialState,
    reducers: {
        emptyState(state) {
            state.currentPage = 0;
            state.refreshed = false;
            state.deliveries = [];
            state.alreadyRequested = false;
            state.pageToken = undefined;
        },
        completePagination(state, action) {
            state.paginationCompleted = action.payload;
        },
        updateDeliveries(state, action) {
            const {deliveries, pageToken, refreshed} = action.payload;
            state.pageToken = pageToken;
            state.refreshed = refreshed;
            if(state.pageSize > deliveries.length) {
                state.paginationCompleted = true;
            }
            if(state.hasFilterChanged) {
                state.deliveries = deliveries;
                return;
            }
            if (refreshed) {
                state.deliveries = mergeDeliveries(
                    state.deliveries,
                    deliveries
                );
            } else {
                state.deliveries = state.deliveries.concat(deliveries);
            }
            state.currentPage += 1;
        },
        filterChanged(state, action) {
            state.hasFilterChanged = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        setInitialRequest(state, action) {
            state.alreadyRequested = action.payload;
        },
        setDeliveries(state, action) {
            state.deliveries = action.payload;
        }
    }
});

export const listingActions = listingSlice.actions;
const listingKeys = ["from", "to", "status", "skip", "maxPageSize"];
function parseParams(params: any, keys: Array<string>): string {
    return keys.map(function(key) {
        if (params[key]) {
            return key + "=" + params[key];
        }
    }).filter((val) => val !== undefined).join("&");
}
function setLoading(dispatch:Dispatch, initialized: boolean, loading: boolean) {
    if (initialized) {
        dispatch(listingSlice.actions.setLoading(loading));
    } else {
        dispatch(uiActions.showLinearLoader(loading));
    }
}

export function fetchDeliveries(arg: ListingArgs) {
    const actions = listingSlice.actions;
    return async function deliveryFetcher(dispatch: Dispatch) {
        const isInitial = !arg.skip && !arg.pageToken;
        let results;
        let query = parseParams(Object.assign({maxPageSize: 1}, arg), listingKeys);
        try {
            setLoading(dispatch, isInitial, true);
            results = await getAllDeliveries({pageToken: arg.pageToken, query});
            if(isInitial) {
                dispatch(actions.setInitialRequest(true));
            }
            dispatch(actions.updateDeliveries({
                deliveries: results?.results ?? [],
                pageToken: results?.nextPageToken,
                refreshed: results?.refreshed
            }));
        } catch (error: any) {
            throw json({message: error.message}, {status: 500});
        } finally {
            setLoading(dispatch, isInitial, false);
        }
    }
}
export default listingSlice.reducer;
