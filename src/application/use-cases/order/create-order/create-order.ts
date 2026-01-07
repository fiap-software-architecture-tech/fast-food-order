// import { inject, injectable } from 'inversify';

// import { IClientOrchestration } from '#/application/orchestration/interfaces/i-client.orchestration';
// import { IPaymentOrchestration } from '#/application/orchestration/interfaces/i-payment.orchestration';
// import { IProductOrchestration } from '#/application/orchestration/interfaces/i-product.orchestration';
import { CreateOrderDto } from '#/application/use-cases/create-order/create-order.dto';
import { ICreateOrderUseCase } from '#/application/use-cases/create-order/create-order.use-case';
// import { Order } from '#/domain/entities/order.entity';
// import { OrderBuilderFactory } from '#/domain/factories/order-builder.factory';
// import { IOrderRepository } from '#/domain/repositories/order.repository';
// import { TYPES } from '#/infrastructure/config/di/types';

// @injectable()
export class CreateOrder implements ICreateOrderUseCase {
    //     constructor(
    //         @inject(TYPES.OrderRepository) private readonly orderRepository: IOrderRepository,
    //         @inject(TYPES.ProductOrchestration) private readonly productOrchestration: IProductOrchestration,
    //         @inject(TYPES.ClientOrchestration) private readonly clientOrchestration: IClientOrchestration,
    //         @inject(TYPES.PaymentOrchestration) private readonly paymentOrchestration: IPaymentOrchestration,
    //     ) {}

    async execute(request: CreateOrderDto): Promise<any> {
        //         const products = await this.productOrchestration.validateAndGetProducts(request.orderProducts);
        //         const { orderProducts, totalValue } = OrderBuilderFactory.buildOrderProducts(request.orderProducts, products);
        //         const order = OrderBuilderFactory.createOrder(orderProducts, totalValue);
        //         order.client = await this.clientOrchestration.getClientIfExists(request.clientId);
        //         const savedOrder = await this.orderRepository.create(order);
        //         const payment = await this.paymentOrchestration.createPaymentForOrder(savedOrder);
        //         savedOrder.payments = [payment];
        //         return savedOrder;
        console.log(request);
        return Promise.resolve({});
    }
}
