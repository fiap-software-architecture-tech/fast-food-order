import { OrderStatus } from '@prisma/client';

export interface IUpdateOrderStatusUseCase {
    execute(id: string, newStatus: OrderStatus): Promise<void>;
}
