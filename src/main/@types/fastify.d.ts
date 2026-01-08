import { Container } from 'inversify';

import { Client } from '#/domain/entities/client.entity';

declare module 'fastify' {
    interface FastifyInstance {
        container: Container;
    }

    interface FastifyRequest {
        client?: Client;
    }
}
