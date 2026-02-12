import { ICategoryModel } from './categoryModel';
import { IRootModel } from './rootModel';

export interface IProductModel extends IRootModel {
    productId: string;
    productName: string;
    productDescription: string;
    productImages: string[];
    productPrice: number;
    productCategoryId: string;
    productTotalSale: number;
    productStock: number;
    productDiscount: number;
    productWeight: number;
    productCode: string;
    category: ICategoryModel;
}

export interface IProductUpdateRequestModel {
    productId: string;
    productName?: string;
    productDescription?: string;
    productImages?: string[];
    productPrice?: number;
    productCategoryId?: string;
    productTotalSale?: number;
    productStock?: number;
    productDiscount?: number;
    productWeight?: number;
}

export interface IProductCreateRequestModel {
    productName: string;
    productDescription?: string;
    productImages?: string[];
    productPrice: number;
    productCategoryId: string;
    productTotalSale: number;
    productStock: number;
    productDiscount: number;
    productWeight: number;
    productCode: string;
}
