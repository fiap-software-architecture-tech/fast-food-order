import { AxiosError } from 'axios';
import { inject, injectable } from 'inversify';

import { Client } from '#/domain/entities/client.entity';
import { GetClientById } from '#/domain/gateways/client/get-client-by-id';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class FastFoodGetClientById implements GetClientById {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.HttpClientService) private readonly httpClient: IHttpClientService,
    ) {}

    async execute(id: string): Promise<Client | null> {
        try {
            this.logger.info('Fetching client from external service', { id });
            const client = await this.httpClient.get<Client>(`/clients/${id}/id`);
            this.logger.info('Client fetched successfully from external service', { id });
            return client;
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response?.status === 404) {
                this.logger.warn('Client not found in external service', { id });
                return null;
            }

            this.logger.error('Failed to fetch client from external service', error as Error, { id });
            throw error;
        }
    }
}
