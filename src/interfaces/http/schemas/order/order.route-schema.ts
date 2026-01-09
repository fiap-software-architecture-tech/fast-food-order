import z from 'zod';

import { badRequestSchema, notFoundSchema } from '#/interfaces/http/schemas/common/error.schema';
import {
    orderCreateRequestSchema,
    orderParamsRequestSchema,
    orderQueryRequestSchema,
    orderUpdateStatusRequestSchema,
} from '#/interfaces/http/schemas/order/order-request.schema';
import {
    orderResponseSchema,
    updateOrderStatusResponseSchema,
} from '#/interfaces/http/schemas/order/order-response.schema';

export const orderCreateSchema = {
    schema: {
        tags: ['Pedidos'],
        summary: 'Cria pedido',
        body: orderCreateRequestSchema,
        response: {
            201: orderResponseSchema,
            400: badRequestSchema,
        },
    },
};

export const orderGetSchema = {
    schema: {
        tags: ['Pedidos'],
        summary: 'Busca pedido',
        params: orderParamsRequestSchema,
        response: {
            200: orderResponseSchema,
            404: notFoundSchema,
        },
    },
};

export const orderListSchema = {
    schema: {
        tags: ['Pedidos'],
        summary: 'Lista pedidos',
        query: orderQueryRequestSchema,
        response: {
            200: z.array(orderResponseSchema),
        },
    },
};

export const orderUpdateStatusSchema = {
    schema: {
        tags: ['Pedidos'],
        summary: 'Atualiza status do pedido',
        params: orderParamsRequestSchema,
        body: orderUpdateStatusRequestSchema,
        response: {
            200: updateOrderStatusResponseSchema,
            400: badRequestSchema,
            404: notFoundSchema,
        },
    },
};

export const orderPaymentApprovedSchema = {
    schema: {
        tags: ['Pedidos'],
        summary: 'Notifica produção quando pagamento é aprovado',
        params: orderParamsRequestSchema,
        response: {
            200: z.void(),
            400: badRequestSchema,
            404: notFoundSchema,
        },
    },
};

export const orderPaymentFailedSchema = {
    schema: {
        tags: ['Pedidos'],
        summary: 'Atualiza pedido quando pagamento falha',
        params: orderParamsRequestSchema,
        response: {
            200: z.void(),
            400: badRequestSchema,
            404: notFoundSchema,
        },
    },
};
