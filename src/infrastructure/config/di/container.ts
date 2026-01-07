import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import { bindControllers } from '#/infrastructure/config/di/bindings/controllers';
import { bindGateways } from '#/infrastructure/config/di/bindings/gateways';
import { bindServices } from '#/infrastructure/config/di/bindings/services';
import { bindUseCases } from '#/infrastructure/config/di/bindings/use-cases';
import { TYPES } from '#/infrastructure/config/di/types';

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
bindServices(container);
bindUseCases(container);

export { container };
