/* eslint-disable function-paren-newline, arrow-parens, padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
import {
  linear,
  // bilinear,
} from 'interpolate-by-pravosleva';
import Lines from './Lines';


export default class Formulas {

  // ВЛАГОСОДЕРЖАНИЕ, г/кг сухого воздуха
  // HUMIDITY, g/kg of dry air
  static getHumidityByParams0({
    t: temperature, // C
    barometricPressure = 101.325, // kPa
    fi: relativities, // %
  }){
    let saturationPressure;

    if (temperature < 0) {
      saturationPressure = Math.exp(((18.74 * temperature) - 115.72) / (233.77 + (0.881 * temperature)));
    } else {
      saturationPressure = Math.exp((((16.57 * temperature) - 115.72) / (233.77 + (0.997 * temperature))));
    }

    return (622 * (relativities / 100) * saturationPressure) / (barometricPressure - ((relativities / 100) * saturationPressure));
  }

  // ТЕМПЕРАТУРА, C
  // TEMPERATURE, C
  static getTemperatureByParams0({
    e: enthalpy, // kJ/kg
    h: humidity, // g/kg of dry air
  }){
    return (enthalpy - (2501 * (humidity / 1000))) / (1.006 + (1.805 * (humidity / 1000)));
  }

  // ВЛАГОСОДЕРЖАНИЕ, г/кг сухого воздуха
  // HUMIDITY, g/kg of dry air
  static getHumidityByParams1({
    e: enthalpy, // kJ/kg
    t: temperature, // C
  }){
    // console.log((enthalpy - (1.006 * temperature)) * 1000 / (2501 + (1.805 * temperature)));
    return (enthalpy - (1.006 * temperature)) * 1000 / (2501 + (1.805 * temperature));
  }

  // ЭНТАЛЬПИЯ, кДж/кг
  // ENTHALPY, kJ/kg
  static getEnthalpyByParams0({
    t, // C
    fi, // %
  }){
    // const temp = Lines.getConstEnthalpyLine({ t, fi });
    const enthalpyLines = Lines.getEnthalpyLines(); // first -18, last 88 (kJ/kg)
    const h = Formulas.getHumidityByParams0({ t, fi });

    const y1 = -18;
    const x1 = enthalpyLines[0](h);
    const y2 = 88;
    const x2 = enthalpyLines[enthalpyLines.length - 1](h);
    const x = t;

    return linear({ x, x1, y1, x2, y2 });
  }

  // ТЕМПЕРАТУРА ТОЧКИ РОСЫ (Упрощенная формула), С
  // tR POINT TEMPERATURE (Simplest way), C
  static getDPT({
    t, // C
    fi // %
  }){
    // Существует более простая формула для приблизительного расчёта, дающая
    // погрешность ±1,0 °C при относительной влажности в объёмных долях более 0,5
    // https://ru.wikipedia.org/wiki/%D0%A2%D0%BE%D1%87%D0%BA%D0%B0_%D1%80%D0%BE%D1%81%D1%8B
    return t - ((1 - (fi / 100)) / 0.05);
  }

  static getHumidityPoints() {
    const pointsArrs = [];
    const fiValues = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
    const temperatureTemplateArr = [
      -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28,
      -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13,
      -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
    ];

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
}
