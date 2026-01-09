export interface IPaymentFailedUseCase {
    execute(orderId: string): Promise<void>;
}
