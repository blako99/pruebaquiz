import { Schema } from 'mongoose';

var mongoose = require('mongoose');

export const CatchesSchema = new Schema({
  name: { type: String, required: true },
  family: { type: Schema.Types.ObjectId, ref: 'family' },
  weight: Number, //poner como opcional
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

//
module.exports = mongoose.model('Catches', CatchesSchema);
