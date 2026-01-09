import { OrderStatus } from '@prisma/client';
import { vi } from 'vitest';

import { Order } from '#/domain/entities/order.entity';
import { ListOrderFilterDto } from '#/domain/repositories/dto/list-order-filter.dto';
import { IOrderRepository } from '#/domain/repositories/order.repository';

export class PrismaOrderMockRepository implements IOrderRepository {
    async create(order: Order): Promise<Order> {
        return Promise.resolve(order);
    }

    async findById(_id: string): Promise<Order | null> {
        return Promise.resolve(null);
    }

    async list(_query?: ListOrderFilterDto): Promise<Order[]> {
        return Promise.resolve([]);
    }

    async updatePaymentId(_id: string, _paymentId: string): Promise<Order> {
        return Promise.resolve(orderMock);
    }

    async updateStatus(_id: string, _order: Order): Promise<void> {
        return Promise.resolve();
    }
}

const orderMock = new Order({
    totalAmount: 2599,
    orderNumber: 1001,
    status: OrderStatus.WAITING,
    orderProducts: [],
});

type MockOptions = {
    data?: Order;
    empty?: boolean;
};

type MockListOptions = {
    data?: Order[];
};

export function mockOrderCreate({ data = orderMock }: MockOptions = {}) {
    return vi.spyOn(PrismaOrderMockRepository.prototype, 'create').mockResolvedValueOnce(data);
}

export function mockOrderFindById({ data = orderMock, empty }: MockOptions = {}) {
    return vi.spyOn(PrismaOrderMockRepository.prototype, 'findById').mockResolvedValueOnce(empty ? null : data);
}

export function mockOrderList({ data = [orderMock] }: MockListOptions = {}) {
    return vi.spyOn(PrismaOrderMockRepository.prototype, 'list').mockResolvedValueOnce(data);
}

export function mockOrderUpdatePaymentId({ data = orderMock }: MockOptions = {}) {
    return vi.spyOn(PrismaOrderMockRepository.prototype, 'updatePaymentId').mockResolvedValueOnce(data);
}

export function mockOrderUpdateStatus() {
    return vi.spyOn(PrismaOrderMockRepository.prototype, 'updateStatus').mockResolvedValueOnce();
}
