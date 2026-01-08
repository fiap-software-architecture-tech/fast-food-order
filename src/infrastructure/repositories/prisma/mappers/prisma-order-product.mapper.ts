import { OrderProduct as PrismaClient } from '@prisma/client';

import { OrderProduct } from '#/domain/entities/order-product.entity';

export class PrismaOrderProductMapper {
    static toDomain(data: PrismaClient): OrderProduct {
        return new OrderProduct({
            id: data.id,
            productId: data.productId,
            name: data.name,
            description: data.description,
            category: data.category,
            unitPrice: data.unitPrice,
            quantity: data.quantity,
            subtotal: data.subtotal,
        });
    }
}
