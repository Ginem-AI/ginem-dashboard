import z from 'zod';

export const WaBlasSchema = z.object({
    waBlasToken: z.string().min(1, 'Token wajib diisi'),
    waBlasServer: z.string().url('Masukkan URL server yang valid'),
});

export type WaBlasFormType = z.infer<typeof WaBlasSchema>;
