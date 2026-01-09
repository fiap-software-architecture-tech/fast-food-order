import { Order as PrismaOrder, OrderProduct as PrismaOrderProduct, Prisma } from '@prisma/client';

import { Order } from '#/domain/entities/order.entity';
import { PrismaOrderProductMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-order-product.mapper';

type PrismaOrderWithProducts = PrismaOrder & {
    orderProducts?: PrismaOrderProduct[];
};

export class PrismaOrderMapper {
    static toDomain(data: PrismaOrderWithProducts): Order {
        return new Order({
            id: data.id,
            clientId: data.clientId,
            paymentId: data.paymentId,
            totalAmount: data.totalAmount,
            orderNumber: data.orderNumber,
            status: data.status,
            orderProducts:
                data.orderProducts?.map((orderProduct: any) => PrismaOrderProductMapper.toDomain(orderProduct)) || [],
        });
    }

    static toCreate(data: Order): Prisma.OrderCreateInput {
        return {
            clientId: data.clientId,
            paymentId: data.paymentId,
            totalAmount: data.totalAmount,
            orderProducts: {
                create:
                    data.orderProducts?.map(item => ({
                        productId: item.productId,
                        name: item.name,
                        description: item.description,
                        category: item.category,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                    })) || [],
            },
        };
    }
}
