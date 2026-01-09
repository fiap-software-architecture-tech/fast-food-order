import { Container } from 'inversify';

import { IHttpClientService } from '#/domain/services/http-client.service';
import { ILogger } from '#/domain/services/logger.service';
import { ProductValidatorService } from '#/domain/services/product-validator.service';
import { IValidatorTokenService } from '#/domain/services/validator-token.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { createPinoLogger } from '#/infrastructure/config/logger';
import { AxiosHttpClientService } from '#/infrastructure/services/axios-http-client.service';
import { JwtValidatorTokenService } from '#/infrastructure/services/jwt-validator-token.service';
import { PinoLoggerService } from '#/infrastructure/services/pino-logger.service';

export function bindServices(container: Container) {
    container.bind<IValidatorTokenService>(TYPES.ValidatorTokenService).to(JwtValidatorTokenService).inSingletonScope();
    container.bind<IHttpClientService>(TYPES.HttpClientService).to(AxiosHttpClientService).inSingletonScope();
    container
        .bind<ProductValidatorService>(TYPES.ProductValidatorService)
        .to(ProductValidatorService)
        .inSingletonScope();
    container
        .bind<ILogger>(TYPES.Logger)
        .toDynamicValue(() => {
            return new PinoLoggerService(createPinoLogger());
        })
        .inRequestScope();
}
