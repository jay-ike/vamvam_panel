export interface RegistrationData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  carInfos: string | File;
  age: string[];
  sponsorCode?: string;
  gender?: string;
  lang?: string;
  contributorId?: string;
  registrationDate?: string;
  validationDate?: string;
  rejectionDate?: string;
  status?: "rejected" | "pending" | "active";
}
