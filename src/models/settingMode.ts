export interface ISettingModel {
    settingId?: string;
    settingType: 'bank' | 'qris' | 'general' | 'wa_blas';
    bankName?: string | null;
    bankNumber?: string | null;
    bankOwner?: string | null;
    qris?: string | null;
    banner?: string[] | null;
    whatsappNumber?: string | null;
    waBlasToken?: string | null;
    waBlasServer?: string | null;
}
