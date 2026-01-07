import { IOrder } from '#/domain/entities/order.entity';
import { IPayment } from '#/domain/entities/payment.entity';

export interface IPaymentOrchestration {
    createPaymentForOrder(order: IOrder): Promise<IPayment>;
}
