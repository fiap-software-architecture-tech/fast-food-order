import { Client } from '#/domain/entities/client.entity';
import { Order } from '#/domain/entities/order.entity';
import { OrderCreateRequest } from '#/interfaces/http/schemas/order/order-request.schema';

export interface ICreateOrderUseCase {
    execute(request: OrderCreateRequest, client?: Client): Promise<Order>;
}
