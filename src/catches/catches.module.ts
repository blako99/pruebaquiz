import { Module } from '@nestjs/common';
import { CatchesController } from './catches.controller';
import { CatchesService } from './catches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatchesSchema } from './schemas/catches.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Catches', schema: CatchesSchema }]),
  ],
  controllers: [CatchesController],
  providers: [CatchesService],
  exports: [CatchesService],
})
export class CatchesModule {}
