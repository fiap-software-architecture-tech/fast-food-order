import { OrderStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IPaymentFailedUseCase } from '#/application/use-cases/order/payment-failed/payment-failed.use-case';
import { NotFoundError } from '#/domain/errors';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class PaymentFailed implements IPaymentFailedUseCase {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.OrderRepository) private orderRepository: IOrderRepository,
    ) {}

    async execute(orderId: string): Promise<void> {
        this.logger.info('Updating order status to payment failed', { orderId });

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            this.logger.warn('Order not found', { orderId });
            throw new NotFoundError('Order not found');
        }

        order.updateStatus(OrderStatus.CANCELED);
        await this.orderRepository.updateStatus(orderId, order);

        this.logger.info('Order status updated successfully', {
            orderId,
            orderNumber: order.orderNumber,
        });
    }
}
