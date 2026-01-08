import { Container } from 'inversify';

import { IGetClientByCpf } from '#/domain/gateways/client/get-client-by-cpf';
import { IGetClientById } from '#/domain/gateways/client/get-client-by-id';
import { ICreatePayment } from '#/domain/gateways/payment/create-payment';
import { IGetPayment } from '#/domain/gateways/payment/get-payment';
import { IFindManyProducts } from '#/domain/gateways/product/find-many-products';
import { TYPES } from '#/infrastructure/config/di/types';
import { FastFoodGetClientByCpf } from '#/infrastructure/gateways/fast-food-client/fast-food-get-client-by-cpf';
import { FastFoodGetClientById } from '#/infrastructure/gateways/fast-food-client/fast-food-get-client-by-id';
import { FastFoodCreatePayment } from '#/infrastructure/gateways/fast-food-payment/fast-food-create-payment';
import { FastFoodGetPayment } from '#/infrastructure/gateways/fast-food-payment/fast-food-get-payment';
import { FastFoodFindManyProducts } from '#/infrastructure/gateways/fast-food-product/fast-food-find-many-products';

export function bindGateways(container: Container) {
    container.bind<IGetClientByCpf>(TYPES.GetClientByCpfGateway).to(FastFoodGetClientByCpf).inTransientScope();
    container.bind<IGetClientById>(TYPES.GetClientByIdGateway).to(FastFoodGetClientById).inTransientScope();
    container.bind<IFindManyProducts>(TYPES.FindManyProductsGateway).to(FastFoodFindManyProducts).inTransientScope();
    container.bind<ICreatePayment>(TYPES.CreatePaymentGateway).to(FastFoodCreatePayment).inTransientScope();
    container.bind<IGetPayment>(TYPES.GetPaymentGateway).to(FastFoodGetPayment).inTransientScope();
}
