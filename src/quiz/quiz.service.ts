import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
var convert = require('convert-units');
import { Capturas } from './interfaces/capturas.interface';
import { Species } from './interfaces/species.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Specie_meaning_by_user } from './interfaces/specie_meaning_by_user.interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Species') private readonly speciesModel: Model<Species>,
    @InjectModel('Capturas') private readonly capturasModel: Model<Capturas>,
    @InjectModel('Specie_meaning_by_user')
    private readonly meaningModel: Model<Specie_meaning_by_user>,
  ) {}

  async getQuiz() {
    let user = {
      _id: 'oQyyn36oKp28hSxtn',
      profile: { lang: 'en', systemMedition: 2 },
    }; //unit puede ser oz u g

    if (!user._id) {
      return { message: 'No existe el usuario' };
    }

    let quiz = [];
    let questions = [];
    let questionCaptures = [];
    let questionWeight = [];

    //Obtenemos todas las capturas
    let randomCaptures = await this.getRandomCatches();
    let randomCapturesWeight = await this.getCatchesWeight();

    //Recorremos las capturas que no dependen del peso para asignarles una pregunta a cada captura
    for (let i in randomCaptures) {
      let specieId = randomCaptures[i].specie._id;
      let parentSpecieId = randomCaptures[i].specie.parentSpecie;
      // Obtenemos las 3 especies fake
      let fakefamily = await this.getFakeFamilies(
        user,
        specieId,
        parentSpecieId,
      );
      //Obtenemos la acepcion favorita del usuario o la principal de la especie correcta
      let userMeaningSpecie = await this.getUserMeaningSpecie(
        user,
        specieId,
        parentSpecieId,
      );
      //Se crea la pregunta de la especie correspondiente a la captura
      let question = await this.whatIsTheFamily(
        randomCaptures[i],
        user,
        fakefamily,
        userMeaningSpecie.family,
      );
      questionCaptures.push(question);
    }

    //Recorremos las capturas que  dependen del peso para asignarles una pregunta a cada captura
    for (let i in randomCapturesWeight) {
      let specieId = randomCaptures[i].specie._id;
      let parentSpecieId = randomCaptures[i].specie.parentSpecie;

      //Obtenemos la acepcion favorita del usuario o la acepcion principal
      //para mostrarla en el enunciado de la pregunta
      let userMeaningSpecie = await this.getUserMeaningSpecie(
        user,
        specieId,
        parentSpecieId,
      );
      //Se crea la pregunta correspondiente al peso de la captura
      let question = this.whatIsTheWeight(
        randomCapturesWeight[i],
        user,
        userMeaningSpecie.family,
      );
      questionWeight.push(question);
    }

    //juntamos las preguntas
    questions = questionCaptures.concat(questionWeight);

    //las desordenamos
    quiz = questions.sort(disorganize);

    return quiz;
  }

  async getRandomCatches(): Promise<any> {
    //Devolvemos las capturas aleatorias(que  no dependen del peso)
    let catches = await this.capturasModel.aggregate([
      { $sample: { size: 2 } },

      {
        $lookup: {
          from: 'species',
          localField: 'specie',
          foreignField: '_id',
          as: 'specie',
        },
      },
      { $unwind: '$specie' },
      {
        $project: {
          _id: 1,
          'specie._id': 1,
          'specie.parentSpecie': 1,
          'specie.family': 1,
        },
      },
    ]);

    return catches;
  }

  async getCatchesWeight(): Promise<Capturas[]> {
    //Devolvemos los pesos de {$size} capturas aleatorias(que tienen peso)
    var capturesRandomWeight = await this.capturasModel.aggregate([
      {
        $match: {
          $and: [{ weight: { $exists: true } }, { weight: { $gt: 50 } }],
        },
      },
      { $sample: { size: 2 } },

      {
        $lookup: {
          from: 'species',
          localField: 'specie',
          foreignField: '_id',
          as: 'specie',
        },
      },
      { $unwind: '$specie' },

      { $project: { _id: 1, weight: 1, specie: 1 } },
    ]);
    return capturesRandomWeight;
  }
  async getFakeFamilies(user, specieId, parentSpecieId) {
    //Devuelve 3 especies aleatorias
    //Distintas a la pasada como parámetro

    let finalFakeFamilies = [];
    let fakeFamilies = await this.speciesModel.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: specieId } },
            { parentSpecie: { $ne: parentSpecieId } },
          ],
        },
      },
      { $sample: { size: 3 } },
      { $project: { _id: 1, family: 1, parentSpecie: 1 } },
    ]);

    //se comprueba para cada especie fake,si el usuario tiene una acepcion favorita
    for (let i in fakeFamilies) {
      let auxFamilies = await this.getUserMeaningSpecie(
        user,
        fakeFamilies[i]._id,
        fakeFamilies[i].parentSpecie,
      );

      finalFakeFamilies.push(auxFamilies);
    }

    return finalFakeFamilies;
  }

  async whatIsTheFamily(capture, user, fakefamily, userMeaningSpecie) {
    let question =
      user.profile.lang === 'es'
        ? '¿De qué especie es la siguiente captura ?'
        : 'What is the specie of this capture?';

    let answers;

    fakefamily.push({
      _id: capture._id,
      family: userMeaningSpecie,
      correctAnswer: true,
    });
    answers = fakefamily.sort(disorganize);
    return { question, answers }; //ver como introducir la respuesta segun el idioma
  }

  whatIsTheWeight(capture, user, userMeaningSpecie) {
    let question =
      user.profile.lang === 'es'
        ? `¿Cuál es el peso de esta captura de ${userMeaningSpecie}?`
        : `What is the ${userMeaningSpecie}'s weight?`;

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

      if (user.profile.systemMedition === 1) {
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
    if (user.profile.systemMedition === 1) {
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

  async getUserMeaningSpecie(user, specieId, parentSpecieId) {
    //Esta funcion devuelve la acepcion favorita del usuario,si no tiene,devuelve la acepcion principal
    let userMeaningSpecie;
    //esta consulta comprueba si la especie de la captura
    //se corresponde con la acepcion favorita del usuario
    userMeaningSpecie = await this.meaningModel.aggregate([
      {
        $match: {
          $or: [
            { owner: user._id, specie: specieId },
            {
              owner: user._id,
              parentSpecie: parentSpecieId,
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'species',
          localField: 'specie',
          foreignField: '_id',
          as: 'specie',
        },
      },
      { $unwind: '$specie' },

      { $project: { _id: 1, 'specie._id': 1, 'specie.family': 1 } },
    ]);

    //si no tiene acepcion favorita,se busca la acepcion principal y se devuelve
    if (userMeaningSpecie.length < 1) {
      userMeaningSpecie = await this.speciesModel.aggregate([
        {
          $lookup: {
            from: 'languages',
            localField: 'languages',
            foreignField: '_id',
            as: 'languages',
          },
        },

        { $unwind: '$languages' },
        {
          $match: {
            $and: [
              { parentSpecie: parentSpecieId },
              { mainMeaning: true },
              { 'languages.isoCode': user.profile.lang },
            ],
          },
        },
      ]);
    }

    return userMeaningSpecie[0].family
      ? { _id: userMeaningSpecie[0]._id, family: userMeaningSpecie[0].family }
      : {
          _id: userMeaningSpecie[0].specie._id,
          family: userMeaningSpecie[0].specie.family,
        };
  }
}

function disorganize() {
  return Math.random() - 0.5;
}
