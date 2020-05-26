import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Families } from './interfaces/families.interface';
import { Model } from 'mongoose';

@Injectable()
export class FamiliesService {
  constructor(
    //este inject model es el families module
    @InjectModel('Families') private readonly familiesModel: Model<Families>,
  ) {}
  async getFamilies(): Promise<Families[]> {
    const families = await this.familiesModel.find();
    return families;
  }
}
