import { Order } from '#/domain/entities/order.entity';
import { ListOrderFilterDto } from '#/domain/repositories/dto/list-order-filter.dto';

export interface IOrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    list(query?: ListOrderFilterDto): Promise<Order[]>;
    updatePaymentId(id: string, paymentId: string): Promise<Order>;
    updateStatus(id: string, order: Order): Promise<void>;
}
