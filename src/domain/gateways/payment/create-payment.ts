import { Order } from '#/domain/entities/order.entity';
import { Payment } from '#/domain/entities/payment.entity';

export interface ICreatePayment {
    execute(request: Order): Promise<Payment>;
}
