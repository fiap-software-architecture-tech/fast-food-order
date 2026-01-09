import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Order } from '#/domain/entities/order.entity';
import { CreatePaymentMapper } from '#/infrastructure/gateways/fast-food-payment/mapper/create-payment.mapper';

describe('CreatePaymentMapper', () => {
    describe('toGatewayMapper', () => {
        it('should map order to CreatePaymentDTO', () => {
            const orderProducts = [
                new OrderProduct({
                    id: 'op-1',
                    productId: 'product-1',
                    name: 'Hamburger',
                    description: 'Delicious burger',
                    category: 'Food',
                    unitPrice: 1599,
                    quantity: 2,
                    subtotal: 3198,
                }),
            ];

            const order = new Order({
                id: 'order-123',
                clientId: 'client-456',
                paymentId: null,
                totalAmount: 3198,
                orderNumber: 1001,
                status: OrderStatus.WAITING,
                orderProducts,
            });

            const result = CreatePaymentMapper.toGatewayMapper(order);

            expect(result).toEqual({
                orderId: 'order-123',
                totalAmount: 3198,
                orderProducts: [
                    {
                        productId: 'product-1',
                        name: 'Hamburger',
                        category: 'Food',
                        unitPrice: 1599,
                        quantity: 2,
                        subtotal: 3198,
                        description: 'Delicious burger',
                    },
                ],
            });
        });

        it('should map order without product description', () => {
            const orderProducts = [
                new OrderProduct({
                    id: 'op-1',
                    productId: 'product-1',
                    name: 'French Fries',
                    description: null,
                    category: 'Sides',
                    unitPrice: 599,
                    quantity: 1,
                    subtotal: 599,
                }),
            ];

            const order = new Order({
                id: 'order-456',
                clientId: null,
                paymentId: null,
                totalAmount: 599,
                orderNumber: 1002,
                status: OrderStatus.WAITING,
                orderProducts,
            });

            const result = CreatePaymentMapper.toGatewayMapper(order);

            expect(result.orderProducts[0]).not.toHaveProperty('description');
        });

        it('should map order with empty products', () => {
            const order = new Order({
                id: 'order-789',
                clientId: null,
                paymentId: null,
                totalAmount: 0,
                orderNumber: 1003,
                status: OrderStatus.WAITING,
                orderProducts: [],
            });

            const result = CreatePaymentMapper.toGatewayMapper(order);

            expect(result).toEqual({
                orderId: 'order-789',
                totalAmount: 0,
                orderProducts: [],
            });
        });
    });
});
