import { OrderStatus } from '@prisma/client';

import { OrderProduct } from '#/domain/entities/order-product.entity';
import { Order } from '#/domain/entities/order.entity';
import { Product } from '#/domain/entities/product.entity';

export class OrderBuilder {
    private orderProducts: OrderProduct[] = [];
    private totalAmount = 0;

    withProducts(requestProducts: Array<{ productId: string; quantity: number }>, products: Product[]): this {
        this.orderProducts = requestProducts.map(item => {
            const product = products.find(product => product.id === item.productId);

            const orderProduct = new OrderProduct({
                productId: product!.id,
                name: product!.name,
                description: product!.description,
                category: product!.category.name,
                unitPrice: product!.value,
                quantity: item.quantity,
                subtotal: product!.value * item.quantity,
            });

            this.totalAmount += orderProduct.subtotal;
            return orderProduct;
        });

        return this;
    }

    build(): Order {
        const order = new Order({
            orderProducts: this.orderProducts,
            totalAmount: this.totalAmount,
            status: OrderStatus.WAITING,
            orderNumber: 0,
        });

        return order;
    }
}

export class OrderBuilderFactory {
    static create(): OrderBuilder {
        return new OrderBuilder();
    }
}
