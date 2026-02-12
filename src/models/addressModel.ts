import { IRootModel } from './rootModel';

export interface IAddressesModel extends IRootModel {
    addressId: string;
    addressUserId: string;
    addressUserName: string;
    addressKontak?: string;
    addressDetail: string;
    addressPostalCode: string;
    addressProvinsi: string;
    addressKabupaten: string;
    addressKecamatan: string;
    addressCategory: 'user' | 'admin';
}

export interface IAddressesCreateRequestModel {
    addressName: string;
    addressDetail: string;
    addressPostalCode: string;
    addressProvinsi: string;
    addressKabupaten: string;
    addressKecamatan: string;
    addressCategory: 'user' | 'admin';
}

export interface IAddressesUpdateRequestModel {
    addressId?: string;
    addressUserId?: string;
    addressName?: string;
    addressDetail?: string;
    addressPostalCode?: string;
    addressProvinsi?: string;
    addressKabupaten?: string;
    addressKecamatan?: string;
    addressCategory?: 'user' | 'admin' | string;
}
