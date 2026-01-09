import { OrderStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';

import { PaymentApproved } from '#/application/use-cases/order/payment-approved/payment-approved';
import { Order } from '#/domain/entities/order.entity';
import { NotFoundError } from '#/domain/errors';
import { ICreateCookToOrder } from '#/domain/gateways/cook-to-order/create-cook-to-order';
import * as orderMock from '#/infrastructure/repositories/prisma/mocks/prisma-order-mock.repository';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

describe('PaymentApproved', () => {
    const createCreateCookToOrderGatewayMock = (): ICreateCookToOrder => ({
        execute: vi.fn(),
    });

    const logger = createLoggerMock();
    const orderRepository = new orderMock.PrismaOrderMockRepository();
    const createCookToOrderGateway = createCreateCookToOrderGatewayMock();

    const paymentApprovedUseCase = new PaymentApproved(logger, orderRepository, createCookToOrderGateway);

    it('should notify cook to order after payment approved', async () => {
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

        await paymentApprovedUseCase.execute('order-1');

        expect(logger.info).toHaveBeenCalledWith('Notified cook to order after payment approved', {
            orderId: 'order-1',
        });
        expect(createCookToOrderGateway.execute).toHaveBeenCalledWith({
            orderId: 'order-1',
            orderProducts: [],
        });
        expect(logger.info).toHaveBeenCalledWith('Cook to order notified successfully', {
            orderId: 'order-1',
            orderNumber: 1001,
        });
    });

    it('should throw NotFoundError if order does not exist', async () => {
        orderMock.mockOrderFindById({ empty: true });

        await expect(paymentApprovedUseCase.execute('order-999')).rejects.toThrow(NotFoundError);
        expect(logger.warn).toHaveBeenCalledWith('Order not found', { orderId: 'order-999' });
    });
});
