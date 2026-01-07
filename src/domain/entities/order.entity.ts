import { randomUUID } from 'crypto';

import { OrderStatus } from '@prisma/client';

import { Client } from '#/domain/entities/client.entity';
import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { BusinessError } from '#/domain/errors';

type OrderPayload = {
    id?: string;
    clientId?: string;
    paymentId: string;
    value: number;
    orderNumber: number;
    status: OrderStatus;
    orderProducts?: OrderProduct[];
    client?: Client;
    payments?: Payment[];
};

export class Order {
    public readonly id: string;
    public clientId: string | null;
    public paymentId: string;
    public value: number;
    public orderNumber: number;
    public status: OrderStatus;
    public orderProducts: OrderProduct[];
    public client?: Client;
    public payments?: Payment[];

    constructor(payload: OrderPayload) {
        this.id = payload.id || randomUUID();
        this.clientId = payload.clientId || null;
        this.paymentId = payload.paymentId;
        this.value = payload.value;
        this.orderNumber = payload.orderNumber;
        this.status = payload.status;
        this.orderProducts = payload.orderProducts || [];
    }

    updateStatus(newStatus: OrderStatus) {
        const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.WAITING]: [OrderStatus.RECEIVED, OrderStatus.CANCELED],
            [OrderStatus.RECEIVED]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
            [OrderStatus.IN_PROGRESS]: [OrderStatus.DONE],
            [OrderStatus.DONE]: [OrderStatus.FINISHED],
            [OrderStatus.FINISHED]: [],
            [OrderStatus.CANCELED]: [],
        };

        const next = allowedTransitions[this.status] ?? [];

        if (!next.includes(newStatus)) {
            throw new BusinessError(400, `Cannot change status from ${this.status} to ${newStatus}`);
        }

        this.status = newStatus;
    }
}
