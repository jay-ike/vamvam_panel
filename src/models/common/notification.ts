import { RegistrationData } from "../registrations/registration-data";

export default interface NotificationData {
  id: string;
  title: string;
  description: string;
  data: RegistrationData | any | null;
  date: Date;
  url: string;
}
