import { StatusPayment } from '@prisma/client';

import { IOrder } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { CreateQrCodeInput } from '#/domain/gateways/dto/create-qr-code-input';

export class PaymentBuilderFactory {
    static createPayment(order: IOrder): Payment {
        return new Payment({
            status: StatusPayment.PENDING,
            order: order,
        });
    }

    static buildGatewayRequest(paymentId: string, order: IOrder): CreateQrCodeInput {
        return {
            paymentId,
            items: order.orderProducts,
            amount: order.value,
        };
    }
}
