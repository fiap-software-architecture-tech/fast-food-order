import { inject, injectable } from 'inversify';

import { ICreateOrderUseCase } from '#/application/use-cases/order/create-order/create-order.use-case';
import { IGetOrderUseCase } from '#/application/use-cases/order/get-order/get-order.use-case';
import { IListOrderUseCase } from '#/application/use-cases/order/list-order/list-order.use-case';
import { IUpdateOrderUseCase } from '#/application/use-cases/order/update-order/update-order.use-case';
import { IUpdateOrderStatusUseCase } from '#/application/use-cases/order/update-order-status/update-order-status.use-case';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import {
    OrderCreateRequest,
    OrderQueryRequest,
    OrderUpdateRequest,
    OrderUpdateStatusRequest,
} from '#/interfaces/http/schemas/order/order-request.schema';
import { OrderResponse } from '#/interfaces/http/schemas/order/order-response.schema';
import { OrderPresenter } from '#/interfaces/presenter/order.presenter';

@injectable()
export class OrderController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.CreateOrderUseCase) private readonly createOrderUseCase: ICreateOrderUseCase,
        @inject(TYPES.GetOrderUseCase) private readonly getOrderUseCase: IGetOrderUseCase,
        @inject(TYPES.ListOrderUseCase) private readonly listOrderUseCase: IListOrderUseCase,
        @inject(TYPES.UpdateOrderUseCase) private readonly updateOrderUseCase: IUpdateOrderUseCase,
        @inject(TYPES.UpdateOrderStatusUseCase) private readonly updateOrderStatusUseCase: IUpdateOrderStatusUseCase,
    ) {}

    async create(request: OrderCreateRequest): Promise<OrderResponse> {
        this.logger.info('Creating a new order', { request });
        const response = await this.createOrderUseCase.execute(request);
        return OrderPresenter.toHTTP(response);
    }

    async get(id: string): Promise<OrderResponse> {
        this.logger.info('Retrieving order with ID', { id });
        const response = await this.getOrderUseCase.execute(id);
        return OrderPresenter.toHTTP(response);
    }

    async list(query: OrderQueryRequest): Promise<OrderResponse[]> {
        this.logger.info('Listing orders with query', { query });
        const response = await this.listOrderUseCase.execute(query);
        return response.map(item => OrderPresenter.toHTTP(item));
    }

    async update(id: string, request: OrderUpdateRequest): Promise<OrderResponse> {
        this.logger.info('Updating order with ID', { id, request });
        const response = await this.updateOrderUseCase.execute(id, request);
        return OrderPresenter.toHTTP(response);
    }

    async updateStatus(id: string, request: OrderUpdateStatusRequest): Promise<OrderResponse> {
        this.logger.info('Updating order status with ID', { id, request });
        const response = await this.updateOrderStatusUseCase.execute(id, request.status);
        return OrderPresenter.toHTTP(response);
    }
}
