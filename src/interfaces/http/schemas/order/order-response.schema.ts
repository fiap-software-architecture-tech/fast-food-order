import z from 'zod';

export const orderResponseSchema = z.object({
    id: z.string().uuid().optional(),
    totalAmount: z.number(),
    orderNumber: z.number(),
    status: z.string(),
    orderProducts: z
        .array(
            z.object({
                id: z.string().uuid(),
                productId: z.string().uuid(),
                name: z.string(),
                description: z.string().nullable(),
                category: z.string(),
                unitPrice: z.number(),
                quantity: z.number(),
                subtotal: z.number(),
            }),
        )
        .optional(),
    payment: z
        .object({
            id: z.string().uuid(),
            status: z.string(),
            externalReference: z.string(),
            qrCode: z.string(),
            createdAt: z.date().optional(),
            updatedAt: z.date().optional(),
        })
        .optional(),
    client: z
        .object({
            id: z.string().uuid(),
            name: z.string(),
            cpf: z.string().length(11),
            email: z.string().email(),
        })
        .optional(),
});

export const updateOrderStatusResponseSchema = z.object({
    message: z.string().describe('Mensagem de sucesso'),
});

export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type UpdateOrderStatusResponse = z.infer<typeof updateOrderStatusResponseSchema>;
