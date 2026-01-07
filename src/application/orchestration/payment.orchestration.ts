import { inject, injectable } from 'inversify';

import { IPaymentOrchestration } from '#/application/orchestration/interfaces/i-payment.orchestration';
import { Order } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { PaymentBuilderFactory } from '#/domain/factories/payment-builder.factory';
import { ICreatePayment } from '#/domain/gateways/create-payment';
import { IPaymentRepository } from '#/domain/repositories/payment.repository';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class PaymentOrchestration implements IPaymentOrchestration {
    constructor(
        @inject(TYPES.CreatePaymentGateway) private readonly paymentGateway: ICreatePayment,
        @inject(TYPES.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
    ) {}

    async createPaymentForOrder(order: Order): Promise<Payment> {
        const payment = PaymentBuilderFactory.createPayment(order);
        const savePayment = await this.paymentRepository.create(payment);

        const gatewayRequest = PaymentBuilderFactory.buildGatewayRequest(savePayment.id, order);
        const gatewayResponse = await this.paymentGateway.execute(gatewayRequest);

        savePayment.qrCode = gatewayResponse;
        return await this.paymentRepository.update(savePayment.id, savePayment);
    }
}
