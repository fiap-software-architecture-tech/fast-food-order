import { inject, injectable } from 'inversify';

import { IGetOrderUseCase } from '#/application/use-cases/get-order/get-order.use-case';
import { Order } from '#/domain/entities/order.entity';
import { NotFoundError } from '#/domain/errors';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class GetOrder implements IGetOrderUseCase {
    constructor(@inject(TYPES.OrderRepository) private readonly orderRepository: IOrderRepository) {}

    async execute(id: string): Promise<Order> {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        return order;
    }
}
