/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { CONFIGS } from '../configs';

export interface GetTableDataTypes {
    url: string;
    pagination?: boolean | true;
    page?: number | 0;
    size?: number | 10;
    filters?: any;
}

export const getHeaders = () => {
    return {
        'x-api-key': CONFIGS.uploadFileApiKey,
        'Content-Type': 'multipart/form-data',
    };
};

export class FileUploadServiceHttp {
    private baseUrl = CONFIGS.uploadFileUrl;

    public async get({ path }: { path: string }) {
        try {
            const result = await axios.get(this.baseUrl + path, {
                headers: {
                    ...getHeaders(),
                },
            });
            return result.data.data;
        } catch (error: any) {
            console.log(error.response.data.error_message || error.message);

            if (error.response && error.response.status === 401) {
                localStorage.removeItem(CONFIGS.localStorageKey);
                window.location.pathname = '/';
            }

            throw Error(error.response.data.error_message || error.message);
        }
    }

    public async post({ path, body }: { path: string; body: any }) {
        try {
            const result = await axios.post(this.baseUrl + path, body, {
                headers: {
                    ...getHeaders(),
                },
            });
            return result.data;
        } catch (error: any) {
            console.log(error.response.data.error_message || error.message);

            if (error.response && error.response.status === 401) {
                localStorage.removeItem(CONFIGS.localStorageKey);
                window.location.pathname = '/';
            }

            throw Error(error.response.data.error_message || error.message);
        }
    }

    public async patch({ path, body }: { path: string; body: any }) {
        try {
            const result = await axios.patch(this.baseUrl + path, body, {
                headers: {
                    ...getHeaders(),
                },
            });
            return result.data;
        } catch (error: any) {
            console.log(error.response.data.error_message || error.message);

            if (error.response && error.response.status === 401) {
                localStorage.removeItem(CONFIGS.localStorageKey);
                window.location.pathname = '/';
            }

            throw Error(error.response.data.error_message || error.message);
        }
    }

    public async remove({ path }: { path: string }) {
        try {
            const result = await axios.delete(this.baseUrl + path, {
                headers: {
                    ...getHeaders(),
                },
            });
            return result.data;
        } catch (error: any) {
            console.log(error.response.data.error_message || error.message);

            if (error.response && error.response.status === 401) {
                localStorage.removeItem(CONFIGS.localStorageKey);
                window.location.pathname = '/';
            }

            throw Error(error.response.data.error_message || error.message);
        }
    }

    public async getTableData(params: GetTableDataTypes) {
        const { url, pagination, page, size, filters } = params;
        try {
            const queryFilter = new URLSearchParams(filters).toString();
            const result = await axios.get(
                `${url}?pagination=${pagination}&page=${page}&size=${size}&${queryFilter}`,
                {
                    headers: {
                        ...getHeaders(),
                    },
                }
            );

            return {
                ...result.data.data,
                page: page,
                size: size,
            };
        } catch (error: any) {
            console.log(error.response.data.error_message || error.message);

            if (error.response && error.response.status === 401) {
                localStorage.removeItem(CONFIGS.localStorageKey);
                window.location.pathname = '/';
            }

            throw Error(error.response.data.error_message || error.message);
        }
    }
}
