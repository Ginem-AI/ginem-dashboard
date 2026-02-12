import { IProduct } from "../interfaces/Product";
import { IAddressesModel } from "./addressModel";
import { IRootModel } from "./rootModel";
import { IUserModel } from "./userModel";

export interface IOrdersModel extends IRootModel {
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
  orderStatus: "waiting" | "process" | "delivery" | "done" | "cancel";

  user: IUserModel;
  address: IAddressesModel;
  orderItems: IOrderItem[];
}

export interface IOrdersUpdateRequestModel {
  orderId?: string;
  orderUserId?: string;
  orderProductId?: string;
  orderProductPrice?: number;
  orderTotalProductPrice?: number;
  orderOngkirPrice?: number;
  orderProductSizeSelected?: string;
  orderProductColorSelected?: string;
  orderTotalItem?: number;
  orderStatus?: "waiting" | "process" | "delivery" | "done" | "cancel" | string;
}

export interface IOrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  productNameSnapshot: string;
  productPriceSnapshot: number;
  quantity: number;
  totalPrice: number;
  product: IProduct;
}
