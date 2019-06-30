/* eslint-disable arrow-parens, padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
import {
  // byLeastSquaresApproximation,
  by2Points,
  by3Points,
} from 'get-parabola';
import { getKB, linear } from 'interpolate-by-pravosleva';

import { enthalpy } from './points';
import Formulas from './Formulas';


export default class Lines {

  // ВЛАГОСОДЕРЖАНИЕ: МАССИВ ФУНКЦИЙ В АНАЛИТИЧЕСКОМ ВИДЕ
  // HUMIDITY: ANALYTIC MATH FNS ARRAY
  static _getHumidityLines() {
    const coeffsArr = [];
    const pointsArrs = [];
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
    // pointsArrs.map(points => coeffsArr.push(byLeastSquaresApproximation(points)));
    pointsArrs.map(points => coeffsArr.push(by3Points(points)));

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

  // ЭНТАЛЬПИЯ: ЛИНИЯ, ПРОХОДЯЩАЯ ЧЕРЕЗ ТОЧКУ { t, fi }
  // ENTHALPY: LINE FOR THE { t, fi }
  static getEnthalpyLine({ t, fi }) {
    const d = Formulas.getHumidityByParams0({ t, fi });

    // console.log(d); // Ok!

    // Берем произвольную линию для вычисления k
    const enthalpyLine = Lines.getEnthalpyLines()[10];
    const x1 = 1;
    const x2 = 5;
    const y1 = enthalpyLine(x1);
    const y2 = enthalpyLine(x2);
    const { k } = getKB({ x1, y1, x2, y2 }); // b = y - (k * x);
    const userB = t - (k * d);

    return h => (k * h) + userB;
  }

  static getBrokenLineByPoints(points) {
    const sortedPoints = [...points].sort((p1, p2) => p1.x - p2.x);

    return h => {
      let x1;
      let x2;
      let y1;
      let y2;

      if (h <= sortedPoints[0].x) {
        x1 = sortedPoints[0].x;
        x2 = sortedPoints[1].x;
        y1 = sortedPoints[0].y;
        y2 = sortedPoints[1].y;
      } else if (h >= sortedPoints[sortedPoints.length - 1].x) {
        x1 = sortedPoints[sortedPoints.length - 2].x;
        x2 = sortedPoints[sortedPoints.length - 1].x;
        y1 = sortedPoints[sortedPoints.length - 2].y;
        y2 = sortedPoints[sortedPoints.length - 1].y;
      } else {
        for (let i = 0; i < sortedPoints.length - 1; i++) {
          if (h >= sortedPoints[i].x && h <= sortedPoints[i + 1].x) {
            x1 = sortedPoints[i].x;
            x2 = sortedPoints[i + 1].x;
            y1 = sortedPoints[i].y;
            y2 = sortedPoints[i + 1].y;
            break;
          }
        }
      }

      return linear({ x: h, x1, y1, x2, y2 });
    };
  }
}
