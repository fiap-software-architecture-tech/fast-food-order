import { FastifyInstance } from 'fastify';

import { AuthMiddleware } from '#/interfaces/http/middlewares/auth.middleware';
import { orderRoute } from '#/interfaces/http/routes/order.route';

export function registerRoutes(app: FastifyInstance) {
    const authMiddleware = app.container.get(AuthMiddleware);

    app.addHook('onRequest', authMiddleware.handle);

    app.register(orderRoute, { prefix: '/order' });
}
