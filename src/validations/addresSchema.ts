import z from 'zod';

export const AddressSchema = z.object({
    addressUserName: z.string().min(1, 'Nama wajib diisi'),
    addressKontak: z.string().min(1, 'Kontak wajib diisi'),
    addressPostalCode: z.string().min(3, 'Kode Pos tidak valid'),
    addressProvinsi: z.string().min(1, 'Provinsi wajib diisi'),
    addressKabupaten: z.string().min(1, 'Kabupaten wajib diisi'),
    addressKecamatan: z.string().min(1, 'Kecamatan wajib diisi'),
    addressDetail: z.string().min(1, 'Detail alamat wajib diisi'),
    addressCategory: z.string().optional(),
});

export type AddressFormType = z.infer<typeof AddressSchema>;
