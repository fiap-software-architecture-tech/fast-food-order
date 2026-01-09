import { CreateCookToOrderDTO } from '#/domain/gateways/cook-to-order/dto/create-cook-to-order.dto';

export interface ICreateCookToOrder {
    execute(request: CreateCookToOrderDTO): Promise<void>;
}
