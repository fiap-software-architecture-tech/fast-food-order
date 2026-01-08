import { inject, injectable } from 'inversify';

import { ICreateOrderUseCase } from '#/application/use-cases/order/create-order/create-order.use-case';
import { Client } from '#/domain/entities/client.entity';
import { Order } from '#/domain/entities/order.entity';
import { OrderBuilderFactory } from '#/domain/factories/order-builder.factory';
import { ICreatePayment } from '#/domain/gateways/payment/create-payment';
import { IFindManyProducts } from '#/domain/gateways/product/find-many-products';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { ILogger } from '#/domain/services/logger.service';
import { ProductValidatorService } from '#/domain/services/product-validator.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { OrderCreateRequest } from '#/interfaces/http/schemas/order/order-request.schema';

@injectable()
export class CreateOrder implements ICreateOrderUseCase {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.OrderRepository) private readonly orderRepository: IOrderRepository,
        @inject(TYPES.FindManyProductsGateway) private readonly findManyProductsGateway: IFindManyProducts,
        @inject(TYPES.ProductValidatorService) private readonly productValidator: ProductValidatorService,
        @inject(TYPES.CreatePaymentGateway) private readonly createPaymentGateway: ICreatePayment,
    ) {}

    async execute(request: OrderCreateRequest, client?: Client): Promise<Order> {
        this.logger.info('Creating order', { clientId: client?.id, productsCount: request.orderProducts.length });

        const productIds = request.orderProducts.map(item => item.productId);
        const products = await this.findManyProductsGateway.execute(productIds);

        this.productValidator.validateAllProductsExist(productIds, products);

        const order = OrderBuilderFactory.create().withProducts(request.orderProducts, products).build();

        const payment = await this.createPaymentGateway.execute(order);

        order.setClientId(client?.id);
        order.setPaymentId(payment.id);

        const savedOrder = await this.orderRepository.create(order);

        savedOrder.setClient(client);
        savedOrder.setPayment(payment);

        this.logger.info('Order created', {
            orderId: savedOrder.id,
            orderNumber: savedOrder.orderNumber,
            paymentId: payment.id,
        });

        return savedOrder;
    }
}
