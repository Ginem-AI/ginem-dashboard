/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIGS } from "../configs";
import { AppContextTypes, useAppContext } from "../context/app.context";
import { ServiceHttp } from "../services/api";

interface PostRequestTypes {
  path: string;
  body: any;
}

interface GetRequestTypes {
  path: string;
}

interface RemoveRequestTypes {
  path: string;
  body?: any;
}

interface UpdateRequestTypes {
  path: string;
  body: any;
}

interface GetTabelDataRequestTypes {
  path: string;
  page?: number;
  size?: number;
  filter?: any;
}

export interface HttpRequestTypes {
  handleGetRequest: (value: GetRequestTypes) => any;
  handlePostRequest: (value: PostRequestTypes) => any;
  handleRemoveRequest: (value: RemoveRequestTypes) => any;
  handleGetTableDataRequest: (value: GetTabelDataRequestTypes) => any;
}

export const useHttp = () => {
  const { setAppAlert }: AppContextTypes = useAppContext();
  const serviceHttp = new ServiceHttp();

  const handleGetRequest = async ({ path }: GetRequestTypes) => {
    try {
      const result = await serviceHttp.get({
        path,
      });
      return result;
    } catch (error: any) {
      console.error(error?.message);
      setAppAlert({
        isDisplayAlert: true,
        message: error?.message,
        alertType: "error",
      });
    }
  };

  const handlePostRequest = async ({ path, body }: PostRequestTypes) => {
    try {
      const result = await serviceHttp.post({
        path,
        body,
      });
      return result;
    } catch (error: any) {
      console.error(error?.message);
      setAppAlert({
        isDisplayAlert: true,
        message: error?.message,
        alertType: "error",
      });
    }
  };

  const handleRemoveRequest = async ({ path }: RemoveRequestTypes) => {
    try {
      const result = await serviceHttp.remove({
        path,
      });
      return result;
    } catch (error: any) {
      console.error(error?.message);
      setAppAlert({
        isDisplayAlert: true,
        message: error?.message,
        alertType: "error",
      });
    }
  };

  const handleUpdateRequest = async ({ path, body }: UpdateRequestTypes) => {
    try {
      const result = await serviceHttp.patch({
        path,
        body,
      });
      return result;
    } catch (error: any) {
      console.error(error?.message);
      setAppAlert({
        isDisplayAlert: true,
        message: error?.message,
        alertType: "error",
      });
    }
  };

  const handleGetTableDataRequest = async (props: GetTabelDataRequestTypes) => {
    try {
      const result = await serviceHttp.getTableData({
        url: CONFIGS.baseUrl + props.path,
        pagination: true,
        page: props.page || 0,
        size: props.size || 10,
        filters: props.filter,
      });
      return result;
    } catch (error: any) {
      console.error(error?.message);
      setAppAlert({
        isDisplayAlert: true,
        message: error?.message,
        alertType: "error",
      });
    }
  };

  return {
    handleGetRequest,
    handlePostRequest,
    handleRemoveRequest,
    handleUpdateRequest,
    handleGetTableDataRequest,
  };
};
