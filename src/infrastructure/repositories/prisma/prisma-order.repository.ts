import { PrismaClient, Order as PrismaOrder } from '@prisma/client';
import { injectable, inject } from 'inversify';

import { Order } from '#/domain/entities/order.entity';
import { ListOrderFilterDto } from '#/domain/repositories/dto/list-order-filter.dto';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaOrderMapper } from '#/infrastructure/repositories/prisma/mappers/prisma-order.mapper';

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
    constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

    async create(order: Order): Promise<Order> {
        const data = await this.prisma.order.create({
            data: PrismaOrderMapper.toCreate(order),
            include: {
                orderProducts: true,
            },
        });

        return PrismaOrderMapper.toDomain(data);
    }

    async findById(id: string): Promise<Order | null> {
        const data = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderProducts: true,
            },
        });

        if (!data) {
            return null;
        }

        return PrismaOrderMapper.toDomain(data);
    }

    async list(query?: ListOrderFilterDto): Promise<Order[]> {
        const { page = 1, limit = 10 } = query || {};
        const offset = (page - 1) * limit;

        const conditions: string[] = ['1 = 1'];
        const parameters: (string | number)[] = [];

        // eslint-disable-next-line quotes
        conditions.push("o.status NOT IN ('FINISHED', 'CANCELLED')"); // Exclude canceled orders
        if (query?.status && query.status.length > 0) {
            const statusPlaceholders = query.status.map(() => '?').join(',');
            conditions.push(`o.status IN (${statusPlaceholders})`);
            parameters.push(...query.status);
        }

        if (query?.clientId) {
            conditions.push('o.client_id = ?');
            parameters.push(query.clientId);
        }

        if (query?.productId) {
            conditions.push('op.product_id = ?');
            parameters.push(query.productId);
        }

        parameters.push(limit, offset);

        const whereClause = conditions.join(' AND ');

        const rawQuery: { id: string }[] = await this.prisma.$queryRawUnsafe(
            `
            SELECT o.id FROM \`order\` o
            JOIN order_product op ON o.id = op.order_id
            WHERE ${whereClause}
            GROUP BY o.id
            ORDER BY
                CASE
                    WHEN o.status = 'DONE' THEN 1
                    WHEN o.status = 'IN_PROGRESS' THEN 2
                    WHEN o.status = 'RECEIVED' THEN 3
                    WHEN o.status = 'WAITING' THEN 4
                END ASC,
                o.created_at ASC
            LIMIT ? OFFSET ?
        `,
            ...parameters,
        );

        // IN não retorna dados na ordem que foi passado, então precisamos ordenar manualmente
        // isso não deve afetar performance, pois estamos ordenando 10 itens, não milhares
        const data = await this.prisma.order.findMany({
            where: { id: { in: rawQuery.map((item: { id: string }) => item.id) } },
            include: {
                orderProducts: true,
            },
        });

        const sortedData = this.sortOrders(data);

        return sortedData.map(item => PrismaOrderMapper.toDomain(item));
    }

    async updatePaymentId(id: string, paymentId: string): Promise<Order> {
        const data = await this.prisma.order.update({
            where: { id },
            data: { paymentId },
            include: {
                orderProducts: true,
            },
        });

        return PrismaOrderMapper.toDomain(data);
    }

    async updateStatus(id: string, order: Order): Promise<void> {
        await this.prisma.order.update({
            where: { id },
            data: { status: order.status },
            include: {
                orderProducts: true,
            },
        });
    }

    private sortOrders(orders: PrismaOrder[]) {
        const statusMappingOrder = {
            DONE: 1,
            IN_PROGRESS: 2,
            RECEIVED: 3,
            WAITING: 4,
            FINISHED: 5,
            CANCELED: 6,
        };
        return orders.sort((a, b) => {
            const statusA = statusMappingOrder[a.status as keyof typeof statusMappingOrder] ?? Number.MAX_SAFE_INTEGER;
            const statusB = statusMappingOrder[b.status as keyof typeof statusMappingOrder] ?? Number.MAX_SAFE_INTEGER;
            if (statusA === statusB) return a.createdAt.getTime() - b.createdAt.getTime();
            return statusA - statusB;
        });
    }
}
