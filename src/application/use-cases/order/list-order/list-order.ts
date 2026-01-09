import { OrderStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IListOrderUseCase } from '#/application/use-cases/order/list-order/list-order.use-case';
import { Order } from '#/domain/entities/order.entity';
import { ListOrderFilterDto } from '#/domain/repositories/dto/list-order-filter.dto';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { OrderQueryRequest } from '#/interfaces/http/schemas/order/order-request.schema';

@injectable()
export class ListOrder implements IListOrderUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.OrderRepository) private readonly orderRepository: IOrderRepository,
    ) {}

    async execute(filters: OrderQueryRequest): Promise<Order[]> {
        this.logger.info('Listing orders', { filters });

        const query: ListOrderFilterDto = {
            ...filters,
            status: filters.status ? [filters.status as OrderStatus] : undefined,
        };

        const orders = await this.orderRepository.list(query);

        this.logger.info('Orders listed successfully', { count: orders.length });
        return orders;
    }
}
