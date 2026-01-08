import { Order } from '#/domain/entities/order.entity';
import { OrderResponse, UpdateOrderStatusResponse } from '#/interfaces/http/schemas/order/order-response.schema';

export class OrderPresenter {
    static toHTTP(order: Order): OrderResponse {
        return {
            id: order.id,
            totalAmount: order.totalAmount,
            orderNumber: order.orderNumber,
            status: order.status,
            ...(order.orderProducts && {
                orderProducts: order.orderProducts.map(op => ({
                    id: op.id,
                    productId: op.productId,
                    name: op.name,
                    description: op.description,
                    category: op.category,
                    unitPrice: op.unitPrice,
                    quantity: op.quantity,
                    subtotal: op.subtotal,
                })),
            }),
            ...(order.payment && {
                payment: {
                    id: order.payment.id,
                    status: order.payment.status,
                    externalReference: order.payment.externalReference,
                    qrCode: order.payment.qrCode,
                },
            }),
            ...(order.client && {
                client: {
                    id: order.client.id,
                    name: order.client.name,
                    cpf: order.client.cpf,
                    email: order.client.email,
                },
            }),
        };
    }

    static toUpdateOrderStatusResponse(): UpdateOrderStatusResponse {
        return { message: 'Order status updated successfully' };
    }
}
