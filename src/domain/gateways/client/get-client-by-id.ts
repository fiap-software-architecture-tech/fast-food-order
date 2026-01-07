import { Client } from '#/domain/entities/client.entity';

export interface GetClientById {
    execute(id: string): Promise<Client | null>;
}
