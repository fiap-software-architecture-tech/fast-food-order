import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';

import { Payment } from '#/domain/entities/payment.entity';
import { IGetPayment } from '#/domain/gateways/payment/get-payment';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class FastFoodGetPayment implements IGetPayment {
    private readonly baseUrl = env.FAST_FOOD_PAYMENT_API_URL;

    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HttpClientService) private readonly httpClient: IHttpClientService,
    ) {}

    async execute(id: string): Promise<Payment> {
        try {
            this.logger.info('Fetching payment from external service', { id });

            const url = `${this.baseUrl}/payment/${id}`;
            const payment = await this.httpClient.get<Payment>(url);

            this.logger.info('Payment fetched successfully from external service', { id });

            return payment;
        } catch (error) {
            const axiosError = error as AxiosError;

            this.logger.error('Failed to fetch payment from fast-food-payment service', error as Error, {
                paymentId: id,
                status: axiosError.response?.status,
            });

            throw error;
        }
    }
}
