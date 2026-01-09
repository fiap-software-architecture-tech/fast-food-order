import z from 'zod';

const envSchema = z.object({
    // Environment
    NODE_ENV: z.enum(['dev', 'hml', 'prd']).default('dev'),

    // Server
    PORT: z.coerce.number().default(3000),

    // Database
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.coerce.number().default(3306),
    DATABASE_USER: z.string(),
    DATABASE_PASS: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_URL: z.string(),

    // API URL
    FAST_FOOD_API_URL: z.string().url(),
    FAST_FOOD_PAYMENT_API_URL: z.string().url(),
    FAST_FOOD_COOK_TO_ORDER_API_URL: z.string().url(),

    // JWT
    JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
