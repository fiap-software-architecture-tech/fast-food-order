export interface UpdateOrderDto {
    orderProducts?: [
        {
            productId: string;
            quantity: number;
        },
    ];
}
