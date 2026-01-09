interface OrderProduct {
    name: string;
    quantity: number;
}

export interface CreateCookToOrderDTO {
    orderId: string;
    orderProducts: OrderProduct[];
}
