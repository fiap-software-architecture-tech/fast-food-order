import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify, { FastifyInstance } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { container } from '#/infrastructure/config/di/container';
import { errorHandler } from '#/interfaces/http/middlewares/error-handler';
import { registerRoutes } from '#/interfaces/http/routes';

export async function createApp(): Promise<FastifyInstance> {
    const app = fastify({ logger: true });

    app.decorate('container', container);

    app.setSerializerCompiler(serializerCompiler);
    app.setValidatorCompiler(validatorCompiler);

    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'API FastFood Orders',
                description: 'Documentação da API FastFood Orders',
                version: '1.0.0',
            },
            tags: [
                {
                    name: 'Pedidos',
                    description: 'Operações relacionadas a pedidos',
                },
            ],
        },
        transform: jsonSchemaTransform,
    });

    app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    });

    registerRoutes(app);

    app.setErrorHandler(errorHandler);

    return app;
}
