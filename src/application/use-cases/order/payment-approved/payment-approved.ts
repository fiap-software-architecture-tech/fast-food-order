import { inject, injectable } from 'inversify';

import { IPaymentApprovedUseCase } from '#/application/use-cases/order/payment-approved/payment-approved.use-case';
import { NotFoundError } from '#/domain/errors';
import { ICreateCookToOrder } from '#/domain/gateways/cook-to-order/create-cook-to-order';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { CreateCookToOrderMapper } from '#/infrastructure/gateways/fast-food-cook-to-order/mapper/create-cook-to-order.mapper';

@injectable()
export class PaymentApproved implements IPaymentApprovedUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.OrderRepository) private readonly orderRepository: any,
        @inject(TYPES.CreateCookToOrderGateway) private readonly createCookToOrder: ICreateCookToOrder,
    ) {}

    async execute(orderId: string): Promise<void> {
        this.logger.info('Notified cook to order after payment approved', { orderId });
        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            this.logger.warn('Order not found', { orderId });
            throw new NotFoundError('Order not found');
        }

        const gatewayRequest = CreateCookToOrderMapper.toGatewayMapper(order);
        await this.createCookToOrder.execute(gatewayRequest);

        this.logger.info('Cook to order notified successfully', {
            orderId,
            orderNumber: order.orderNumber,
        });
    }
}
