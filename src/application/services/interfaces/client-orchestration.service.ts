import { IClient } from '#/domain/entities/client.entity';

export interface IClientOrchestrationService {
    getClientIfExists(clientId: string): Promise<IClient>;
}
