import z from 'zod';

export const productSchema = z.object({
    productName: z.string().min(3, 'Nama produk minimal 3 karakter'),
    productDescription: z.string().default(''),
    productImages: z.array(z.string()).default([]),
    productPrice: z.number().min(0, 'Harga harus >= 0'),
    productDiscount: z.number().min(0).max(100, 'Diskon 0-100'),
    productStock: z.number().min(0, 'Stok harus >= 0'),
    productWeight: z.number().min(0, 'Berat harus >= 0'),
    productCategoryId: z.number().min(0, 'Pilih kategori'),
    productSubCategoryId: z.number().optional(),
    productCode: z.string().min(1, 'masukan kode produk'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
