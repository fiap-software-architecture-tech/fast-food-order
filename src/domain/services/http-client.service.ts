import { AxiosRequestConfig } from 'axios';

export interface IHttpClientService {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T | null>;
}
