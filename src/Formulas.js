/* eslint-disable function-paren-newline, arrow-parens, padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
import Lines from './Lines';
import Points from './Points';
import { fi as fiPoints } from './points';

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
    const enthalpyLine = Lines.getEnthalpyLine({ t, fi });
    const d = Formulas.getHumidityByParams0({ t, fi });

    return enthalpyLine(d);
  }

  // ТЕМПЕРАТУРА ТОЧКИ РОСЫ (По графику), С
  // tR POINT TEMPERATURE (by graphic), C
  static getTR0({
    t, // C
    fi // %
  }){
    const d = Formulas.getHumidityByParams0({ t, fi });
    const pointsFi100 = fiPoints['100'];
    const fi100Line = Lines.getBrokenLineByPoints(pointsFi100);
    const tR = fi100Line(d);

    return tR;
  }

  // ТЕМПЕРАТУРА ТОЧКИ РОСЫ (Упрощенная формула), С
  // tR POINT TEMPERATURE (Simplest way), C
  static getTR1({
    t, // C
    fi // %
  }){
    // Существует более простая формула для приблизительного расчёта, дающая
    // погрешность ±1,0 °C при относительной влажности в объёмных долях более 0,5
    // https://ru.wikipedia.org/wiki/%D0%A2%D0%BE%D1%87%D0%BA%D0%B0_%D1%80%D0%BE%D1%81%D1%8B
    return t - ((1 - (fi / 100)) / 0.05);
  }

  // ТЕМПЕРАТУРА МОКРОГО ТЕРМОМЕТРА, С
  // WET BULB TEMPERATURE, C
  static getWBT({
    t, // C
    fi // %
  }){
    const enthalpyLine = Lines.getEnthalpyLine({ t, fi });
    // console.log(enthalpyLine(5.6)); // Ok!
    // console.log(`t= ${t} / fi= ${fi} / e= ${enthalpyLine(5)}`);

    // v0
    // const pointsFi100 = Points.getHumidityPoints()[9];
    // v1
    // const pointsFi100 = Points.getFi100Points();
    // v2
    // const pointsFi100 = [];
    // const temperatureTemplateArr = [
    //   -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28,
    //   -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13,
    //   -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
    //   8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    //   27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41
    // ];
    // temperatureTemplateArr.map(t => {
    //   pointsFi100.push({ x: Formulas.getHumidityByParams0({ t, fi: 100 }), y: t });
    //
    //   return false;
    // });
    // v3: http://helpeng.ru/programs/properties_dump_air.php
    const pointsFi100 = fiPoints['100'];

    const point = Points.getCommonPoint0({
      fn1: enthalpyLine,
      fn2: Lines.getBrokenLineByPoints(pointsFi100)
    });

    // console.log(point); // Ok.

    return point.t;
  }
}
