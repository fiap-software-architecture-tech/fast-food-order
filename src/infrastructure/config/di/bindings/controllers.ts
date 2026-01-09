import { Container } from 'inversify';

import { TYPES } from '#/infrastructure/config/di/types';
import { OrderController } from '#/interfaces/controller/order.controller';

export function bindControllers(container: Container) {
    container.bind<OrderController>(TYPES.OrderController).to(OrderController).inTransientScope();
}
