/* eslint-disable padded-blocks, no-console, operator-assignment, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
import { getCommonPointByBisectionMethod } from 'interpolate-by-pravosleva';

import Formulas from './Formulas';


export default class Points {

  // ВЛАГОСОДЕРЖАНИЕ: МАССИВ ТОЧЕК [[{ x, y }]]
  // HUMIDITY: ARRAY OF POINTS ARRAYS [[{ x, y }]]
  static getHumidityPoints() {
    const pointsArrs = [];
    const temperatureTemplateArr = [
      -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28,
      -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13,
      -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
    ];
    const fiValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    for (let i = 0; i < fiValues.length; i++) {
      pointsArrs[i] = [];

      for (let j = 0; j < temperatureTemplateArr.length; j++) {
        pointsArrs[i].push({
          x: Formulas.getHumidityByParams0({ t: temperatureTemplateArr[j], fi: fiValues[i] }),
          y: temperatureTemplateArr[j]
        });
      }
    }

    return pointsArrs;
  }

  static getFi100Points() {
    // v0
    const pointsArr = [];
    const temperatureTemplateArr = [
      -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28,
      -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13,
      -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
    ];

    for (let i = 0; i < temperatureTemplateArr.length; i++) {
      pointsArr.push({
        x: Formulas.getHumidityByParams0({ t: temperatureTemplateArr[i], fi: 100 }),
        y: temperatureTemplateArr[i]
      });
    }
    // v1: http://helpeng.ru/programs/properties_dump_air.php
    /*
    const pointsArr = [
      { x: 0.07, y: -41 },
      { x: 0.079, y: -40 },
      // TODO
      { x: 6.212, y: 7 },
      { x: 6.656, y: 8 },
      { x: 7.129, y: 9 },
      { x: 7.631, y: 10 },
      { x: 8.164, y: 11 },
      { x: 8.731, y: 12 },
      { x: 9.333, y: 13 },
      { x: 9.971, y: 14 },
      { x: 10.648, y: 15 },
      { x: 11.002, y: 15.5 },
      { x: 11.367, y: 16 },
      { x: 11.742, y: 16.5 },
      { x: 12.128, y: 17 },
      { x: 12.936, y: 18 },
      { x: 13.791, y: 19 },
      { x: 14.696, y: 20 },
      { x: 15.655, y: 21 },
      { x: 16.67, y: 22 },
      { x: 17.745, y: 23 },
      { x: 18.881, y: 24 },
      { x: 20.083, y: 25 },
      { x: 21.354, y: 26 },
      { x: 22.698, y: 27 },
      { x: 24.118, y: 28 },
      { x: 25.619, y: 29 },
      { x: 27.205, y: 30 },
      { x: 28.881, y: 31 },
      { x: 30.65, y: 32 },
      { x: 32.52, y: 33 },
      { x: 34.494, y: 34 },
      { x: 36.579, y: 35 },
      { x: 38.78, y: 36 },
      { x: 41.105, y: 37 },
      { x: 43.559, y: 38 },
      { x: 46.151, y: 39 },
      { x: 48.887, y: 40 },
      { x: 51.776, y: 41 },
    ];
    */

    return pointsArr;
  }

  // Humidity values
  static getHValues() {
    const valuesArr = [];
    const temperatureTemplateArr = [
      -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28,
      -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13,
      -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
    ];

    for (let i = 0; i < temperatureTemplateArr.length; i++) {
      valuesArr.push(Formulas.getHumidityByParams0({
        t: temperatureTemplateArr[i],
        fi: 100
      }));
    }

    return valuesArr;
  }

  static getCommonPoint0({ fn1, fn2 }) {
    const point = getCommonPointByBisectionMethod({
      fn1,
      fn2,
      eps: 0.0001,
      xMin: 0.07,
      xMax: 51.776,
    });

    if (point.error) {
      throw new Error(point);
    }

    return {
      h: point.x,
      t: point.y,
    };
  }
}
