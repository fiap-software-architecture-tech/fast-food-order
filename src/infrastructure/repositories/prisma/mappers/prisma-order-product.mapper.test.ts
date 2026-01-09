import { describe, expect, it } from 'vitest';

import { OrderProduct } from '#/domain/entities/order-product.entity';
import { PrismaOrderProductMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-order-product.mapper';

describe('PrismaOrderProductMapper', () => {
    const mockOrderProductData = {
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

    describe('toDomain', () => {
        it('should map prisma order product data to domain OrderProduct entity', () => {
            const orderProduct = PrismaOrderProductMapper.toDomain(mockOrderProductData);

            expect(orderProduct).toBeInstanceOf(OrderProduct);
            expect(orderProduct.id).toBe(mockOrderProductData.id);
            expect(orderProduct.productId).toBe(mockOrderProductData.productId);
            expect(orderProduct.name).toBe(mockOrderProductData.name);
            expect(orderProduct.description).toBe(mockOrderProductData.description);
            expect(orderProduct.category).toBe(mockOrderProductData.category);
            expect(orderProduct.unitPrice).toBe(mockOrderProductData.unitPrice);
            expect(orderProduct.quantity).toBe(mockOrderProductData.quantity);
            expect(orderProduct.subtotal).toBe(mockOrderProductData.subtotal);
        });

        it('should map prisma order product data with null description', () => {
            const mockDataWithNullDescription = {
                ...mockOrderProductData,
                description: null,
            };

            const orderProduct = PrismaOrderProductMapper.toDomain(mockDataWithNullDescription);

            expect(orderProduct).toBeInstanceOf(OrderProduct);
            expect(orderProduct.description).toBeNull();
        });
    });
});
