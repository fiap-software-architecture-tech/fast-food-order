import { Payment } from '#/domain/entities/payment.entity';

export interface IGetPayment {
    execute(id: string): Promise<Payment>;
}
