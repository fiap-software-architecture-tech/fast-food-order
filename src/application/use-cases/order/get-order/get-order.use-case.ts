import { Order } from '#/domain/entities/order.entity';

export interface IGetOrderUseCase {
    execute(id: string): Promise<Order>;
}
