import { Schema } from 'mongoose';

export const FamiliesSchema = new Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
    versionKey: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
