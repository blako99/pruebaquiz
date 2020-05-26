import { Module } from '@nestjs/common';
import { CatchesController } from './catches.controller';
import { CatchesService } from './catches.service';

@Module({
  controllers: [CatchesController],
  providers: [CatchesService]
})
export class CatchesModule {}
