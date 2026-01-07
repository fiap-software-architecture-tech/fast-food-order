import { ListOrderRequestDto } from '#/application/use-cases/list-order/list-order.dto';
import { Order } from '#/domain/entities/order.entity';

export interface IListOrderUseCase {
    execute(request: ListOrderRequestDto): Promise<Order[]>;
}
