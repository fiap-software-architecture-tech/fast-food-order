import { AxiosError } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Payment } from '#/domain/entities/payment.entity';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { FastFoodGetPayment } from '#/infrastructure/gateways/fast-food-payment/fast-food-get-payment';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

vi.mock('#/infrastructure/config/env', () => ({
    env: { FAST_FOOD_PAYMENT_API_URL: 'http://localhost:3001' },
}));

describe('FastFoodGetPayment', () => {
    const createHttpClientMock = (): IHttpClientService => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    });

    let loggerMock: ReturnType<typeof createLoggerMock>;
    let httpClientMock: IHttpClientService;
    let gateway: FastFoodGetPayment;

    beforeEach(() => {
        vi.clearAllMocks();
        loggerMock = createLoggerMock();
        httpClientMock = createHttpClientMock();
        gateway = new FastFoodGetPayment(loggerMock, httpClientMock);
    });

    const paymentMock = new Payment('payment-123', 'APPROVED', 'ext-ref-123', 'qr-code-data');

    it('should return payment when found', async () => {
        vi.spyOn(httpClientMock, 'get').mockResolvedValueOnce(paymentMock);

        const result = await gateway.execute('payment-123');

        expect(result).toEqual(paymentMock);
        expect(httpClientMock.get).toHaveBeenCalledWith('http://localhost:3001/payment/payment-123');
        expect(loggerMock.info).toHaveBeenCalledWith('Payment fetched successfully from external service', {
            id: 'payment-123',
        });
    });

    it('should throw error when external service fails', async () => {
        const axiosError = { response: { status: 500 }, message: 'Server error' } as AxiosError;
        vi.spyOn(httpClientMock, 'get').mockRejectedValueOnce(axiosError);

        await expect(gateway.execute('payment-123')).rejects.toEqual(axiosError);

        expect(loggerMock.error).toHaveBeenCalledWith(
            'Failed to fetch payment from fast-food-payment service',
            axiosError,
            { paymentId: 'payment-123', status: 500 },
        );
    });
});
