import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';

import { Payment } from '#/domain/entities/payment.entity';
import { ICreatePayment } from '#/domain/gateways/payment/create-payment';
import { CreatePaymentDTO } from '#/domain/gateways/payment/dto/create-payment.dto';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class FastFoodCreatePayment implements ICreatePayment {
    private readonly baseUrl = env.FAST_FOOD_PAYMENT_API_URL;

    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HttpClientService) private readonly httpClient: IHttpClientService,
    ) {}

    async execute(request: CreatePaymentDTO): Promise<Payment> {
        try {
            this.logger.info('Creating payment in external service', { request });

            const url = `${this.baseUrl}/payment`;
            const payment = await this.httpClient.post<Payment, CreatePaymentDTO>(url, request);

            this.logger.info('Payment created successfully in external service', { request });

            return payment;
        } catch (error) {
            const axiosError = error as AxiosError;

            this.logger.error('Failed to create payment in fast-food service', error as Error, {
                request,
                status: axiosError.response?.status,
            });

            throw error;
        }
    }
}
