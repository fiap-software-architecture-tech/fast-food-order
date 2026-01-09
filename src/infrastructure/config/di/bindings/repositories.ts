import { Container } from 'inversify';

import { IOrderRepository } from '#/domain/repositories/order.repository';
import { TYPES } from '#/infrastructure/config/di/types';
import { PrismaOrderRepository } from '#/infrastructure/repositories/prisma/prisma-order.repository';

export function bindRepositories(container: Container) {
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(PrismaOrderRepository).inSingletonScope();
}
