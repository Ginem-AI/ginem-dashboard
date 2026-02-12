import { IAddress } from "./Address";
import { IProduct } from "./Product";
import { IUser } from "./User";

export interface IOrder {
  orderId: number;
  orderUserId: string;

  orderSubtotal: number;
  orderShippingFee: number;
  orderGrandTotal: number;
  orderTotalItem: number;

  orderCourierCode?: string;
  orderCourierService?: string;
  orderTrackingId?: string;
  orderWaybillId?: string;
  orderDraftId?: string;
  orderPaymentUrl?: string;
  orderPaymentToken?: string;
  orderReferenceId?: string;

  orderStatus: "waiting" | "process" | "draft" | "delivery" | "done" | "cancel";

  user: IUser;
  orderItems: IOrderItems[];
}

export interface IOrderItems {
  orderItemId: number;
  orderId: number;
  productId: number;
  productNameSnapshot: string;
  productPriceSnapshot: number;
  quantity: number;
  totalPrice: number;
  product?: IProduct;
}

export interface IOrderDetail {
  orderId: number;
  orderUserId: string;

  orderSubtotal: number;
  orderShippingFee: number;
  orderGrandTotal: number;
  orderTotalItem: number;

  orderCourierCode?: string;
  orderCourierService?: string;
  orderTrackingId?: string;
  orderWaybillId?: string;
  orderDraftId?: string;
  orderStatus: "waiting" | "draft" | "process" | "delivery" | "done" | "cancel";

  user: IUser;
  address: IAddress;
  orderItems: IOrderItems[];
}
