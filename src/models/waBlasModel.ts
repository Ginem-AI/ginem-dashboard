import { IRootModel } from "./rootModel";

export interface IWaBlasHistoryMode extends IRootModel {
  waBlasHistoryId: string;
  waBlasHistoryUserId: string;
  waBlasHistoryUserName: string;
  waBlasHistoryUserPhone: string;
  waBlasHistoryTitle: string;
  waBlasHistoryMessage: string;
  waBlasStatus: "success" | "fail";
}

export interface IWaBlasCreateRequestModel {
  waBlasTitle: string;
  waBlasMessage: string;
}
