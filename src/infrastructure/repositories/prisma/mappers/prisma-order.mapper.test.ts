import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Order } from '#/domain/entities/order.entity';
import { PrismaOrderMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-order.mapper';

describe('PrismaOrderMapper', () => {
    const mockOrderProduct = {
        id: 'order-product-123',
        orderId: 'order-123',
        productId: 'product-123',
        name: 'Coca-Cola',
        description: 'Refreshing soft drink',
        category: 'Beverages',
        unitPrice: 599,
        quantity: 2,
        subtotal: 1198,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockOrderData = {
        id: 'order-123',
        clientId: 'client-123',
        paymentId: 'payment-123',
        totalAmount: 1198,
        orderNumber: 1001,
        status: OrderStatus.WAITING,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderProducts: [mockOrderProduct],
    };

    describe('toDomain', () => {
        it('should map prisma order data to domain Order entity', () => {
            const order = PrismaOrderMapper.toDomain(mockOrderData);

            expect(order).toBeInstanceOf(Order);
            expect(order.id).toBe(mockOrderData.id);
            expect(order.clientId).toBe(mockOrderData.clientId);
            expect(order.paymentId).toBe(mockOrderData.paymentId);
            expect(order.totalAmount).toBe(mockOrderData.totalAmount);
            expect(order.orderNumber).toBe(mockOrderData.orderNumber);
            expect(order.status).toBe(mockOrderData.status);
            expect(order.orderProducts).toHaveLength(1);
            expect(order.orderProducts[0]).toBeInstanceOf(OrderProduct);
            expect(order.orderProducts[0].productId).toBe(mockOrderProduct.productId);
        });

        it('should map prisma order data without clientId and paymentId', () => {
            const orderDataWithoutIds = {
                ...mockOrderData,
                clientId: null,
                paymentId: null,
            };

            const order = PrismaOrderMapper.toDomain(orderDataWithoutIds);

            expect(order).toBeInstanceOf(Order);
            expect(order.clientId).toBeNull();
            expect(order.paymentId).toBeNull();
        });

        it('should map prisma order data with empty orderProducts', () => {
            const orderDataEmpty = {
                id: 'order-456',
                clientId: null,
                paymentId: null,
                totalAmount: 0,
                orderNumber: 1002,
                status: OrderStatus.WAITING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const order = PrismaOrderMapper.toDomain(orderDataEmpty);

            expect(order).toBeInstanceOf(Order);
            expect(order.orderProducts).toEqual([]);
        });
    });

    describe('toCreate', () => {
        it('should map domain Order to Prisma create input', () => {
            const orderProduct = new OrderProduct({
                productId: 'product-123',
                name: 'Coca-Cola',
                description: 'Refreshing soft drink',
                category: 'Beverages',
                unitPrice: 599,
                quantity: 2,
                subtotal: 1198,
            });

            const order = new Order({
                clientId: 'client-123',
                paymentId: 'payment-123',
                totalAmount: 1198,
                orderNumber: 1001,
                status: OrderStatus.WAITING,
                orderProducts: [orderProduct],
            });

            const createInput = PrismaOrderMapper.toCreate(order);

            expect(createInput.clientId).toBe('client-123');
            expect(createInput.paymentId).toBe('payment-123');
            expect(createInput.totalAmount).toBe(1198);
            expect(createInput.orderProducts).toBeDefined();
            expect(createInput.orderProducts?.create).toHaveLength(1);
            expect(Array.isArray(createInput.orderProducts?.create)).toBe(true);
            const createArray = createInput.orderProducts?.create as any[];
            expect(createArray[0].productId).toBe('product-123');
            expect(createArray[0].name).toBe('Coca-Cola');
            expect(createArray[0].unitPrice).toBe(599);
            expect(createArray[0].quantity).toBe(2);
            expect(createArray[0].subtotal).toBe(1198);
        });

        it('should map domain Order without clientId and paymentId to Prisma create input', () => {
            const order = new Order({
                clientId: null,
                paymentId: null,
                totalAmount: 1198,
                orderNumber: 1001,
                status: OrderStatus.WAITING,
                orderProducts: [],
            });

            const createInput = PrismaOrderMapper.toCreate(order);

            expect(createInput.clientId).toBeNull();
            expect(createInput.paymentId).toBeNull();
            expect(createInput.totalAmount).toBe(1198);
            expect(createInput.orderProducts?.create).toEqual([]);
        });

        it('should map domain Order with empty orderProducts', () => {
            const order = new Order({
                clientId: 'client-123',
                paymentId: null,
                totalAmount: 0,
                orderNumber: 1001,
                status: OrderStatus.WAITING,
                orderProducts: [],
            });

            const createInput = PrismaOrderMapper.toCreate(order);

            expect(createInput.orderProducts?.create).toEqual([]);
        });
    });
});
