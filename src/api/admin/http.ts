import { PAGE_LIMIT, STORAGE_KEY } from "../../helper";
import { axios } from "../../helper/http";
import { getAuthToken, handleApiError } from "../../helper/utils";
import { CreateAdminData, BundleData, GetBundlesArgs, GetUserArgs, GetSponsorsArgs, GetTransactionsArgs } from "../../models/admin/admin";
import {
  DeliverySettingsData,
  DeliverySettingsValue,
  OTPSettingsData,
  OTPSettingsValue,
} from "../../models/admin/settings";
import UserData from "../../models/auth/user-data";
import { GetConflictDeliveriesArgs } from "../../models/conflict_manager/conflict_manager";
import ConflictDeliveryData from "../../models/deliveries/conflictdelivery";
import Sponsor from "../../models/sponsors/sponsor";
import SponsorData from "../../models/sponsors/sponsor-data";
import TransactionData from "../../models/transactions/transaction-data";

async function updateSettingsData(
  data: OTPSettingsValue | DeliverySettingsValue
) {
  try {
    await axios.post("/admin/update-settings", {
      type: "search_radius" in data ? "delivery" : "otp",
      value: data,
    });
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to update settings",
        fr: "Échec de la mise à jour des paramètres",
      },
    });
  }
}

async function getSettingsData(): Promise<
  (OTPSettingsData | DeliverySettingsData)[]
> {
  try {
    const response = await axios.get("/system/settings/");
    const settings = response.data;
    return settings;
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to get settings",
        fr: "Échec de la récupération des paramètres",
      },
    });
  }
}

async function blockUser(id: string) {
  try {
    const response = await axios.post("/admin/block-user", { id });
    console.log(response.data);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to block user",
        fr: "Échec de blocage de l'utilisateur",
      },
    });
  }
}

async function activateUser(id: string) {
  try {
    const response = await axios.post("/admin/activate-user", { id });
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to activate user",
        fr: "Échec de l'activation de l'utilisateur",
      },
    });
  }
}

async function updateBonus({
  bonus,
  driverId,
  type,
}: {
  bonus: number;
  driverId: string;
  type: string;
}) {
  try {
    const response = await axios.post("/transaction/handle-bonus", {
      bonus,
      driverId,
      type,
    });
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to update driver bonus",
        fr: "Échec de la mise à jour du bonus du conducteur",
      },
    });
  }
}

async function revokeAllUsersToken() {
  try {
    await axios.post("/admin/revoke-all");
    localStorage.removeItem(STORAGE_KEY.token);
    localStorage.removeItem(STORAGE_KEY.role);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to block all users",
        fr: "Échec de blocage de tous les utilisateurs",
      },
    });
  }
}

async function createAdmin(data: CreateAdminData) {
  try {
    const response = await axios.post("/admin/new-admin", data);
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to create admin",
        fr: "Échec de création de l'administrateur",
      },
    });
  }
}

async function getAllUsers({ skip, pageToken, role }: GetUserArgs) {
  const urlQuery = `?maxPageSize=${PAGE_LIMIT}`
    .concat(skip ? `&skip=${skip}` : "")
    .concat(role ? `&role=${role}` : "");

  const response = await axios.get(
    `/user/all${urlQuery}`,
    pageToken
      ? {
          headers: {
            "page-token": pageToken,
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      : {}
  );
  const data = response.data;
  return {
    users: data.results as UserData[],
    refreshed: data.refreshed,
    nextPageToken: data.nextPageToken,
  };
}

async function getAllBundles({ skip, pageToken }: GetBundlesArgs) {
  const urlQuery = `?maxPageSize=${PAGE_LIMIT}`
    .concat(skip ? `&skip=${skip}` : "");

  const response = await axios.get(
    `/bundle/${urlQuery}`,
    pageToken
      ? {
          headers: {
            "page-token": pageToken,
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      : {}
  );
  const data = response.data;
  return {
    bundles: data.data as BundleData[],
    refreshed: data.refreshed,
    nextPageToken: data.nextPageToken,
  };
}

async function createBundle(data: BundleData) {
  try {
    const response = await axios.post("/bundle/new-bundle", data);
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to create bundle",
        fr: "Échec de création du pack",
      },
    });
  }
}

async function editBundle(data: BundleData) {
  try {
    const response = await axios.post("/bundle/update", data);
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to create bundle",
        fr: "Échec de création du pack",
      },
    });
  }
}

