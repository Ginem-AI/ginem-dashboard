export interface ICategory {
    categoryId: string;
    categoryReference: string;
    categoryName: string;
    categoryIcon: string;
    categoryType: 'parent' | 'child';
}

export interface ICategoryCreate {
    categoryReference?: string;
    categoryName: string;
    categoryIcon: string;
    categoryType: 'parent' | 'child';
}
