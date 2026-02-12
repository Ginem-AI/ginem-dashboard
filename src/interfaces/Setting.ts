export interface ISetting {
  settingId: number;
  settingType: "general" | "wa_blas";
  banner?: string | null;
  whatsappNumber?: string | null;
  waBlasToken?: string | null;
  waBlasServer?: string | null;
}
