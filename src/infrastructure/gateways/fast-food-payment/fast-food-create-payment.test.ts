import { AxiosError } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Payment } from '#/domain/entities/payment.entity';
import { CreatePaymentDTO } from '#/domain/gateways/payment/dto/create-payment.dto';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { FastFoodCreatePayment } from '#/infrastructure/gateways/fast-food-payment/fast-food-create-payment';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

vi.mock('#/infrastructure/config/env', () => ({
    env: { FAST_FOOD_PAYMENT_API_URL: 'http://localhost:3001' },
}));

describe('FastFoodCreatePayment', () => {
    const createHttpClientMock = (): IHttpClientService => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    });

    let loggerMock: ReturnType<typeof createLoggerMock>;
    let httpClientMock: IHttpClientService;
    let gateway: FastFoodCreatePayment;

    beforeEach(() => {
        vi.clearAllMocks();
        loggerMock = createLoggerMock();
        httpClientMock = createHttpClientMock();
        gateway = new FastFoodCreatePayment(loggerMock, httpClientMock);
    });

    const mockRequest: CreatePaymentDTO = {
        orderId: 'order-123',
        totalAmount: 1599,
        orderProducts: [
            {
                productId: 'product-1',
                name: 'Hamburger',
                category: 'Food',
                unitPrice: 1599,
                quantity: 1,
                subtotal: 1599,
            },
        ],
    };

    const paymentMock = new Payment('payment-123', 'PENDING', 'ext-ref-123', 'qr-code-data');

    it('should create payment successfully', async () => {
        vi.spyOn(httpClientMock, 'post').mockResolvedValueOnce(paymentMock);

        const result = await gateway.execute(mockRequest);

        expect(result).toEqual(paymentMock);
        expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:3001/payment', mockRequest);
        expect(loggerMock.info).toHaveBeenCalledWith('Payment created successfully in external service', {
            request: mockRequest,
        });
    });

    it('should throw error when external service fails', async () => {
        const axiosError = { response: { status: 500 }, message: 'Server error' } as AxiosError;
        vi.spyOn(httpClientMock, 'post').mockRejectedValueOnce(axiosError);

        await expect(gateway.execute(mockRequest)).rejects.toEqual(axiosError);

        expect(loggerMock.error).toHaveBeenCalledWith('Failed to create payment in fast-food service', axiosError, {
            request: mockRequest,
            status: 500,
        });
    });
});
