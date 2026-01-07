import { Prisma } from '@prisma/client';

import { Order } from '#/domain/entities/order.entity';
import { PrismaOrderProductMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-order-product.mapper';

export class PrismaOrderMapper {
    static toDomain(data: any): Order {
        return new Order({
            id: data.id,
            clientId: data.clientId,
            paymentId: data.paymentId,
            value: data.value,
            orderNumber: data.orderNumber,
            status: data.status,
            orderProducts:
                data.orderProducts?.map((orderProduct: any) => PrismaOrderProductMapper.toDomain(orderProduct)) || [],
        });
    }

    static toDomainSimple(data: any): Order {
        return new Order({
            id: data.id,
            clientId: data.clientId,
            paymentId: data.paymentId,
            value: data.value,
            orderNumber: data.orderNumber,
            status: data.status,
        });
    }

    static toCreate(data: Order): Prisma.OrderCreateInput {
        return {
            clientId: data.clientId,
            paymentId: data.paymentId,
            value: data.value,
            orderProducts: {
                create:
                    data.orderProducts?.map(item => ({
                        productId: item.productId,
                        amount: item.amount,
                        value: item.value,
                    })) || [],
            },
        };
    }

    static toUpdateOrderProducts(data: Order): Prisma.OrderUpdateInput {
        return {
            value: data.value,
            status: data.status,
            orderProducts: {
                deleteMany: {},
                create:
                    data.orderProducts?.map(item => ({
                        productId: item.productId,
                        amount: item.amount,
                        value: item.value,
                    })) || [],
            },
        };
    }
}
