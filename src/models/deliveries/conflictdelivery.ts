import UserData from "../auth/user-data";
import { DeliveryData } from "../delivery";
import {RecipientInfosData} from "../recipient-infos";

export default interface ConflictDeliveryData {
    id: string;
	cancellationDate: string;
	lastLocation: string;
	lastLocationAddress: string;
	status: string;
	price: string;
	packageType: string;
	recipientInfos : RecipientInfosData;
	type: string;
	driver: UserData;
	client : UserData;
	delivery:DeliveryData;
	reporter: UserData;
}