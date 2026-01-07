import { randomUUID } from 'crypto';

import { Product } from '#/domain/entities/product.entity';

type OrderProductPayload = {
    id?: string;
    productId: string;
    amount: number;
    value: number;
    product: Product;
};

export class OrderProduct {
    public readonly id: string;
    public productId: string;
    public amount: number;
    public value: number;
    public product: Product;

    constructor(payload: OrderProductPayload) {
        this.id = payload.id || randomUUID();
        this.productId = payload.productId;
        this.amount = payload.amount;
        this.value = payload.value;
        this.product = payload.product;
    }
}
