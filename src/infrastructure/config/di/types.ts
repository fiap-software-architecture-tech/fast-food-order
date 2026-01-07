export const TYPES = {
    // Database
    PrismaClient: Symbol.for('PrismaClient'),

    // Controllers
    OrderController: Symbol.for('OrderController'),

    // Use Cases
    CreateOrderUseCase: Symbol.for('CreateOrderUseCase'),
    DeleteOrderUseCase: Symbol.for('DeleteOrderUseCase'),
    GetOrderUseCase: Symbol.for('GetOrderUseCase'),
    ListOrderUseCase: Symbol.for('ListOrderUseCase'),
    UpdateOrderUseCase: Symbol.for('UpdateOrderUseCase'),
    UpdateOrderStatusUseCase: Symbol.for('UpdateOrderStatusUseCase'),

    // Repositories
    OrderRepository: Symbol.for('OrderRepository'),

    // Gateway
    GetClientByCpfGateway: Symbol.for('GetClientByCpfGateway'),
    GetClientByIdGateway: Symbol.for('GetClientByIdGateway'),

    // Services
    ValidatorTokenService: Symbol.for('ValidatorTokenService'),
    HttpClientService: Symbol.for('HttpClientService'),
    Logger: Symbol.for('Logger'),
} as const;
