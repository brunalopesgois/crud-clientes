import { Phone } from './phone.model';

export abstract class Client {
  constructor(
    private id: number,
    private email: string,
    private phones: Phone[],
  ) {}
}
