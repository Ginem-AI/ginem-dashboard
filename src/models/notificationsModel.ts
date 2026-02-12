import { IRootModel } from './rootModel'

export interface INotificationModel extends IRootModel {
  notificationId: string
  notificationName: string
  notificationMessage: string
}

export interface INotificationUpdateRequestModel {
  notificationId: string
  notificationName?: string
  notificationMessage?: string
}

export interface INotificationCreateRequestModel {
  notificationName: string
  notificationMessage: string
}
