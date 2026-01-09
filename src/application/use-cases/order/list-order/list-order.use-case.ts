import { Order } from '#/domain/entities/order.entity';
import { OrderQueryRequest } from '#/interfaces/http/schemas/order/order-request.schema';

export interface IListOrderUseCase {
    execute(request: OrderQueryRequest): Promise<Order[]>;
}
