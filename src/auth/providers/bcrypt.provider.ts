import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  hashing(data: string | Buffer): Promise<string> {
    throw new Error('Method not implemented.');
  }
  compatePassword(data: string | Buffer, encrypt: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
