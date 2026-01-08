import { inject, injectable } from 'inversify';

import { ICreateOrderUseCase } from '#/application/use-cases/order/create-order/create-order.use-case';
import { IGetOrderUseCase } from '#/application/use-cases/order/get-order/get-order.use-case';
import { IListOrderUseCase } from '#/application/use-cases/order/list-order/list-order.use-case';
import { IUpdateOrderStatusUseCase } from '#/application/use-cases/order/update-order-status/update-order-status.use-case';
import { Client } from '#/domain/entities/client.entity';
import { ILogger } from '#/domain/services/logger.service';
import { TYPES } from '#/infrastructure/config/di/types';
import {
    OrderCreateRequest,
    OrderQueryRequest,
    OrderUpdateStatusRequest,
} from '#/interfaces/http/schemas/order/order-request.schema';
import { OrderResponse, UpdateOrderStatusResponse } from '#/interfaces/http/schemas/order/order-response.schema';
import { OrderPresenter } from '#/interfaces/presenter/order.presenter';

@injectable()
export class OrderController {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.CreateOrderUseCase) private readonly createOrderUseCase: ICreateOrderUseCase,
        @inject(TYPES.GetOrderUseCase) private readonly getOrderUseCase: IGetOrderUseCase,
        @inject(TYPES.ListOrderUseCase) private readonly listOrderUseCase: IListOrderUseCase,
        @inject(TYPES.UpdateOrderStatusUseCase) private readonly updateOrderStatusUseCase: IUpdateOrderStatusUseCase,
    ) {}

    async create(request: OrderCreateRequest, client?: Client): Promise<OrderResponse> {
        this.logger.info('Creating a new order', { request, client });
        const response = await this.createOrderUseCase.execute(request, client);
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

    async updateStatus(id: string, request: OrderUpdateStatusRequest): Promise<UpdateOrderStatusResponse> {
        this.logger.info('Updating order status with ID', { id, request });
        await this.updateOrderStatusUseCase.execute(id, request.status);
        return OrderPresenter.toUpdateOrderStatusResponse();
    }
}
