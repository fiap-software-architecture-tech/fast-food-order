import { Product } from '#/domain/entities/product.entity';

export interface IFindManyProducts {
    execute(ids: string[]): Promise<Product[]>;
}
