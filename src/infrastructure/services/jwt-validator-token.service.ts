import { inject } from 'inversify';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '#/domain/errors';
import { ILogger } from '#/domain/services/logger.service';
import { IValidatorTokenService } from '#/domain/services/validator-token.service';
import { TYPES } from '#/infrastructure/config/di/types';
import { env } from '#/infrastructure/config/env';

export class JwtValidatorTokenService implements IValidatorTokenService {
    private readonly secret = env.JWT_SECRET;

    constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {}

    validate(token: string): any {
        try {
            const decoded = jwt.verify(token, this.secret);
            return decoded;
        } catch (error) {
            this.logger.error('Error validating token', error as Error);
            throw new UnauthorizedError('Invalid token');
        }
    }
}
