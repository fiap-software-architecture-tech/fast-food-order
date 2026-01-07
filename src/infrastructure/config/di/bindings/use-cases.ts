import { Container } from 'inversify';

import { CreateOrder } from '#/application/use-cases/create-order/create-order';
import { ICreateOrderUseCase } from '#/application/use-cases/create-order/create-order.use-case';
import { DeleteOrder } from '#/application/use-cases/delete-order/delete-order';
import { IDeleteOrderUseCase } from '#/application/use-cases/delete-order/delete-order.use-case';
import { GetOrder } from '#/application/use-cases/get-order/get-order';
import { IGetOrderUseCase } from '#/application/use-cases/get-order/get-order.use-case';
import { ListOrder } from '#/application/use-cases/list-order/list-order';
import { IListOrderUseCase } from '#/application/use-cases/list-order/list-order.use-case';
import { UpdateOrder } from '#/application/use-cases/update-order/update-order';
import { IUpdateOrderUseCase } from '#/application/use-cases/update-order/update-order.use-case';
import { UpdateOrderStatus } from '#/application/use-cases/update-order-status/update-order-status';
import { IUpdateOrderStatusUseCase } from '#/application/use-cases/update-order-status/update-order-status.use-case';
import { TYPES } from '#/infrastructure/config/di/types';

export function bindUseCases(container: Container) {
    container.bind<ICreateOrderUseCase>(TYPES.CreateOrderUseCase).to(CreateOrder).inTransientScope();
    container.bind<IDeleteOrderUseCase>(TYPES.DeleteOrderUseCase).to(DeleteOrder).inTransientScope();
    container.bind<IGetOrderUseCase>(TYPES.GetOrderUseCase).to(GetOrder).inTransientScope();
    container.bind<IListOrderUseCase>(TYPES.ListOrderUseCase).to(ListOrder).inTransientScope();
    container.bind<IUpdateOrderUseCase>(TYPES.UpdateOrderUseCase).to(UpdateOrder).inTransientScope();
    container.bind<IUpdateOrderStatusUseCase>(TYPES.UpdateOrderStatusUseCase).to(UpdateOrderStatus).inTransientScope();
}
