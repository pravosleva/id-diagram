/* eslint-disable padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline */
// import { byLeastSquaresApproximation } from 'get-parabola';
import { getKB } from 'interpolate-by-pravosleva';
import {
  enthalpy,
  // humidity, temperatureTemplateArr
} from './points';


const awesomeFunction = () => 'I am just an Awesome Function';
const getNormalizedPoints = (arr) => {
  const [p1, p2] = arr;

  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
};
const by2Points = enthalpyPoints => getKB(getNormalizedPoints(enthalpyPoints));

export default class ID {
  // ЭНТАЛЬПИЯ: МАССИВ ФУНКЦИЙ В АНАЛИТИЧЕСКОМ ВИДЕ
  // ENTHALPY: ANALYTIC MATH FUNCTIONS ARRAY
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

  // ВЛАГОСОДЕРЖАНИЕ, г/кг сухого воздуха
  // HUMIDITY, g/kg of dry air
  static getHumidityByParams0({
    temperature, // C
    barometricPressure = 101.325, // kPa
    fi, // %
  }){
    let saturationPressure;

    if (temperature < 0) {
      saturationPressure = Math.exp(((18.74 * temperature) - 115.72) / (233.77 + (0.881 * temperature)));
    } else {
      saturationPressure = Math.exp((((16.57 * temperature) - 115.72) / (233.77 + (0.997 * temperature))));
    }

    return (622 * (fi / 100) * saturationPressure) / (barometricPressure - ((fi / 100) * saturationPressure));
  }

  // ТЕМПЕРАТУРА, C
  // TEMPERATURE, C
  static getTemperatureByParams0({
    enthalpy, // kJ/kg
    humidity, // g/kg of dry air
  }){
    return (enthalpy - (2501 * (humidity / 1000))) / (1.006 + (1.805 * (humidity / 1000)));
  }

  // ВЛАГОСОДЕРЖАНИЕ, г/кг сухого воздуха
  // HUMIDITY, g/kg of dry air
  static getHumidityByParams1({
    enthalpy, // kJ/kg
    temperature, // C
  }){
    return (enthalpy - (1.006 * temperature)) * 1000 / (2501 + (1.805 * temperature));
  }
}

export { awesomeFunction };
