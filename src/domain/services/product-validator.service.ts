import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';

import { Product } from '#/domain/entities/product.entity';
import { BusinessError } from '#/domain/errors';

@injectable()
export class ProductValidatorService {
    validateAllProductsExist(requestedIds: string[], foundProducts: Product[]): void {
        if (foundProducts.length !== requestedIds.length) {
            const foundIds = foundProducts.map(p => p.id);
            const notFoundIds = requestedIds.filter(id => !foundIds.includes(id));
            throw new BusinessError(StatusCodes.BAD_REQUEST, `Products not found: ${notFoundIds.join(', ')}`);
        }
    }
}
