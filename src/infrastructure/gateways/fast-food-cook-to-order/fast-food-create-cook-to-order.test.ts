import { AxiosError } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { CreateCookToOrderDTO } from '#/domain/gateways/cook-to-order/dto/create-cook-to-order.dto';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { FastFoodCreateCookToOrder } from '#/infrastructure/gateways/fast-food-cook-to-order/fast-food-create-cook-to-order';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

vi.mock('#/infrastructure/config/env', () => ({
    env: {
        FAST_FOOD_COOK_TO_ORDER_API_URL: 'http://localhost:3001',
    },
}));

describe('FastFoodCreateCookToOrder', () => {
    const createHttpClientMock = (): IHttpClientService => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    });

    let loggerMock: ReturnType<typeof createLoggerMock>;
    let httpClientMock: IHttpClientService;
    let gateway: FastFoodCreateCookToOrder;

    beforeEach(() => {
        vi.clearAllMocks();
        loggerMock = createLoggerMock();
        httpClientMock = createHttpClientMock();
        gateway = new FastFoodCreateCookToOrder(loggerMock, httpClientMock);
    });

    const mockRequest: CreateCookToOrderDTO = {
        orderId: 'order-123',
        orderProducts: [
            { name: 'Coca-Cola', quantity: 2 },
            { name: 'Hamburger', quantity: 1 },
        ],
    };

    describe('execute', () => {
        it('should successfully create cook to order in external service', async () => {
            vi.spyOn(httpClientMock, 'post').mockResolvedValueOnce(undefined);

            await gateway.execute(mockRequest);

            expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:3001/cook-to-order', mockRequest);
            expect(loggerMock.info).toHaveBeenCalledWith('Creating cook to order in external service', {
                request: mockRequest,
            });
            expect(loggerMock.info).toHaveBeenCalledWith('Cook to order created successfully in external service', {
                request: mockRequest,
            });
        });

        it('should log error and throw when external service fails', async () => {
            const axiosError = {
                response: { status: 500 },
                message: 'Internal Server Error',
            } as AxiosError;

            vi.spyOn(httpClientMock, 'post').mockRejectedValueOnce(axiosError);

            await expect(gateway.execute(mockRequest)).rejects.toEqual(axiosError);

            expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:3001/cook-to-order', mockRequest);
            expect(loggerMock.info).toHaveBeenCalledWith('Creating cook to order in external service', {
                request: mockRequest,
            });
            expect(loggerMock.error).toHaveBeenCalledWith(
                'Failed to create cook to order in fast-food service',
                axiosError,
                {
                    request: mockRequest,
                    status: 500,
                },
            );
        });

        it('should handle network errors without response', async () => {
            const networkError = {
                message: 'Network Error',
            } as AxiosError;

            vi.spyOn(httpClientMock, 'post').mockRejectedValueOnce(networkError);

            await expect(gateway.execute(mockRequest)).rejects.toEqual(networkError);

            expect(loggerMock.error).toHaveBeenCalledWith(
                'Failed to create cook to order in fast-food service',
                networkError,
                {
                    request: mockRequest,
                    status: undefined,
                },
            );
        });

        it('should handle empty order products', async () => {
            const emptyRequest: CreateCookToOrderDTO = {
                orderId: 'order-456',
                orderProducts: [],
            };

            vi.spyOn(httpClientMock, 'post').mockResolvedValueOnce(undefined);

            await gateway.execute(emptyRequest);

            expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:3001/cook-to-order', emptyRequest);
            expect(loggerMock.info).toHaveBeenCalledWith('Cook to order created successfully in external service', {
                request: emptyRequest,
            });
        });
    });
});
