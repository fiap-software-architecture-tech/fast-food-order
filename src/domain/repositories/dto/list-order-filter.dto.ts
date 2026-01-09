import { OrderStatus } from '@prisma/client';

export interface ListOrderFilterDto {
    status?: OrderStatus[];
    clientId?: string;
    productId?: string;
    page?: number;
    limit?: number;
}
