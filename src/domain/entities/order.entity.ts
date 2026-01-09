import { randomUUID } from 'crypto';

import { OrderStatus } from '@prisma/client';

import { Client } from '#/domain/entities/client.entity';
import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Payment } from '#/domain/entities/payment.entity';
import { BusinessError } from '#/domain/errors';

type OrderPayload = {
    id?: string;
    clientId?: string | null;
    paymentId?: string | null;
    totalAmount: number;
    orderNumber: number;
    status: OrderStatus;
    orderProducts?: OrderProduct[];
    client?: Client;
    payment?: Payment;
};

export class Order {
    public readonly id: string;
    public clientId?: string | null;
    public paymentId?: string | null;
    public totalAmount: number;
    public orderNumber: number;
    public status: OrderStatus;
    public orderProducts: OrderProduct[];
    public client?: Client;
    public payment?: Payment;

    constructor(payload: OrderPayload) {
        this.id = payload.id || randomUUID();
        this.clientId = payload.clientId;
        this.paymentId = payload.paymentId;
        this.totalAmount = payload.totalAmount;
        this.orderNumber = payload.orderNumber;
        this.status = payload.status;
        this.orderProducts = payload.orderProducts || [];
        this.client = payload.client;
        this.payment = payload.payment;
    }

    setClientId(clientId?: string) {
        this.clientId = clientId;
    }

    setPaymentId(paymentId: string) {
        this.paymentId = paymentId;
    }

    setClient(client?: Client) {
        this.client = client;
    }

    setPayment(payment?: Payment) {
        this.payment = payment;
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
