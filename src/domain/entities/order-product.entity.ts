import { randomUUID } from 'crypto';

type OrderProductPayload = {
    id?: string;
    productId: string;
    name: string;
    description: string | null;
    category: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
};

export class OrderProduct {
    public readonly id: string;
    public productId: string;
    public name: string;
    public description: string | null;
    public category: string;
    public unitPrice: number;
    public quantity: number;
    public subtotal: number;

    constructor(payload: OrderProductPayload) {
        this.id = payload.id || randomUUID();
        this.productId = payload.productId;
        this.name = payload.name;
        this.description = payload.description || null;
        this.category = payload.category;
        this.unitPrice = payload.unitPrice;
        this.quantity = payload.quantity;
        this.subtotal = payload.subtotal;
    }
}
