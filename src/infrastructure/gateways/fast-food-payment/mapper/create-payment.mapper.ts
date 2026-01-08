import { Order } from '#/domain/entities/order.entity';
import { CreatePaymentDTO } from '#/domain/gateways/payment/dto/create-payment.dto';

export class CreatePaymentMapper {
    static toGatewayMapper(order: Order): CreatePaymentDTO {
        return {
            orderId: order.id,
            totalAmount: order.totalAmount,
            orderProducts: order.orderProducts.map(product => ({
                productId: product.productId,
                name: product.name,
                category: product.category,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                subtotal: product.subtotal,
                ...(product.description && { description: product.description }),
            })),
        };
    }
}
