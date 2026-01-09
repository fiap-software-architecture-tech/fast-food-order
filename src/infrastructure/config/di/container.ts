import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import { bindControllers } from '#/infrastructure/config/di/bindings/controllers';
import { bindGateways } from '#/infrastructure/config/di/bindings/gateways';
import { bindRepositories } from '#/infrastructure/config/di/bindings/repositories';
import { bindServices } from '#/infrastructure/config/di/bindings/services';
import { bindUseCases } from '#/infrastructure/config/di/bindings/use-cases';
import { TYPES } from '#/infrastructure/config/di/types';
import { AuthMiddleware } from '#/interfaces/http/middlewares/auth.middleware';

const container = new Container();

container
    .bind<PrismaClient>(TYPES.PrismaClient)
    .toDynamicValue(() => {
        return new PrismaClient({
            log: ['error'],
        });
    })
    .inSingletonScope();

bindControllers(container);
bindGateways(container);
bindRepositories(container);
bindServices(container);
bindUseCases(container);

container.bind(AuthMiddleware).toSelf().inSingletonScope();

export { container };
