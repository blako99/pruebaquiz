import { Document } from 'mongoose';

export interface Families extends Document {
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
