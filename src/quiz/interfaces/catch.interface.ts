import { Document } from 'mongoose';
import { Species } from './species.interface';

export interface Catch extends Document {
  readonly name: string;
  readonly family: string;
  readonly weight?: number;
  readonly specie: Species;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
