import { IRoot } from "./Root";

export interface INotification extends IRoot {
  notificationId: string;
  notificationName: string;
  notificationMessage: string;
}

export interface INotificationUpdateRequest {
  notificationId: string;
  notificationName?: string;
  notificationMessage?: string;
}

export interface INotificationCreateRequest {
  notificationName: string;
  notificationMessage: string;
}
