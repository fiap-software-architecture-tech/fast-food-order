import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';

import { Product } from '#/domain/entities/product.entity';
import { IFindManyProducts } from '#/domain/gateways/product/find-many-products';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class FastFoodFindManyProducts implements IFindManyProducts {
    private readonly baseUrl = env.FAST_FOOD_API_URL;

    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HttpClientService) private readonly httpClient: IHttpClientService,
    ) {}

    async execute(ids: string[]): Promise<Product[]> {
        try {
            this.logger.info('Fetching client from external service', { ids });

            const url = `${this.baseUrl}/product/find-many`;
            const products = await this.httpClient.post<Product[], { ids: string[] }>(url, { ids });

            this.logger.info('Client fetched successfully from external service', { ids });

            return products;
        } catch (error) {
            const axiosError = error as AxiosError;

            this.logger.error('Failed to fetch products from fast-food service', error as Error, {
                productIds: ids,
                status: axiosError.response?.status,
            });

            throw error;
        }
    }
}
