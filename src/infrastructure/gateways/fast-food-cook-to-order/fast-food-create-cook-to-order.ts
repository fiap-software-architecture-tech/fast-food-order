import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';

import { ICreateCookToOrder } from '#/domain/gateways/cook-to-order/create-cook-to-order';
import { CreateCookToOrderDTO } from '#/domain/gateways/cook-to-order/dto/create-cook-to-order.dto';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class FastFoodCreateCookToOrder implements ICreateCookToOrder {
    private readonly baseUrl = env.FAST_FOOD_COOK_TO_ORDER_API_URL;

    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HttpClientService) private readonly httpClient: IHttpClientService,
    ) {}

    async execute(request: CreateCookToOrderDTO): Promise<void> {
        try {
            this.logger.info('Creating cook to order in external service', { request });

            const url = `${this.baseUrl}/cook-to-order`;
            await this.httpClient.post<void, CreateCookToOrderDTO>(url, request);

            this.logger.info('Cook to order created successfully in external service', { request });
        } catch (error) {
            const axiosError = error as AxiosError;

            this.logger.error('Failed to create cook to order in fast-food service', error as Error, {
                request,
                status: axiosError.response?.status,
            });

            throw error;
        }
    }
}
