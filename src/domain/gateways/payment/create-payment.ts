import { Payment } from '#/domain/entities/payment.entity';
import { CreatePaymentDTO } from '#/domain/gateways/payment/dto/create-payment.dto';

export interface ICreatePayment {
    execute(request: CreatePaymentDTO): Promise<Payment>;
}
