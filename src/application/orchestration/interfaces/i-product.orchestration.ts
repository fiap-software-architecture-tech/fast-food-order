import { IProduct } from '#/domain/entities/product.entity';

export interface IProductOrchestration {
    validateAndGetProducts(orderProducts: { productId: string; quantity: number }[]): Promise<IProduct[]>;
}
