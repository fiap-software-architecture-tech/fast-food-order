import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';

import { Client } from '#/domain/entities/client.entity';
import { IGetClientByCpf } from '#/domain/gateways/client/get-client-by-cpf';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

@injectable()
export class FastFoodGetClientByCpf implements IGetClientByCpf {
    private readonly baseUrl = env.FAST_FOOD_API_URL;

    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HttpClientService) private readonly httpClient: IHttpClientService,
    ) {}

    async execute(cpf: string): Promise<Client | null> {
        try {
            this.logger.info('Fetching client from external service', { cpf });

            const url = `${this.baseUrl}/client/${cpf}/cpf`;
            const client = await this.httpClient.get<Client>(url);

            this.logger.info('Client fetched successfully from external service', { cpf });

            return client;
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response?.status === 404) {
                this.logger.warn('Client not found in external service', { cpf });
                return null;
            }

            this.logger.error('Failed to fetch client from external service', error as Error, { cpf });
            throw error;
        }
    }
}
