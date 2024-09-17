import { Injectable } from '@nestjs/common';

@Injectable()
export class InmemoryDatabase {
  private data: { [key: string]: any } = {};

  public get<T>(key: string): T | undefined {
    return this.data[key];
  }

  public set<T>(key: string, value: T) {
    this.data[key] = value;
  }

  public delete(key: string) {
    delete this.data[key];
  }
}
