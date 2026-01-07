import { IProduct } from '#/domain/entities/product.entity';
import { NotFoundError } from '#/domain/errors';

export class ProductValidationFactory {
    static validateProductsExist(
        requestProducts: { productId: string; quantity: number }[],
        availableProducts: IProduct[],
    ): void {
        if (availableProducts.length !== requestProducts.length) {
            throw new NotFoundError('One or more products not found');
        }
    }

    static validateQuantities(requestedProducts: Array<{ quantity: number }>): void {
        if (requestedProducts.some(item => item.quantity <= 0)) {
            throw new Error('Product quantity must be greater than 0');
        }
    }

    static findProductById(productId: string, products: IProduct[]): IProduct {
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new NotFoundError(`Product with id ${productId} not found`);
        }
        return product;
    }
}
