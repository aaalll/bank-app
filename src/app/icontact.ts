export enum PreferredMethod {
  Email = 1,
  Mobile = 2,
}

export interface IContact {
  name: string;
  email: string;
  number?: string;
  mobile?: string;
  preferredMethod: PreferredMethod
}
