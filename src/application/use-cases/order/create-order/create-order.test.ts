import { OrderStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';

import { CreateOrder } from '#/application/use-cases/order/create-order/create-order';
import { Client } from '#/domain/entities/client.entity';
import { Order } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { Product } from '#/domain/entities/product.entity';
import { ICreatePayment } from '#/domain/gateways/payment/create-payment';
import { IFindManyProducts } from '#/domain/gateways/product/find-many-products';
import { ProductValidatorService } from '#/domain/services/product-validator.service';
import * as orderMock from '#/infrastructure/repositories/prisma/mocks/prisma-order-mock.repository';
import { createLoggerMock } from '#/infrastructure/services/mocks/logger-mock.service';

describe('CreateOrder', () => {
    const createFindManyProductsGatewayMock = (): IFindManyProducts => ({
        execute: vi.fn(),
    });

    const createProductValidatorMock = (): ProductValidatorService =>
        ({
            validateAllProductsExist: vi.fn(),
        }) as any;

    const createCreatePaymentGatewayMock = (): ICreatePayment => ({
        execute: vi.fn(),
    });

    const logger = createLoggerMock();
    const orderRepository = new orderMock.PrismaOrderMockRepository();
    const findManyProductsGateway = createFindManyProductsGatewayMock();
    const productValidator = createProductValidatorMock();
    const createPaymentGateway = createCreatePaymentGatewayMock();

    const createOrderUseCase = new CreateOrder(
        logger,
        orderRepository,
        findManyProductsGateway,
        productValidator,
        createPaymentGateway,
    );

    const productMock = new Product('product-1', 'Coca-Cola', 599, 'Refreshing beverage', { name: 'Beverages' });

    const paymentMock = new Payment('payment-1', 'PENDING', 'ext-ref-123', 'qr-code-data');

    const clientMock = new Client('client-1', 'John Doe', '12345678901', 'john@example.com');

    it('should create an order without client', async () => {
        vi.spyOn(findManyProductsGateway, 'execute').mockResolvedValueOnce([productMock]);
        vi.spyOn(productValidator, 'validateAllProductsExist').mockReturnValueOnce(undefined);
        vi.spyOn(createPaymentGateway, 'execute').mockResolvedValueOnce(paymentMock);

        const savedOrder = new Order({
            id: 'order-1',
            clientId: null,
            paymentId: 'payment-1',
            totalAmount: 1198,
            orderNumber: 1001,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });
        orderMock.mockOrderCreate({ data: savedOrder });

        const result = await createOrderUseCase.execute({
            orderProducts: [{ productId: 'product-1', quantity: 2 }],
        });

        expect(result).toMatchObject({
            id: 'order-1',
            clientId: null,
            paymentId: 'payment-1',
            totalAmount: 1198,
            orderNumber: 1001,
            status: OrderStatus.WAITING,
        });
        expect(result.payment).toEqual(paymentMock);
        expect(findManyProductsGateway.execute).toHaveBeenCalledWith(['product-1']);
        expect(productValidator.validateAllProductsExist).toHaveBeenCalledWith(['product-1'], [productMock]);
        expect(createPaymentGateway.execute).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Creating order', { clientId: undefined, productsCount: 1 });
        expect(logger.info).toHaveBeenCalledWith('Order created', {
            orderId: 'order-1',
            orderNumber: 1001,
            paymentId: 'payment-1',
        });
    });

    it('should create an order with a client', async () => {
        vi.spyOn(findManyProductsGateway, 'execute').mockResolvedValueOnce([productMock]);
        vi.spyOn(productValidator, 'validateAllProductsExist').mockReturnValueOnce(undefined);
        vi.spyOn(createPaymentGateway, 'execute').mockResolvedValueOnce(paymentMock);

        const savedOrder = new Order({
            id: 'order-2',
            clientId: 'client-1',
            paymentId: 'payment-1',
            totalAmount: 599,
            orderNumber: 1002,
            status: OrderStatus.WAITING,
            orderProducts: [],
        });
        orderMock.mockOrderCreate({ data: savedOrder });

        const result = await createOrderUseCase.execute(
            {
                orderProducts: [{ productId: 'product-1', quantity: 1 }],
            },
            clientMock,
        );

        expect(result).toMatchObject({
            id: 'order-2',
            clientId: 'client-1',
            totalAmount: 599,
            status: OrderStatus.WAITING,
        });
        expect(result.client).toEqual(clientMock);
        expect(result.payment).toEqual(paymentMock);
        expect(logger.info).toHaveBeenCalledWith('Creating order', { clientId: 'client-1', productsCount: 1 });
    });
});
