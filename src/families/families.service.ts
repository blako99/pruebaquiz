import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Families } from './interfaces/families.interface';
import { Model } from 'mongoose';
const mongoose = require('mongoose');

@Injectable()
export class FamiliesService {
  constructor(
    @InjectModel('Families')
    private readonly familiesModel: Model<Families>,
  ) {}

  getFakeFamilies(id: string) {
    //Devuelve 3 especies aleatorias
    //distintas a la pasada como parámetro
    let ObjectId = mongoose.Types.ObjectId;
    let fakeFamilies = this.familiesModel.aggregate([
      { $match: { _id: { $ne: ObjectId(id) } } },
      { $sample: { size: 3 } },
    ]);

    return fakeFamilies;
  }
}
