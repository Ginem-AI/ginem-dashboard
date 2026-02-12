export interface IAddress {
  addressId: number;
  addressUserId: number;
  addressUserName: string;
  addressKontak: string;
  addressDetail: string;
  addressPostalCode: string;
  addressProvinsi: string;
  addressKabupaten: string;
  addressKecamatan: string;
  addressCategory: "user" | "admin";
  addressDesa: string;
  addressLatitude: string;
  addressLongitude: string;
}
