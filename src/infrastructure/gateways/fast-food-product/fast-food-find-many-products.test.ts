import { AxiosError } from 'axios';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Product } from '#/domain/entities/product.entity';
import { IHttpClientService } from '#/domain/services/http-client.service';
import { FastFoodFindManyProducts } from '#/infrastructure/gateways/fast-food-product/fast-food-find-many-products';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

vi.mock('#/infrastructure/config/env', () => ({
    env: { FAST_FOOD_API_URL: 'http://localhost:3000' },
}));

describe('FastFoodFindManyProducts', () => {
    const createHttpClientMock = (): IHttpClientService => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
    });

    let loggerMock: ReturnType<typeof createLoggerMock>;
    let httpClientMock: IHttpClientService;
    let gateway: FastFoodFindManyProducts;

    beforeEach(() => {
        vi.clearAllMocks();
        loggerMock = createLoggerMock();
        httpClientMock = createHttpClientMock();
        gateway = new FastFoodFindManyProducts(loggerMock, httpClientMock);
    });

    const productsMock = [
        new Product('product-1', 'Hamburger', 1599, 'Delicious burger', { name: 'Food' }),
        new Product('product-2', 'Coca-Cola', 599, 'Refreshing drink', { name: 'Beverages' }),
    ];

    it('should return products when found', async () => {
        vi.spyOn(httpClientMock, 'post').mockResolvedValueOnce(productsMock);

        const result = await gateway.execute(['product-1', 'product-2']);

        expect(result).toEqual(productsMock);
        expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:3000/product/find-many', {
            ids: ['product-1', 'product-2'],
        });
        expect(loggerMock.info).toHaveBeenCalledWith('Client fetched successfully from external service', {
            ids: ['product-1', 'product-2'],
        });
    });

    it('should throw error when external service fails', async () => {
        const axiosError = { response: { status: 500 }, message: 'Server error' } as AxiosError;
        vi.spyOn(httpClientMock, 'post').mockRejectedValueOnce(axiosError);

        await expect(gateway.execute(['product-1'])).rejects.toEqual(axiosError);

        expect(loggerMock.error).toHaveBeenCalledWith('Failed to fetch products from fast-food service', axiosError, {
            productIds: ['product-1'],
            status: 500,
        });
    });
});