async function deleteBundle(id:string) {
  try {
    await axios.post("/bundle/delete",{id:id});
  } catch (error) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to delete bundle",
        fr: "Echec de la suppression du pack",
      },
    });
  }
}

async function getAllSponsors({ skip, pageToken }: GetSponsorsArgs) {
  const urlQuery = `?maxPageSize=${PAGE_LIMIT}`
    .concat(skip ? `&skip=${skip}` : "");
  const response = await axios.get(
    `/sponsor/ranking/${urlQuery}`,
    pageToken
      ? {
          headers: {
            "page-token": pageToken,
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      : {}
  );
  const data = response.data;
  return {
    sponsors: data.results as SponsorData[],
    refreshed: data.refreshed,
    nextPageToken: data.nextPageToken,
  };
}

async function createSponsor(data: Sponsor) {
  try {
    const response = await axios.post("/sponsor/create", data);
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to create sponsor",
        fr: "Échec de création du pack",
      },
    });
  }
}

async function editSponsor(data: Sponsor) {
  try {
    const response = await axios.post("/sponsor/update", data);
    console.log(response);
  } catch (error: any) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to create sponsor",
        fr: "Échec de création du pack",
      },
    });
  }
}

async function deleteSponsor(id:string) {
  try {
    await axios.post("/sponsor/delete",{id:id});
  } catch (error) {
    throw handleApiError({
      error,
      defaultMessage: {
        en: "Failed to delete sponsor",
        fr: "Echec de la suppression du pack",
      },
    });
  }
}

async function getAllUserSponsored({ id, skip, pageToken }: GetSponsorsArgs) {
  const urlQuery = `?maxPageSize=${PAGE_LIMIT}&id=${id}`
    .concat(skip ? `&skip=${skip}`  : "");
  const response = await axios.get(
    `/sponsor/enrolled/${urlQuery}`,
    pageToken
      ? {
          headers: {
            "page-token": pageToken,
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      : {}
  );
  const data = response.data;
  return {
    usersSponsored: data.results as UserData[],
    refreshed: data.refreshed,
    nextPageToken: data.nextPageToken,
  };
}



async function getAllTransactions({ skip, pageToken,startDate,endDate,type}: GetTransactionsArgs) {
  const params = {
    // startDate:startDate != null ? Date.parse(startDate!) : "0000000000000" ,
    // endDate:endDate != null ? Date.parse(endDate!) : new Date().getTime(),
    type:type
  }
  const urlQuery = `?maxPageSize=${PAGE_LIMIT}`
    .concat(skip ? `&skip=${skip}` : "");
  const response = await axios.get(
    `/transaction/payment-history/${urlQuery}`,
    pageToken
      ? {
          headers: {
            "page-token": pageToken,
            Authorization: `Bearer ${getAuthToken()}`,
          },
          params:
           { ...params}
          
        }
      : {
        headers:{}, 
        params:{
          ...params
        }
      }
  );
  const data = response.data;
  return {
    transactions: data.results as TransactionData[],
    refreshed: data.refreshed,
    nextPageToken: data.nextPageToken,
  };
}

async function getAllConflictDeliveries({ skip, pageToken }: GetConflictDeliveriesArgs) {
  const urlQuery = `?maxPageSize=${PAGE_LIMIT}`
    .concat(skip ? `&skip=${skip}` : "");

  const response = await axios.get(
    `/delivery/conflict/all-new/${urlQuery}`,
    pageToken
      ? {
          headers: {
            "page-token": pageToken,
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      : {}
  );
  const data = response.data;
  return {
    conflictdeliveries: data.results as ConflictDeliveryData[],
    refreshed: data.refreshed,
    nextPageToken: data.nextPageToken,
  }
}

export {
  updateSettingsData,
  getSettingsData,
  blockUser,
  activateUser,
  updateBonus,
  revokeAllUsersToken,
  createAdmin,
  getAllUsers,
  getAllBundles,
  createBundle,
  editBundle,
  deleteBundle,
  getAllSponsors,
  createSponsor,
  editSponsor,
  deleteSponsor,
  getAllUserSponsored,
  getAllTransactions,
  getAllConflictDeliveries
};
