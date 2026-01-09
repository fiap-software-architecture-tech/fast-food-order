import { OrderStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IUpdateOrderStatusUseCase } from '#/application/use-cases/order/update-order-status/update-order-status.use-case';
import { NotFoundError } from '#/domain/errors';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class UpdateOrderStatus implements IUpdateOrderStatusUseCase {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.OrderRepository) private orderRepository: IOrderRepository,
    ) {}

    async execute(id: string, newStatus: OrderStatus): Promise<void> {
        this.logger.info('Updating order status', { orderId: id, newStatus });

        const order = await this.orderRepository.findById(id);

        if (!order) {
            this.logger.warn('Order not found for status update', { orderId: id });
            throw new NotFoundError('Order not found');
        }

        const oldStatus = order.status;
        order.updateStatus(newStatus);

        await this.orderRepository.updateStatus(id, order);

        this.logger.info('Order status updated successfully', {
            orderId: id,
            orderNumber: order.orderNumber,
            oldStatus,
            newStatus,
        });
    }
}
