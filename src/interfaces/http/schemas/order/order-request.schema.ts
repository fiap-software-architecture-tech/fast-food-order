import z from 'zod';

const VALIDATION_MESSAGES = {
    PRODUCT_REQUIRED: 'ProductId is required',
    QUANTITY_REQUIRED: 'Quantity is required',
    QUANTITY_MUST_BE_POSITIVE: 'The quantity must be greater than zero',
    MINIMUM_PRODUCTS: 'At least one item is required in the order',
    INVALID_UUID: 'Invalid UUID format',
} as const;

const orderProductSchema = z.object({
    productId: z.string({ required_error: VALIDATION_MESSAGES.PRODUCT_REQUIRED }),
    quantity: z
        .number({ message: VALIDATION_MESSAGES.QUANTITY_REQUIRED })
        .positive({ message: VALIDATION_MESSAGES.QUANTITY_MUST_BE_POSITIVE }),
});

export const orderCreateRequestSchema = z.object({
    clientId: z.string().optional(),
    orderProducts: z.array(orderProductSchema).min(1, { message: VALIDATION_MESSAGES.MINIMUM_PRODUCTS }),
});

export const orderQueryRequestSchema = z.object({
    status: z.string().optional(),
    clientId: z.string().optional(),
    productId: z.string().optional(),
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(10),
});

export const orderUpdateStatusRequestSchema = z.object({
    status: z.enum(['WAITING', 'RECEIVED', 'IN_PROGRESS', 'DONE', 'FINISHED', 'CANCELED']),
});

export const orderParamsRequestSchema = z.object({
    id: z.string().uuid({ message: VALIDATION_MESSAGES.INVALID_UUID }),
});

export type OrderCreateRequest = z.infer<typeof orderCreateRequestSchema>;
export type OrderQueryRequest = z.infer<typeof orderQueryRequestSchema>;
export type OrderUpdateStatusRequest = z.infer<typeof orderUpdateStatusRequestSchema>;
export type OrderParamsRequest = z.infer<typeof orderParamsRequestSchema>;
