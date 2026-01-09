import { Client } from '#/domain/entities/client.entity';

export interface IGetClientById {
    execute(id: string): Promise<Client | null>;
}
