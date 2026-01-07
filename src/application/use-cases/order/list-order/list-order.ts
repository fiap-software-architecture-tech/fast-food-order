import { OrderStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ListOrderDto, ListOrderRequestDto } from '#/application/use-cases/list-order/list-order.dto';
import { IListOrderUseCase } from '#/application/use-cases/list-order/list-order.use-case';
import { Order } from '#/domain/entities/order.entity';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class ListOrder implements IListOrderUseCase {
    constructor(@inject(TYPES.OrderRepository) private readonly orderRepository: IOrderRepository) {}

    async execute(request: ListOrderRequestDto): Promise<Order[]> {
        const query: ListOrderDto = {
            status: request.status ? (request.status.split(',') as OrderStatus[]) : undefined,
            clientId: request.clientId,
            productId: request.productId,
            page: Number(request.page),
            limit: Number(request.limit),
        };
        return this.orderRepository.list(query);
    }
}
