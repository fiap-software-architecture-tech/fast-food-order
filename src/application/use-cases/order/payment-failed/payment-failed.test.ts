import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { PaymentFailed } from '#/application/use-cases/order/payment-failed/payment-failed';
import { Order } from '#/domain/entities/order.entity';
import { NotFoundError } from '#/domain/errors';
import * as orderMock from '#/infrastructure/repositories/prisma/mocks/prisma-order-mock.repository';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

describe('PaymentFailed', () => {
    const logger = createLoggerMock();
    const orderRepository = new orderMock.PrismaOrderMockRepository();

    const paymentFailedUseCase = new PaymentFailed(logger, orderRepository);

    it('should update order status after payment failed', async () => {
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

        await paymentFailedUseCase.execute('order-1');

        expect(updateMock).toHaveBeenCalledWith(
            'order-1',
            expect.objectContaining({
                status: OrderStatus.CANCELED,
            }),
        );
        expect(logger.info).toHaveBeenCalledWith('Updating order status to payment failed', { orderId: 'order-1' });
        expect(logger.info).toHaveBeenCalledWith('Order status updated successfully', {
            orderId: 'order-1',
            orderNumber: existingOrder.orderNumber,
        });
    });

    it('should throw NotFoundError if order does not exist', async () => {
        orderMock.mockOrderFindById({ empty: true });

        await expect(paymentFailedUseCase.execute('order-999')).rejects.toThrow(NotFoundError);
        expect(logger.warn).toHaveBeenCalledWith('Order not found', { orderId: 'order-999' });
    });
});
