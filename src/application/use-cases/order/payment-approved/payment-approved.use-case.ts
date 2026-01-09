export interface IPaymentApprovedUseCase {
    execute(orderId: string): Promise<void>;
}
