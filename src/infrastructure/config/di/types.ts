export const TYPES = {
    // Database
    PrismaClient: Symbol.for('PrismaClient'),

    // Controllers
    OrderController: Symbol.for('OrderController'),

    // Use Cases
    CreateOrderUseCase: Symbol.for('CreateOrderUseCase'),
    GetOrderUseCase: Symbol.for('GetOrderUseCase'),
    ListOrderUseCase: Symbol.for('ListOrderUseCase'),
    UpdateOrderStatusUseCase: Symbol.for('UpdateOrderStatusUseCase'),
    PaymentApprovedUseCase: Symbol.for('PaymentApprovedUseCase'),
    PaymentFailedUseCase: Symbol.for('PaymentFailedUseCase'),

    // Repositories
    OrderRepository: Symbol.for('OrderRepository'),

    // Gateway
    GetClientByCpfGateway: Symbol.for('GetClientByCpfGateway'),
    GetClientByIdGateway: Symbol.for('GetClientByIdGateway'),
    FindManyProductsGateway: Symbol.for('FindManyProductsGateway'),
    CreatePaymentGateway: Symbol.for('CreatePaymentGateway'),
    GetPaymentGateway: Symbol.for('GetPaymentGateway'),
    CreateCookToOrderGateway: Symbol.for('CreateCookToOrderGateway'),

    // Services
    ValidatorTokenService: Symbol.for('ValidatorTokenService'),
    HttpClientService: Symbol.for('HttpClientService'),
    ProductValidatorService: Symbol.for('ProductValidatorService'),
    Logger: Symbol.for('Logger'),
} as const;
