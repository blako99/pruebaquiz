import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
var convert = require('convert-units');
import { Capturas } from './interfaces/capturas.interface';
import { Species } from './interfaces/species.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Species') private readonly speciesModel: Model<Species>,
    @InjectModel('Capturas') private readonly capturasModel: Model<Capturas>,
  ) {}

  async prueba() {
    let a = await this.speciesModel.aggregate([{ $sample: { size: 1 } }]);

    let b = await this.capturasModel.aggregate([{ $sample: { size: 1 } }]);

    return { b, a };
  }
}

/*  async whatIsTheFamily(capture, user, fakefamily) {
    let question =
      user.lang === 'es' ? '¿Qué especie es?' : 'What is the specie?';

    let answers;

    fakefamily.push({
      _id: capture._id,
      name: capture.name,
      correctAnswer: true,
    });
    answers = fakefamily.sort(disorganize);
    return { question, answers }; //ver como introducir la respuesta segun el idioma
  }

  whatIsTheWeight(capture, user) {
    let question = user.lang === 'es' ? '¿Cuánto pesa?' : 'What is the weight?';

    let weight = capture.weight;

    let answers = [];

    //RANGOS DE PORCENTAJE para calcular los pesos aleatorios
    //cuanto mas pequeño es el  rango,mayor será la diferencia
    const smallRange = [
      [2, 2.5],
      [3, 3.5],
      [4, 4.5],
    ];

    const mediumRange = [
      [0.25, 2],
      [0.5, 1.5],
      [0.75, 1.25],
    ];

    const largeRange = [
      [0.7, 1.3],
      [0.8, 1.2],
      [0.9, 1.1],
    ];
    //entre 5000 gramos y 300,se usara el rango mediano
    //para mas de 5000 gramos el rango grande
    //para menos de 300 gramos el rango pequeño
    let range = weight > 5000 ? largeRange : mediumRange;
    range = weight <= 300 ? smallRange : range;

    //generamos los pesos aleatorios teniendo en cuenta el sistema métrico del usuario
    for (let i = 0; i < 3; i++) {
      let auxWeight;
      let calculatedWeight;
      let random = Math.round(Math.random());
      let randomWeight = weight * range[i][random];

      //se comprueba que es multiplo de 5 porque al subir una captura, segun el sistema metrico utilizado,
      //se usará una medida de redondeo u otra para ajustar los pesos aleatorios
      if (weight % 5 !== 0) {
        calculatedWeight = Math.round(randomWeight);
      } else {
        calculatedWeight =
          Math.ceil(Math.round(randomWeight / 10) / 5) * 5 * 10; //multiplos de 5
      }

      if (user.unit === 'g') {
        auxWeight = convert(calculatedWeight)
          .from('g')
          .toBest();
        calculatedWeight = auxWeight.val;
      } else {
        let auxConverted = convert(calculatedWeight)
          .from('g')
          .to('oz');

        auxWeight = convert(auxConverted)
          .from('oz')
          .toBest();

        calculatedWeight =
          auxWeight.unit === 'oz'
            ? Math.round(auxWeight.val)
            : Math.round(auxWeight.val * 100) / 100; //redondeamos a dos decimales
      }

      answers.push({ weight: `${calculatedWeight} ${auxWeight.unit}` }); //tenemos los 3 pesos fake
    }

    //convertimos el peso de la captura al sistema metrico del usuario
    if (user.unit === 'g') {
      weight = convert(weight)
        .from('g')
        .toBest();
    } else {
      weight = convert(weight)
        .from('g')
        .to('oz');
      weight = convert(weight)
        .from('oz')
        .toBest();
      weight.val =
        weight.unit === 'oz'
          ? Math.round(weight.val)
          : Math.round(weight.val * 100) / 100;
    }

    //aqui añadimos el peso correcto(que viene como parametro de la captura)
    answers.push({
      weight: `${weight.val} ${weight.unit}`,
      correctAnswer: true,
    });

    //desordenamos el array de preguntas
    let aux = answers.sort(disorganize);

    return { question, answers: aux };
  }
}

function disorganize() {
  return Math.random() - 0.5;
} */

/* 
FAMILIAS SERVICE
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
 */

/*

 CATCHES SERVICE


 import { Injectable, Req, Catch } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Catches } from './interfaces/catches.interface';
import { Capturas } from './../../dist/capturas/interfaces/capturas.interface.d';
import { Capturas } from './interfaces/capturas.interface';
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




 */
