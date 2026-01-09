import { AxiosError } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Client } from '#/domain/entities/client.entity';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { FastFoodGetClientByCpf } from '#/infrastructure/gateways/fast-food-client/fast-food-get-client-by-cpf';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

vi.mock('#/infrastructure/config/env', () => ({
    env: { FAST_FOOD_API_URL: 'http://localhost:3000' },
}));

describe('FastFoodGetClientByCpf', () => {
    const createHttpClientMock = (): IHttpClientService => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    });

    let loggerMock: ReturnType<typeof createLoggerMock>;
    let httpClientMock: IHttpClientService;
    let gateway: FastFoodGetClientByCpf;

    beforeEach(() => {
        vi.clearAllMocks();
        loggerMock = createLoggerMock();
        httpClientMock = createHttpClientMock();
        gateway = new FastFoodGetClientByCpf(loggerMock, httpClientMock);
    });

    const clientMock = new Client('client-123', 'John Doe', '12345678901', 'john@example.com');

    it('should return client when found', async () => {
        vi.spyOn(httpClientMock, 'get').mockResolvedValueOnce(clientMock);

        const result = await gateway.execute('12345678901');

        expect(result).toEqual(clientMock);
        expect(httpClientMock.get).toHaveBeenCalledWith('http://localhost:3000/client/12345678901/cpf');
        expect(loggerMock.info).toHaveBeenCalledWith('Client fetched successfully from external service', {
            cpf: '12345678901',
        });
    });

    it('should return null when client not found (404)', async () => {
        const axiosError = { response: { status: 404 } } as AxiosError;
        vi.spyOn(httpClientMock, 'get').mockRejectedValueOnce(axiosError);

        const result = await gateway.execute('99999999999');

        expect(result).toBeNull();
        expect(loggerMock.warn).toHaveBeenCalledWith('Client not found in external service', { cpf: '99999999999' });
    });

    it('should throw error when external service fails', async () => {
        const axiosError = { response: { status: 500 }, message: 'Server error' } as AxiosError;
        vi.spyOn(httpClientMock, 'get').mockRejectedValueOnce(axiosError);

        await expect(gateway.execute('12345678901')).rejects.toEqual(axiosError);

        expect(loggerMock.error).toHaveBeenCalledWith('Failed to fetch client from external service', axiosError, {
            cpf: '12345678901',
        });
    });
});
