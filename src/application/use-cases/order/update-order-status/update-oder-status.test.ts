import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { UpdateOrderStatus } from '#/application/use-cases/order/update-order-status/update-order-status';
import { Order } from '#/domain/entities/order.entity';
import { BusinessError, NotFoundError } from '#/domain/errors';
import * as orderMock from '#/infrastructure/repositories/prisma/mocks/prisma-order-mock.repository';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

describe('UpdateOrderStatus', () => {
    const logger = createLoggerMock();
    const orderRepository = new orderMock.PrismaOrderMockRepository();

    const updateOrderStatusUseCase = new UpdateOrderStatus(logger, orderRepository);

    it('should update order status from WAITING to RECEIVED', async () => {
        const existingOrder = new Order({
            id: 'order-1',
            clientId: 'client-1',
            paymentId: 'payment-1',
            totalAmount: 2599,
            orderNumber: 1001,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });

        const updateMock = orderMock.mockOrderUpdateStatus();

        await updateOrderStatusUseCase.execute('order-1', OrderStatus.RECEIVED);

        expect(updateMock).toHaveBeenCalledWith(
            'order-1',
            expect.objectContaining({
                status: OrderStatus.RECEIVED,
            }),
        );
        expect(logger.info).toHaveBeenCalledWith('Updating order status', {
            orderId: 'order-1',
            newStatus: OrderStatus.RECEIVED,
        });
        expect(logger.info).toHaveBeenCalledWith('Order status updated successfully', {
            orderId: 'order-1',
            orderNumber: 1001,
            oldStatus: OrderStatus.WAITING,
            newStatus: OrderStatus.RECEIVED,
        });
    });

    it('should update order status from RECEIVED to IN_PROGRESS', async () => {
        const existingOrder = new Order({
            id: 'order-2',
            clientId: null,
            paymentId: 'payment-2',
            totalAmount: 3599,
            orderNumber: 1002,
            status: OrderStatus.RECEIVED,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });
        orderMock.mockOrderUpdateStatus();

        await updateOrderStatusUseCase.execute('order-2', OrderStatus.IN_PROGRESS);

        expect(logger.info).toHaveBeenCalledWith('Order status updated successfully', {
            orderId: 'order-2',
            orderNumber: 1002,
            oldStatus: OrderStatus.RECEIVED,
            newStatus: OrderStatus.IN_PROGRESS,
        });
    });

    it('should update order status from IN_PROGRESS to DONE', async () => {
        const existingOrder = new Order({
            id: 'order-3',
            clientId: 'client-1',
            paymentId: 'payment-3',
            totalAmount: 1599,
            orderNumber: 1003,
            status: OrderStatus.IN_PROGRESS,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });
        orderMock.mockOrderUpdateStatus();

        await updateOrderStatusUseCase.execute('order-3', OrderStatus.DONE);

        expect(logger.info).toHaveBeenCalledWith('Order status updated successfully', {
            orderId: 'order-3',
            orderNumber: 1003,
            oldStatus: OrderStatus.IN_PROGRESS,
            newStatus: OrderStatus.DONE,
        });
    });

    it('should update order status from DONE to FINISHED', async () => {
        const existingOrder = new Order({
            id: 'order-4',
            clientId: null,
            paymentId: 'payment-4',
            totalAmount: 4599,
            orderNumber: 1004,
            status: OrderStatus.DONE,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });
        orderMock.mockOrderUpdateStatus();

        await updateOrderStatusUseCase.execute('order-4', OrderStatus.FINISHED);

        expect(logger.info).toHaveBeenCalledWith('Order status updated successfully', {
            orderId: 'order-4',
            orderNumber: 1004,
            oldStatus: OrderStatus.DONE,
            newStatus: OrderStatus.FINISHED,
        });
    });

    it('should throw NotFoundError if order does not exist', async () => {
        orderMock.mockOrderFindById({ empty: true });

        await expect(updateOrderStatusUseCase.execute('order-999', OrderStatus.RECEIVED)).rejects.toThrow(
            NotFoundError,
        );
        expect(logger.warn).toHaveBeenCalledWith('Order not found for status update', { orderId: 'order-999' });
    });

    it('should throw BusinessError for invalid status transition from WAITING to FINISHED', async () => {
        const existingOrder = new Order({
            id: 'order-5',
            clientId: 'client-1',
            paymentId: 'payment-5',
            totalAmount: 2599,
            orderNumber: 1005,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });

        await expect(updateOrderStatusUseCase.execute('order-5', OrderStatus.FINISHED)).rejects.toThrow(BusinessError);
    });

    it('should throw BusinessError for invalid status transition from FINISHED to WAITING', async () => {
        const existingOrder = new Order({
            id: 'order-6',
            clientId: null,
            paymentId: 'payment-6',
            totalAmount: 1599,
            orderNumber: 1006,
            status: OrderStatus.FINISHED,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });

        await expect(updateOrderStatusUseCase.execute('order-6', OrderStatus.WAITING)).rejects.toThrow(BusinessError);
    });

    it('should allow status transition from WAITING to CANCELED', async () => {
        const existingOrder = new Order({
            id: 'order-7',
            clientId: 'client-1',
            paymentId: 'payment-7',
            totalAmount: 2599,
            orderNumber: 1007,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });
        orderMock.mockOrderFindById({ data: existingOrder });
        orderMock.mockOrderUpdateStatus();

        await updateOrderStatusUseCase.execute('order-7', OrderStatus.CANCELED);

        expect(logger.info).toHaveBeenCalledWith('Order status updated successfully', {
            orderId: 'order-7',
            orderNumber: 1007,
            oldStatus: OrderStatus.WAITING,
            newStatus: OrderStatus.CANCELED,
        });
    });
});
