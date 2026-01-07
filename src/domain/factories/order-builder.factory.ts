import { OrderStatus } from '@prisma/client';

import { IOrderProduct, OrderProduct } from '#/domain/entities/order-product.entity';
import { IOrder, Order } from '#/domain/entities/order.entity';
import { IProduct } from '#/domain/entities/product.entity';
import { ProductValidationFactory } from '#/domain/factories/product-validation.factory';

export class OrderBuilderFactory {
    static buildOrderProducts(
        requestedProducts: Array<{ productId: string; quantity: number }>,
        availableProducts: IProduct[],
    ): { orderProducts: IOrderProduct[]; totalValue: number } {
        let totalValue = 0;

        const orderProducts = requestedProducts.map(item => {
            const product = ProductValidationFactory.findProductById(item.productId, availableProducts);
            const itemValue = product.value * item.quantity;
            totalValue += itemValue;

            return new OrderProduct({
                amount: item.quantity,
                value: itemValue,
                product: product,
            });
        });

        return { orderProducts, totalValue };
    }

    static createOrder(orderProducts: IOrderProduct[], totalValue: number): IOrder {
        return new Order({
            value: totalValue,
            orderNumber: 0,
            status: OrderStatus.WAITING,
            orderProducts: orderProducts,
        });
    }
}
