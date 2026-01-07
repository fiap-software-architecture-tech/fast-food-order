export interface CreateOrderDto {
    clientId: string;
    orderProducts: [
        {
            productId: string;
            quantity: number;
        },
    ];
}
