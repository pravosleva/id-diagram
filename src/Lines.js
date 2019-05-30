/* eslint-disable padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
import {
  // byLeastSquaresApproximation,
  by3Points,
} from 'get-parabola';
import { getKB } from 'interpolate-by-pravosleva';
import {
  enthalpy,
  // humidity,
} from './points';
import Formulas from './Formulas';


const getNormalized2Points = (arr) => {
  const [p1, p2] = arr;

  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
};
const getNormalized3Points = (arr) => {
  const [p1, p2, p3] = arr;

  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, x3: p3.x, y3: p3.y };
};
const by2Points = enthalpyPoints => getKB(getNormalized2Points(enthalpyPoints));

export default class Lines {

  // ВЛАГОСОДЕРЖАНИЕ: МАССИВ ФУНКЦИЙ В АНАЛИТИЧЕСКОМ ВИДЕ
  // HUMIDITY: ANALYTIC MATH FNS ARRAY
  static _getHumidityLines() {
    const coeffsArr = [];
    const pointsArrs = [];
    // const temperatureTemplateArr = [
    //   -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28,
    //   -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13,
    //   -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
    //   8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    //   27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
    // ];
    const temperatureTemplateArr = [-41, 0, 41];
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
    // console.log(pointsArrs[9]);
    // pointsArrs.map(points => coeffsArr.push(byLeastSquaresApproximation(points)));
    pointsArrs.map(points => coeffsArr.push(by3Points(getNormalized3Points(points))));

    return coeffsArr.map(({ a, b, c }) => h => (a * (h ** 2)) + (b * h) + c);
  }

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

  // ЭНТАЛЬПИЯ: МАССИВ ФУНКЦИЙ В АНАЛИТИЧЕСКОМ ВИДЕ
  // ENTHALPY: ANALYTIC MATH FNS ARRAY
  static getEnthalpyLines(){
    const coeffsArr = [
      by2Points(enthalpy['-18']),
      by2Points(enthalpy['-16']),
      by2Points(enthalpy['-14']),
      by2Points(enthalpy['-12']),
      by2Points(enthalpy['-10']),
      by2Points(enthalpy['-8']),
      by2Points(enthalpy['-6']),
      by2Points(enthalpy['-4']),
      by2Points(enthalpy['-2']),
      by2Points(enthalpy['0']),
      by2Points(enthalpy['2']),
      by2Points(enthalpy['4']),
      by2Points(enthalpy['6']),
      by2Points(enthalpy['8']),
      by2Points(enthalpy['10']),
      by2Points(enthalpy['12']),
      by2Points(enthalpy['14']),
      by2Points(enthalpy['16']),
      by2Points(enthalpy['18']),
      by2Points(enthalpy['20']),
      by2Points(enthalpy['22']),
      by2Points(enthalpy['24']),
      by2Points(enthalpy['26']),
      by2Points(enthalpy['28']),
      by2Points(enthalpy['30']),
      by2Points(enthalpy['32']),
      by2Points(enthalpy['34']),
      by2Points(enthalpy['36']),
      by2Points(enthalpy['38']),
      by2Points(enthalpy['40']),
      by2Points(enthalpy['42']),
      by2Points(enthalpy['44']),
      by2Points(enthalpy['46']),
      by2Points(enthalpy['48']),
      by2Points(enthalpy['50']),
      by2Points(enthalpy['52']),
      by2Points(enthalpy['54']),
      by2Points(enthalpy['56']),
      by2Points(enthalpy['58']),
      by2Points(enthalpy['60']),
      by2Points(enthalpy['62']),
      by2Points(enthalpy['64']),
      by2Points(enthalpy['66']),
      by2Points(enthalpy['68']),
      by2Points(enthalpy['70']),
      by2Points(enthalpy['72']),
      by2Points(enthalpy['74']),
      by2Points(enthalpy['76']),
      by2Points(enthalpy['78']),
      by2Points(enthalpy['80']),
      by2Points(enthalpy['82']),
      by2Points(enthalpy['84']),
      by2Points(enthalpy['86']),
      by2Points(enthalpy['88']),
    ];

    return [...coeffsArr].map(({ k, b }) => h => ((k * h) + b));
  }
}
