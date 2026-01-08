interface OrderProduct {
    productId: string;
    name: string;
    category: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    description?: string;
}

export interface CreatePaymentDTO {
    orderId: string;
    totalAmount: number;
    orderProducts: OrderProduct[];
}
