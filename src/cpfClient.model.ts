import { Phone } from './phone.model';
import { Client } from './client';

export class CpfClient extends Client {
  private cpf: string;
  private nome: string;

  constructor(
    id: number,
    email: string,
    phones: Phone[],
    cpf: string,
    nome: string,
  ) {
    super(id, email, phones);
    this.cpf = cpf;
    this.nome = nome;
  }
}
