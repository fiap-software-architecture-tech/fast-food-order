import { OrderStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { Client } from '#/domain/entities/client.entity';
import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Order } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { OrderPresenter } from '#/interfaces/presenter/order.presenter';

describe('OrderPresenter', () => {
    describe('toHTTP', () => {
        it('should map order to HTTP response with all fields', () => {
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

            const client = new Client('client-123', 'John Doe', '12345678901', 'john@example.com');
            const payment = new Payment('payment-123', 'PENDING', 'ext-ref-123', 'qr-code-data');

            const order = new Order({
                id: 'order-123',
                clientId: 'client-123',
                paymentId: 'payment-123',
                totalAmount: 3198,
                orderNumber: 1001,
                status: OrderStatus.WAITING,
                orderProducts,
                client,
                payment,
            });

            const result = OrderPresenter.toHTTP(order);

            expect(result.id).toBe('order-123');
            expect(result.totalAmount).toBe(3198);
            expect(result.orderNumber).toBe(1001);
            expect(result.status).toBe(OrderStatus.WAITING);
            expect(result.orderProducts).toHaveLength(1);
            expect(result.orderProducts![0].name).toBe('Hamburger');
            expect(result.payment).toBeDefined();
            expect(result.payment!.id).toBe('payment-123');
            expect(result.client).toBeDefined();
            expect(result.client!.name).toBe('John Doe');
        });

        it('should map order without optional fields', () => {
            const order = new Order({
                id: 'order-456',
                clientId: null,
                paymentId: null,
                totalAmount: 0,
                orderNumber: 1002,
                status: OrderStatus.CANCELED,
            });

            const result = OrderPresenter.toHTTP(order);

            expect(result.id).toBe('order-456');
            expect(result.orderProducts).toEqual([]);
            expect(result.payment).toBeUndefined();
            expect(result.client).toBeUndefined();
        });
    });

    describe('toUpdateOrderStatusResponse', () => {
        it('should return success message', () => {
            const result = OrderPresenter.toUpdateOrderStatusResponse();

            expect(result).toEqual({ message: 'Order status updated successfully' });
        });
    });
});
