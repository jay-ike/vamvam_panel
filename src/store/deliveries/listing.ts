import { Dispatch } from "redux";
import { json } from "react-router-dom";
import { uiActions } from "../ui/ui-slice.ts";
import { createSlice } from "@reduxjs/toolkit";
import { getAllDeliveries } from "../../api/deliveries/http.ts";
import { DeliveryFilter, DeliveryData, ListingArgs } from "../../models/delivery.ts";

interface DeliveryState {
    alreadyRequested: boolean;
    currentPage: number;
    deliveries: DeliveryData[];
    filter?: DeliveryFilter;
    loading: boolean;
    pageToken?: string;
    pageSize: number;
    paginationCompleted: boolean;
    refreshed: boolean;
}
const initialState: DeliveryState = {
    alreadyRequested: false,
    currentPage: 0,
    deliveries: [],
    loading: false,
    paginationCompleted: false,
    pageSize: 10,
    refreshed: false,
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
            const { deliveries, pageToken, refreshed } = action.payload;
            state.pageToken = pageToken;
            state.refreshed = refreshed;
            if (state.pageSize > deliveries.length) {
                state.paginationCompleted = true;
            }
            if (refreshed) {
                state.deliveries = mergeDeliveries(
                    state.deliveries,
                    deliveries
                );
            } else {
                state.deliveries = state.deliveries.concat(deliveries);
            }
            if(deliveries.length > 0) {
                state.currentPage += 1;
            }
        },
        updateFilter(state, action) {
            const {from, to, status} = action.payload;
            state.filter = {
                from: from ?? state.filter?.from,
                status: status ?? state.filter?.status,
                to: to ?? state.filter?.to
            };
            state.currentPage = 0;
            state.deliveries = [];
            state.paginationCompleted = false;
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
        if (params[key] && params[key] !== "") {
            return key + "=" + params[key];
        }
    }).filter((val) => val !== undefined).join("&");
}
function setLoading(dispatch: Dispatch, initialized: boolean, loading: boolean) {
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
        let results: any;
        let query = parseParams(arg, listingKeys);
        try {
            setLoading(dispatch, isInitial, true);
            results = await getAllDeliveries({ pageToken: arg.pageToken, query });
            if (isInitial) {
                dispatch(actions.setInitialRequest(true));
            }
            dispatch(actions.updateDeliveries({
                deliveries: results?.results ?? [],
                pageToken: results?.nextPageToken,
                refreshed: results?.refreshed
            }));
        } catch (error: any) {
            throw json({ message: error.message }, { status: 500 });
        } finally {
            setLoading(dispatch, isInitial, false);
        }
    }
}

export function applyFilter(filter: DeliveryFilter) {
    return function (dispatch: Dispatch) {
        dispatch(listingActions.updateFilter(filter));
    }
}
export default listingSlice.reducer;
