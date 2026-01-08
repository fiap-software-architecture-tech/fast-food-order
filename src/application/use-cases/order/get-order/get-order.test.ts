import { OrderStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GetOrder } from '#/application/use-cases/order/get-order/get-order';
import { Client } from '#/domain/entities/client.entity';
import { Order } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { NotFoundError } from '#/domain/errors';
import { IGetClientById } from '#/domain/gateways/client/get-client-by-id';
import { IGetPayment } from '#/domain/gateways/payment/get-payment';
import { ILogger } from '#/domain/services/logger.service';
import * as orderMock from '#/infrastructure/repositories/prisma/mocks/prisma-order-mock.repository';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

describe('GetOrder', () => {
    const createGetClientByIdGatewayMock = (): IGetClientById => ({
        execute: vi.fn(),
    });

    const createGetPaymentGatewayMock = (): IGetPayment => ({
        execute: vi.fn(),
    });

    let logger: ILogger;
    let orderRepository: orderMock.PrismaOrderMockRepository;
    let getClientByIdGateway: IGetClientById;
    let getPaymentGateway: IGetPayment;
    let getOrderUseCase: GetOrder;

    const clientMock = new Client('client-1', 'John Doe', '12345678901', 'john@example.com');
    const paymentMock = new Payment('payment-1', 'APPROVED', 'ext-ref-123', 'qr-code-data');

    beforeEach(() => {
        logger = createLoggerMock();
        orderRepository = new orderMock.PrismaOrderMockRepository();
        getClientByIdGateway = createGetClientByIdGatewayMock();
        getPaymentGateway = createGetPaymentGatewayMock();
        getOrderUseCase = new GetOrder(logger, orderRepository, getClientByIdGateway, getPaymentGateway);
    });

    it('should get an order by id with client and payment', async () => {
        const orderWithClient = new Order({
            id: 'order-1',
            clientId: 'client-1',
            paymentId: 'payment-1',
            totalAmount: 2599,
            orderNumber: 1001,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });

        orderMock.mockOrderFindById({ data: orderWithClient });
        vi.spyOn(getClientByIdGateway, 'execute').mockResolvedValueOnce(clientMock);
        vi.spyOn(getPaymentGateway, 'execute').mockResolvedValueOnce(paymentMock);

        const result = await getOrderUseCase.execute('order-1');

        expect(result).toMatchObject({
            id: 'order-1',
            clientId: 'client-1',
            paymentId: 'payment-1',
            totalAmount: 2599,
            orderNumber: 1001,
            status: OrderStatus.WAITING,
        });
        expect(result.client).toEqual(clientMock);
        expect(result.payment).toEqual(paymentMock);
        expect(getClientByIdGateway.execute).toHaveBeenCalledWith('client-1');
        expect(getPaymentGateway.execute).toHaveBeenCalledWith('payment-1');
        expect(logger.info).toHaveBeenCalledWith('Getting order', { orderId: 'order-1' });
        expect(logger.info).toHaveBeenCalledWith('Order retrieved', {
            orderId: 'order-1',
            orderNumber: 1001,
            status: OrderStatus.WAITING,
        });
    });

    it('should get an order without client', async () => {
        const orderWithoutClient = new Order({
            id: 'order-2',
            clientId: null,
            paymentId: 'payment-1',
            totalAmount: 1599,
            orderNumber: 1002,
            status: OrderStatus.RECEIVED,
            orderProducts: [],
        });

        orderMock.mockOrderFindById({ data: orderWithoutClient });
        vi.spyOn(getPaymentGateway, 'execute').mockResolvedValueOnce(paymentMock);

        const result = await getOrderUseCase.execute('order-2');

        expect(result).toMatchObject({
            id: 'order-2',
            clientId: null,
            totalAmount: 1599,
            status: OrderStatus.RECEIVED,
        });
        expect(result.payment).toEqual(paymentMock);
        expect(getClientByIdGateway.execute).not.toHaveBeenCalled();
        expect(getPaymentGateway.execute).toHaveBeenCalledWith('payment-1');
    });

    it('should get an order when client is not found', async () => {
        const orderWithClient = new Order({
            id: 'order-3',
            clientId: 'client-999',
            paymentId: 'payment-1',
            totalAmount: 2599,
            orderNumber: 1003,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });

        orderMock.mockOrderFindById({ data: orderWithClient });
        vi.spyOn(getClientByIdGateway, 'execute').mockResolvedValueOnce(null);
        vi.spyOn(getPaymentGateway, 'execute').mockResolvedValueOnce(paymentMock);

        const result = await getOrderUseCase.execute('order-3');

        expect(result.client).toBeUndefined();
        expect(result.payment).toEqual(paymentMock);
    });

    it('should throw NotFoundError if order does not exist', async () => {
        orderMock.mockOrderFindById({ empty: true });

        await expect(getOrderUseCase.execute('order-999')).rejects.toThrow(NotFoundError);
        expect(logger.warn).toHaveBeenCalledWith('Order not found', { orderId: 'order-999' });
    });
});
