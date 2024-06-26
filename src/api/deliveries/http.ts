import { DeliveryData, PaginatedResponse } from "../../models/delivery.ts";
import { axios, getAuthToken, handleApiError } from "../../helper";

type listingProps = {
    pageToken?: string,
    query?: string,
};

export async function getAllDeliveries(params: listingProps): Promise<PaginatedResponse<DeliveryData> | undefined> {
    let result;
    let token = {};
    if (params.pageToken) {
        token = {
            headers: {
                "page-token": params.pageToken,
                Authorization: "Bearer " + getAuthToken()
            }
        };
    }
    try {
        result = await axios.get<PaginatedResponse<DeliveryData>>(
            "/delivery/all?" + (params.query ?? ""),
            token
        );
        return result.data;
    } catch (error) {
        throw handleApiError({
            error,
            defaultMessage: {
                en: "failed to retrieve the deliveries",
                fr: "Ooops, impossible de recupérer vos livraisons"
            }
        });
    }
}
