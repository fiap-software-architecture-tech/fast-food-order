import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '#/infrastructure/config/di/types';
import { OrderController } from '#/interfaces/controller/order.controller';
import {
    OrderCreateRequest,
    OrderParamsRequest,
    OrderQueryRequest,
    OrderUpdateStatusRequest,
} from '#/interfaces/http/schemas/order/order-request.schema';
import {
    orderCreateSchema,
    orderGetSchema,
    orderListSchema,
    orderUpdateStatusSchema,
} from '#/interfaces/http/schemas/order/order.route-schema';

export const orderRoute = (app: FastifyInstance) => {
    const controller = app.container.get<OrderController>(TYPES.OrderController);

    app.post<{ Body: OrderCreateRequest }>('/', orderCreateSchema, async (req, reply) => {
        const client = req.client;
        const response = await controller.create(req.body, client);
        return reply.status(StatusCodes.CREATED).send(response);
    });

    app.get<{ Params: OrderParamsRequest }>('/:id', orderGetSchema, async (req, reply) => {
        const response = await controller.get(req.params.id);
        return reply.send(response);
    });

    app.get<{ Querystring: OrderQueryRequest }>('/', orderListSchema, async (req, reply) => {
        const response = await controller.list(req.query);
        return reply.send(response);
    });

    app.patch<{
        Params: OrderParamsRequest;
        Body: OrderUpdateStatusRequest;
    }>('/:id/status', orderUpdateStatusSchema, async (req, reply) => {
        const response = await controller.updateStatus(req.params.id, req.body);
        return reply.send(response);
    });
};
