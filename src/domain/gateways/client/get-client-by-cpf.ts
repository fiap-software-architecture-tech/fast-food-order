import { Client } from '#/domain/entities/client.entity';

export interface IGetClientByCpf {
    execute(cpf: string): Promise<Client | null>;
}
