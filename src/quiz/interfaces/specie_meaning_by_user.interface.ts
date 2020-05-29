import { Document } from 'mongoose';

export interface Specie_meaning_by_user extends Document {
  readonly owner: string;
  readonly specie: [];
  readonly parentSpecie: string;
  readonly fishingIn: string;
  readonly createdAt: Date;
}
