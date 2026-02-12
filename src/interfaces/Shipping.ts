export interface ICreateShippingDraftRequest {
  orderId: number;
  courierCompany: string;
  courierType: string;
  deliveryType: string;
}

export interface IConfirmShippingRequest {
  orderId: number;
}
