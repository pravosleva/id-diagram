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
      eps: 0.0001
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
