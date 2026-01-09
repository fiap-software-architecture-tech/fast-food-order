import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Order } from '#/domain/entities/order.entity';
import { CreateCookToOrderMapper } from '#/infrastructure/gateways/fast-food-cook-to-order/mapper/create-cook-to-order.mapper';

describe('CreateCookToOrderMapper', () => {
    describe('toGatewayMapper', () => {
        it('should map order to CreateCookToOrderDTO', () => {
            const orderProducts = [
                new OrderProduct({
                    id: 'product-1',
                    productId: 'original-product-1',
                    name: 'Coca-Cola',
                    description: 'Refreshing beverage',
                    category: 'Beverages',
                    unitPrice: 599,
                    quantity: 2,
                    subtotal: 1198,
                }),
                new OrderProduct({
                    id: 'product-2',
                    productId: 'original-product-2',
                    name: 'Hamburger',
                    description: 'Delicious burger',
                    category: 'Food',
                    unitPrice: 1599,
                    quantity: 1,
                    subtotal: 1599,
                }),
            ];

            const order = new Order({
                id: 'order-123',
                clientId: 'client-456',
                paymentId: 'payment-789',
                totalAmount: 2797,
                orderNumber: 1001,
                status: OrderStatus.IN_PROGRESS,
                orderProducts,
            });

            const result = CreateCookToOrderMapper.toGatewayMapper(order);

            expect(result).toEqual({
                orderId: 'order-123',
                orderProducts: [
                    { name: 'Coca-Cola', quantity: 2 },
                    { name: 'Hamburger', quantity: 1 },
                ],
            });
        });

        it('should map order with empty products', () => {
            const order = new Order({
                id: 'order-456',
                clientId: null,
                paymentId: 'payment-123',
                totalAmount: 0,
                orderNumber: 1002,
                status: OrderStatus.RECEIVED,
                orderProducts: [],
            });

            const result = CreateCookToOrderMapper.toGatewayMapper(order);

            expect(result).toEqual({
                orderId: 'order-456',
                orderProducts: [],
            });
        });

        it('should map order with single product', () => {
            const orderProducts = [
                new OrderProduct({
                    id: 'product-1',
                    productId: 'original-product-1',
                    name: 'French Fries',
                    description: 'Crispy fries',
                    category: 'Sides',
                    unitPrice: 499,
                    quantity: 3,
                    subtotal: 1497,
                }),
            ];

            const order = new Order({
                id: 'order-789',
                clientId: 'client-123',
                paymentId: 'payment-456',
                totalAmount: 1497,
                orderNumber: 1003,
                status: OrderStatus.WAITING,
                orderProducts,
            });

            const result = CreateCookToOrderMapper.toGatewayMapper(order);

            expect(result).toEqual({
                orderId: 'order-789',
                orderProducts: [{ name: 'French Fries', quantity: 3 }],
            });
        });

        it('should only include name and quantity from order products', () => {
            const orderProducts = [
                new OrderProduct({
                    id: 'product-1',
                    productId: 'original-product-1',
                    name: 'Ice Cream',
                    description: 'Vanilla flavor',
                    category: 'Desserts',
                    unitPrice: 799,
                    quantity: 5,
                    subtotal: 3995,
                }),
            ];

            const order = new Order({
                id: 'order-999',
                clientId: 'client-999',
                paymentId: 'payment-999',
                totalAmount: 3995,
                orderNumber: 1004,
                status: OrderStatus.DONE,
                orderProducts,
            });

            const result = CreateCookToOrderMapper.toGatewayMapper(order);

            expect(result.orderProducts[0]).toEqual({
                name: 'Ice Cream',
                quantity: 5,
            });
            expect(result.orderProducts[0]).not.toHaveProperty('description');
            expect(result.orderProducts[0]).not.toHaveProperty('category');
            expect(result.orderProducts[0]).not.toHaveProperty('unitPrice');
            expect(result.orderProducts[0]).not.toHaveProperty('subtotal');
        });
    });
});
