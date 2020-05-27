import { Document } from 'mongoose';

export interface Capturas extends Document {
  readonly name: string;
  readonly family: string;
  weight?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
