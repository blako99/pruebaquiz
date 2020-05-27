import { Injectable, Req, Catch } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Catches } from './interfaces/catches.interface';
@Injectable()
export class CatchesService {
  constructor(
    @InjectModel('Catches') private readonly catchesModel: Model<Catches>, //private familiesService: FamiliesService,
  ) {}

  async getRandomCatches(): Promise<any> {
    //Devolvemos las capturas aleatorias(que  no dependen del peso)
    let catches = await this.catchesModel.aggregate([
      { $unwind: '$family' },
      {
        $sample: { size: 2 },
      },
      { $project: { _id: 0, name: 0, weight: 0 } },
      {
        $lookup: {
          from: 'families',
          as: 'family',
          let: { family: '$family' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$_id', '$$family'] }] } } },
          ],
        },
      },
      { $unwind: '$family' },
    ]);

    return catches;
  }

  async getCatchesWeight(): Promise<Catches[]> {
    //Devolvemos los pesos de {$size} capturas aleatorias(que tienen peso)
    var capturesRandomWeight = await this.catchesModel.aggregate([
      { $match: { weight: { $exists: true } } },
      { $sample: { size: 2 } },
      {
        $lookup: {
          from: 'families',
          localField: 'family',
          foreignField: '_id',
          as: 'family',
        },
      },
      { $project: { _id: 0, weight: 1 } },
    ]);
    return capturesRandomWeight;
  }
}
