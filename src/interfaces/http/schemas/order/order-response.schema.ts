import z from 'zod';

export const orderResponseSchema = z.object({
    id: z.string().uuid().optional(),
    value: z.number(),
    orderNumber: z.number(),
    status: z.string(),
    orderProducts: z
        .array(
            z.object({
                id: z.string().uuid(),
                amount: z.number(),
                value: z.number(),
                product: z.object({
                    id: z.string(),
                    name: z.string(),
                    value: z.number(),
                    description: z.string().nullable(),
                }),
            }),
        )
        .optional(),
    payments: z
        .array(
            z.object({
                id: z.string().uuid(),
                status: z.string(),
                externalReference: z.string().nullable(),
                qrCode: z.string().nullable(),
                createdAt: z.date().optional(),
                updatedAt: z.date().optional(),
            }),
        )
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

export type OrderResponse = z.infer<typeof orderResponseSchema>;
