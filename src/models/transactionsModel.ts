import { IOrdersModel } from './ordersModel'
import { IRootModel } from './rootModel'
import { IUserModel } from './userModel'

export interface ITransactionsModel extends IRootModel {
  transactionId: string
  transactionPrice: number
  transactionOrderId: string
  transactionUserId: string
  transactionOngkirPrice: number
  user: IUserModel
  order: IOrdersModel
}

export interface ITransactionsUpdateRequestModel {
  transactionId: string
  transactionPrice?: number
  transactionOrderId?: string
  transactionUserId?: string
  transactionOngkirPrice?: number
}

export interface ITransactionsCreateRequestModel {
  transactionPrice: number
  transactionOrderId: string
  transactionUserId: string
  transactionOngkirPrice: number
}
