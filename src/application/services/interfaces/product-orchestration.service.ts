import { IProduct } from '#/domain/entities/product.entity';

export interface IProductOrchestrationService {
    validateAndGetProducts(orderProducts: { productId: string; quantity: number }[]): Promise<IProduct[]>;
}
