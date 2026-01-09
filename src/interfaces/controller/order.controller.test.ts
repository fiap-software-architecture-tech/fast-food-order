import { OrderStatus } from '@prisma/client';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { ICreateOrderUseCase } from '#/application/use-cases/order/create-order/create-order.use-case';
import { IGetOrderUseCase } from '#/application/use-cases/order/get-order/get-order.use-case';
import { IListOrderUseCase } from '#/application/use-cases/order/list-order/list-order.use-case';
import { IPaymentApprovedUseCase } from '#/application/use-cases/order/payment-approved/payment-approved.use-case';
import { IPaymentFailedUseCase } from '#/application/use-cases/order/payment-failed/payment-failed.use-case';
import { IUpdateOrderStatusUseCase } from '#/application/use-cases/order/update-order-status/update-order-status.use-case';
import { Client } from '#/domain/entities/client.entity';
import { Order } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';
import { OrderController } from '#/interfaces/controller/order.controller';

describe('OrderController', () => {
    const createOrderUseCaseMock = (): ICreateOrderUseCase => ({ execute: vi.fn() });
    const getOrderUseCaseMock = (): IGetOrderUseCase => ({ execute: vi.fn() });
    const listOrderUseCaseMock = (): IListOrderUseCase => ({ execute: vi.fn() });
    const updateOrderStatusUseCaseMock = (): IUpdateOrderStatusUseCase => ({ execute: vi.fn() });
    const paymentApprovedUseCaseMock = (): IPaymentApprovedUseCase => ({ execute: vi.fn() });
    const paymentFailedUseCaseMock = (): IPaymentFailedUseCase => ({ execute: vi.fn() });

    const loggerMock = createLoggerMock();
    const createOrderUseCase = createOrderUseCaseMock();
    const getOrderUseCase = getOrderUseCaseMock();
    const listOrderUseCase = listOrderUseCaseMock();
    const updateOrderStatusUseCase = updateOrderStatusUseCaseMock();
    const paymentApprovedUseCase = paymentApprovedUseCaseMock();
    const paymentFailedUseCase = paymentFailedUseCaseMock();

    const controller = new OrderController(
        loggerMock,
        createOrderUseCase,
        getOrderUseCase,
        listOrderUseCase,
        updateOrderStatusUseCase,
        paymentApprovedUseCase,
        paymentFailedUseCase,
    );

    const orderMock = new Order({
        id: 'order-123',
        clientId: 'client-456',
        paymentId: 'payment-789',
        totalAmount: 1599,
        orderNumber: 1001,
        status: OrderStatus.WAITING,
        orderProducts: [],
        payment: new Payment('payment-789', 'PENDING', 'ext-ref', 'qr-code'),
    });

    const clientMock = new Client('client-456', 'John Doe', '12345678901', 'john@example.com');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('should create an order', async () => {
            vi.spyOn(createOrderUseCase, 'execute').mockResolvedValueOnce(orderMock);

            const request = { orderProducts: [{ productId: 'product-1', quantity: 1 }] };
            const result = await controller.create(request, clientMock);

            expect(createOrderUseCase.execute).toHaveBeenCalledWith(request, clientMock);
            expect(result.id).toBe('order-123');
            expect(loggerMock.info).toHaveBeenCalledWith('Creating a new order', { request, client: clientMock });
        });
    });

    describe('get', () => {
        it('should get an order by id', async () => {
            vi.spyOn(getOrderUseCase, 'execute').mockResolvedValueOnce(orderMock);

            const result = await controller.get('order-123');

            expect(getOrderUseCase.execute).toHaveBeenCalledWith('order-123');
            expect(result.id).toBe('order-123');
            expect(loggerMock.info).toHaveBeenCalledWith('Retrieving order with ID', { id: 'order-123' });
        });
    });

    describe('list', () => {
        it('should list orders', async () => {
            vi.spyOn(listOrderUseCase, 'execute').mockResolvedValueOnce([orderMock]);

            const query = { page: 1, limit: 10 };
            const result = await controller.list(query);

            expect(listOrderUseCase.execute).toHaveBeenCalledWith(query);
            expect(result).toHaveLength(1);
            expect(loggerMock.info).toHaveBeenCalledWith('Listing orders with query', { query });
        });
    });

    describe('updateStatus', () => {
        it('should update order status', async () => {
            vi.spyOn(updateOrderStatusUseCase, 'execute').mockResolvedValueOnce();

            const result = await controller.updateStatus('order-123', { status: 'RECEIVED' });

            expect(updateOrderStatusUseCase.execute).toHaveBeenCalledWith('order-123', 'RECEIVED');
            expect(result).toEqual({ message: 'Order status updated successfully' });
            expect(loggerMock.info).toHaveBeenCalledWith('Updating order status with ID', {
                id: 'order-123',
                request: { status: 'RECEIVED' },
            });
        });
    });

    describe('paymentApproved', () => {
        it('should process payment approved', async () => {
            vi.spyOn(paymentApprovedUseCase, 'execute').mockResolvedValueOnce();

            await controller.paymentApproved('order-123');

            expect(paymentApprovedUseCase.execute).toHaveBeenCalledWith('order-123');
            expect(loggerMock.info).toHaveBeenCalledWith('Processing payment approved for order ID', {
                id: 'order-123',
            });
        });
    });

    describe('paymentFailed', () => {
        it('should process payment failed', async () => {
            vi.spyOn(paymentFailedUseCase, 'execute').mockResolvedValueOnce();

            await controller.paymentFailed('order-123');

            expect(paymentFailedUseCase.execute).toHaveBeenCalledWith('order-123');
            expect(loggerMock.info).toHaveBeenCalledWith('Processing payment failed for order ID', {
                id: 'order-123',
            });
        });
    });
});
