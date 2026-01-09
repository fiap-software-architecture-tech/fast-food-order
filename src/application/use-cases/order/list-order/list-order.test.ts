import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { ListOrder } from '#/application/use-cases/order/list-order/list-order';
import { Order } from '#/domain/entities/order.entity';
import * as orderMock from '#/infrastructure/repositories/prisma/mocks/prisma-order-mock.repository';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

describe('ListOrder', () => {
    const logger = createLoggerMock();
    const orderRepository = new orderMock.PrismaOrderMockRepository();

    const listOrderUseCase = new ListOrder(logger, orderRepository);

    const orderMockData = new Order({
        id: 'order-1',
        clientId: 'client-1',
        paymentId: 'payment-1',
        totalAmount: 2599,
        orderNumber: 1001,
        status: OrderStatus.WAITING,
        orderProducts: [],
    });

    it('should list orders', async () => {
        const listMock = orderMock.mockOrderList({ data: [orderMockData] });

        const result = await listOrderUseCase.execute({ page: 1, limit: 10 });

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: 'order-1',
            clientId: 'client-1',
            paymentId: 'payment-1',
            totalAmount: 2599,
            orderNumber: 1001,
            status: OrderStatus.WAITING,
        });
        expect(listMock).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Listing orders', {
            filters: { page: 1, limit: 10 },
        });
        expect(logger.info).toHaveBeenCalledWith('Orders listed successfully', { count: 1 });
    });

    it('should list orders with status filter', async () => {
        const listMock = orderMock.mockOrderList({ data: [orderMockData] });

        const result = await listOrderUseCase.execute({ status: 'WAITING', page: 1, limit: 10 });

        expect(result).toHaveLength(1);
        expect(listMock).toHaveBeenCalledWith({
            status: [OrderStatus.WAITING],
            page: 1,
            limit: 10,
        });
    });

    it('should list orders with clientId filter', async () => {
        const listMock = orderMock.mockOrderList({ data: [orderMockData] });

        const result = await listOrderUseCase.execute({
            clientId: 'client-1',
            page: 1,
            limit: 10,
        });

        expect(result).toHaveLength(1);
        expect(listMock).toHaveBeenCalledWith({
            clientId: 'client-1',
            status: undefined,
            page: 1,
            limit: 10,
        });
    });

    it('should list orders with productId filter', async () => {
        const listMock = orderMock.mockOrderList({ data: [orderMockData] });

        const result = await listOrderUseCase.execute({
            productId: 'product-1',
            page: 1,
            limit: 10,
        });

        expect(result).toHaveLength(1);
        expect(listMock).toHaveBeenCalledWith({
            productId: 'product-1',
            status: undefined,
            page: 1,
            limit: 10,
        });
    });

    it('should return empty array when no orders exist', async () => {
        orderMock.mockOrderList({ data: [] });

        const result = await listOrderUseCase.execute({ page: 1, limit: 10 });

        expect(result).toHaveLength(0);
        expect(logger.info).toHaveBeenCalledWith('Orders listed successfully', { count: 0 });
    });
});
