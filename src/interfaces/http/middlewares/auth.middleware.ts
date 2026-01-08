import { FastifyRequest } from 'fastify';
import { inject, injectable } from 'inversify';

import { UnauthorizedError } from '#/domain/errors';
import { IGetClientByCpf } from '#/domain/gateways/client/get-client-by-cpf';
import { ILogger } from '#/domain/services/logger.service';
import { IValidatorTokenService } from '#/domain/services/validator-token.service';
import { TYPES } from '#/infrastructure/config/di/types';

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(TYPES.Logger) private readonly logger: ILogger,
        @inject(TYPES.ValidatorTokenService) private readonly validatorTokenService: IValidatorTokenService,
        @inject(TYPES.GetClientByCpfGateway) private readonly getClientByCpf: IGetClientByCpf,
    ) {}

    handle = async (request: FastifyRequest) => {
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            return;
        }

        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new UnauthorizedError('Invalid token format');
        }

        const payload = this.validatorTokenService.validate(token);

        const client = await this.getClientByCpf.execute(payload.cpf);

        if (!client) {
            this.logger.warn('Authentication failed - client not found', { cpf: payload.cpf });
            throw new UnauthorizedError('Client not found');
        }

        request.client = client;
    };
}
