import { IRootModel } from './rootModel';

export interface ICategoryModel extends IRootModel {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
}

export interface ICategoryUpdateRequestModel {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
}

export interface ICategoryCreateRequestModel {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
}
