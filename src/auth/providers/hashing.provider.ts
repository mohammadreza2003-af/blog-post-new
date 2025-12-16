import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hashing(data: string | Buffer): Promise<string>;
  abstract compatePassword(
    data: string | Buffer,
    encrypt: string,
  ): Promise<boolean>;
}
