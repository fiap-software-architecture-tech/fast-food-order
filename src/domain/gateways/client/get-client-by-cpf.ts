import { Client } from '#/domain/entities/client.entity';

export interface GetClientByCpf {
    execute(cpf: string): Promise<Client | null>;
}
