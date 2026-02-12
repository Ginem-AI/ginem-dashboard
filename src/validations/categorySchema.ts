import { z } from 'zod';

export const categorySchema = z.object({
    categoryId: z.string().optional(),
    categoryName: z.string().min(3, 'Nama kategori minimal 3 karakter'),
    categoryIcon: z.string().optional(),
    categoryType: z.string().min(1, 'Tipe kategori harus diisi'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const subCategorySchema = z.object({
    categoryId: z.string().optional(),
    categoryReference: z.string().min(1, 'Kategori induk harus diisi'),
    categoryName: z.string().min(3, 'Nama kategori minimal 3 karakter'),
    categoryType: z.string().min(1, 'Tipe kategori harus diisi'),
});

export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;
