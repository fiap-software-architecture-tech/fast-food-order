import fastify, { FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { container } from '#/infrastructure/config/di/container';
import { errorHandler } from '#/interfaces/http/middlewares/error-handler';
import { orderRoute } from '#/interfaces/http/routes/order.route';

export async function createApp(): Promise<FastifyInstance> {
    const app = fastify({ logger: true });

    app.decorate('container', container);

    app.setSerializerCompiler(serializerCompiler);
    app.setValidatorCompiler(validatorCompiler);

    app.register(orderRoute);

    app.setErrorHandler(errorHandler);

    return app;
}
