import { inject, injectable } from 'inversify';

import { IGetOrderUseCase } from '#/application/use-cases/order/get-order/get-order.use-case';
import { Order } from '#/domain/entities/order.entity';
import { NotFoundError } from '#/domain/errors';
import { IGetClientById } from '#/domain/gateways/client/get-client-by-id';
import { IGetPayment } from '#/domain/gateways/payment/get-payment';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class GetOrder implements IGetOrderUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.OrderRepository) private readonly orderRepository: IOrderRepository,
        @inject(TYPES.GetClientByIdGateway) private readonly getClientByIdGateway: IGetClientById,
        @inject(TYPES.GetPaymentGateway) private readonly getPaymentGateway: IGetPayment,
    ) {}

    async execute(id: string): Promise<Order> {
        this.logger.info('Getting order', { orderId: id });

        const order = await this.orderRepository.findById(id);

        if (!order) {
            this.logger.warn('Order not found', { orderId: id });
            throw new NotFoundError('Order not found');
        }

        if (order.clientId) {
            const client = await this.getClientByIdGateway.execute(order.clientId);
            if (client) {
                order.setClient(client);
            }
        }

        const payment = await this.getPaymentGateway.execute(order.paymentId!);
        order.setPayment(payment);

        this.logger.info('Order retrieved', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
        });

        return order;
    }
}
