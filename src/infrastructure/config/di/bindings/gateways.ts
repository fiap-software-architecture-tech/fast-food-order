import { Container } from 'inversify';

import { GetClientByCpf } from '#/domain/gateways/client/get-client-by-cpf';
import { GetClientById } from '#/domain/gateways/client/get-client-by-id';
import { TYPES } from '#/infrastructure/config/di/types';
import { FastFoodGetClientByCpf } from '#/infrastructure/gateways/fast-food-client/fast-food-get-client-by-cpf';
import { FastFoodGetClientById } from '#/infrastructure/gateways/fast-food-client/fast-food-get-client-by-id';

export function bindGateways(container: Container) {
    container.bind<GetClientByCpf>(TYPES.GetClientByCpfGateway).to(FastFoodGetClientByCpf).inTransientScope();
    container.bind<GetClientById>(TYPES.GetClientByIdGateway).to(FastFoodGetClientById).inTransientScope();
}
