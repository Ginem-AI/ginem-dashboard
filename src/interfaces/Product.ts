import { ICategory } from './Category';

export interface IProduct {
    productId: number;
    productName: string;
    productDescription: string;
    productImages: string[];
    productPrice: number;
    productCategoryId?: number;
    productSubCategoryId?: number;
    productTotalSale: number;
    productCode: string;
    productStock: number;
    productDiscount: number;
    productWeight: number;
    category: ICategory;
}

export interface IProductCreate {
    productName: string;
    productDescription: string;
    productImages: string[];
    productPrice: number;
    productCategoryId?: number;
    productSubCategoryId?: number;
    productCode: string;
    productStock: number;
    productDiscount?: number;
    productWeight?: number;
}

export interface IProductUpdate {
    productId: number;
    productName?: string;
    productDescription?: string;
    productImages?: string[];
    productPrice?: number;
    productCategoryId?: number;
    productSubCategoryId?: number;
    productCode?: string;
    productStock?: number;
    productDiscount?: number;
    productWeight?: number;
}

export interface IProductUpload {
    fileId: number;
    fileName: string;
    filePath: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    message?: string | null;
}
