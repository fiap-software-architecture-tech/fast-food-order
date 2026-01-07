import { inject, injectable } from 'inversify';

import { IProductOrchestration } from '#/application/orchestration/interfaces/i-product.orchestration';
import { Product } from '#/domain/entities/product.entity';
import { ProductValidationFactory } from '#/domain/factories/product-validation.factory';
import { IProductRepository } from '#/domain/repositories/product.repository';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class ProductOrchestration implements IProductOrchestration {
    constructor(@inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository) {}

    async validateAndGetProducts(
        requestedProducts: Array<{ productId: string; quantity: number }>,
    ): Promise<Product[]> {
        ProductValidationFactory.validateQuantities(requestedProducts);

        const productIds = requestedProducts.map(item => item.productId);
        const products = await this.productRepository.findMany(productIds);

        ProductValidationFactory.validateProductsExist(requestedProducts, products);

        return products;
    }
}
