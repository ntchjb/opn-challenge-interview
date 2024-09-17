import { Module } from '@nestjs/common';
import { InmemoryDatabase } from './inmemory.db';

@Module({
  providers: [InmemoryDatabase],
  exports: [InmemoryDatabase],
})
export class InMemoryDatabaseModule {}
