import {IContact} from "./icontact"
import {IBilling} from "./ibilling"
export interface IBank {
  bankCode: string;
  bankName: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IBankDetail extends IBank{
  bankUrl: string;
  country: string;
  cardSchemes?: any[];
  contact?: IContact;
  billing?: IBilling
}