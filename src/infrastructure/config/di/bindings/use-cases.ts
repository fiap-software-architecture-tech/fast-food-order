import { Container } from 'inversify';

import { CreateOrder } from '#/application/use-cases/order/create-order/create-order';
import { ICreateOrderUseCase } from '#/application/use-cases/order/create-order/create-order.use-case';
import { GetOrder } from '#/application/use-cases/order/get-order/get-order';
import { IGetOrderUseCase } from '#/application/use-cases/order/get-order/get-order.use-case';
import { ListOrder } from '#/application/use-cases/order/list-order/list-order';
import { IListOrderUseCase } from '#/application/use-cases/order/list-order/list-order.use-case';
import { UpdateOrderStatus } from '#/application/use-cases/order/update-order-status/update-order-status';
import { IUpdateOrderStatusUseCase } from '#/application/use-cases/order/update-order-status/update-order-status.use-case';
import { TYPES } from '#/infrastructure/config/di/types';

export function bindUseCases(container: Container) {
    container.bind<ICreateOrderUseCase>(TYPES.CreateOrderUseCase).to(CreateOrder).inTransientScope();
    container.bind<IGetOrderUseCase>(TYPES.GetOrderUseCase).to(GetOrder).inTransientScope();
    container.bind<IListOrderUseCase>(TYPES.ListOrderUseCase).to(ListOrder).inTransientScope();
    container.bind<IUpdateOrderStatusUseCase>(TYPES.UpdateOrderStatusUseCase).to(UpdateOrderStatus).inTransientScope();
}
