import { Order } from '#/domain/entities/order.entity';
import { CreateCookToOrderDTO } from '#/domain/gateways/cook-to-order/dto/create-cook-to-order.dto';

export class CreateCookToOrderMapper {
    static toGatewayMapper(order: Order): CreateCookToOrderDTO {
        return {
            orderId: order.id,
            orderProducts: order.orderProducts.map(product => ({
                name: product.name,
                quantity: product.quantity,
            })),
        };
    }
}
