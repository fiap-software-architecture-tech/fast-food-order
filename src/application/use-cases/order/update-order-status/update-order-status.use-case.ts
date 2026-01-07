import { OrderStatus } from '@prisma/client';

import { Order } from '#/domain/entities/order.entity';

export interface IUpdateOrderStatusUseCase {
    execute(orderId: string, newStatus: OrderStatus): Promise<Order>;
}
