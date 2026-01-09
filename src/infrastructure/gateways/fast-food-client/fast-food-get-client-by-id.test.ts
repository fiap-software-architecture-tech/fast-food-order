import { AxiosError } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Client } from '#/domain/entities/client.entity';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { FastFoodGetClientById } from '#/infrastructure/gateways/fast-food-client/fast-food-get-client-by-id';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

vi.mock('#/infrastructure/config/env', () => ({
    env: { FAST_FOOD_API_URL: 'http://localhost:3000' },
}));

describe('FastFoodGetClientById', () => {
    const createHttpClientMock = (): IHttpClientService => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    });

    let loggerMock: ReturnType<typeof createLoggerMock>;
    let httpClientMock: IHttpClientService;
    let gateway: FastFoodGetClientById;

    beforeEach(() => {
        vi.clearAllMocks();
        loggerMock = createLoggerMock();
        httpClientMock = createHttpClientMock();
        gateway = new FastFoodGetClientById(loggerMock, httpClientMock);
    });

    const clientMock = new Client('client-123', 'John Doe', '12345678901', 'john@example.com');

    it('should return client when found', async () => {
        vi.spyOn(httpClientMock, 'get').mockResolvedValueOnce(clientMock);

        const result = await gateway.execute('client-123');

        expect(result).toEqual(clientMock);
        expect(httpClientMock.get).toHaveBeenCalledWith('http://localhost:3000/client/client-123/id');
        expect(loggerMock.info).toHaveBeenCalledWith('Client fetched successfully from external service', {
            id: 'client-123',
        });
    });

    it('should return null when client not found (404)', async () => {
        const axiosError = { response: { status: 404 } } as AxiosError;
        vi.spyOn(httpClientMock, 'get').mockRejectedValueOnce(axiosError);

        const result = await gateway.execute('non-existent');

        expect(result).toBeNull();
        expect(loggerMock.warn).toHaveBeenCalledWith('Client not found in external service', { id: 'non-existent' });
    });

    it('should throw error when external service fails', async () => {
        const axiosError = { response: { status: 500 }, message: 'Server error' } as AxiosError;
        vi.spyOn(httpClientMock, 'get').mockRejectedValueOnce(axiosError);

        await expect(gateway.execute('client-123')).rejects.toEqual(axiosError);

        expect(loggerMock.error).toHaveBeenCalledWith('Failed to fetch client from external service', axiosError, {
            id: 'client-123',
        });
    });
});
