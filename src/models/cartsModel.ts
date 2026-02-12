import { IRootModel } from './rootModel'

export interface ICartsModel extends IRootModel {
  cartId: string
  cartUserId: string
  cartProductId: string
}

export interface ICartsUpdateRequestModel {
  cartId: string
  cartUserId: string
  cartProductId: string
}

export interface ICartsCreateRequestModel {
  cartUserId: string
  cartProductId: string
}
