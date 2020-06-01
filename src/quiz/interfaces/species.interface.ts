import { Document } from 'mongoose';

export interface Species extends Document {
  readonly family: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly parentSpecie: string;
}
