/* eslint-disable function-paren-newline, arrow-parens, padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
import Lines from './Lines';
import Points from './Points';

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

  // ТЕМПЕРАТУРА МОКРОГО ТЕРМОМЕТРА, С
  // WET BULB TEMPERATURE, C
  static getWBT1({
    t, // C
    fi // %
  }){
    // Существует более простая формула для приблизительного расчёта, дающая
    // погрешность ±1,0 °C при относительной влажности в объёмных долях более 0,5
    // https://ru.wikipedia.org/wiki/%D0%A2%D0%BE%D1%87%D0%BA%D0%B0_%D1%80%D0%BE%D1%81%D1%8B
    return t - ((1 - (fi / 100)) / 0.05);
  }

  static getWBT0({
    t, // C
    fi // %
  }){
    // v0-1-2
    const enthalpyLine = Lines.getEnthalpyLine({ t, fi });
    // console.log(enthalpyLine(5.6)); // Ok!
    // v0
    // const pointsFi100 = Points.getHumidityPoints()[9];
    // v1
    const pointsFi100 = Points.getFi100Points();
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
    /*
    const pointsFi100 = [
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
    const point = Points.getCommonPoint0({
      fn1: enthalpyLine,
      fn2: Lines.getBrokenLineByPoints(pointsFi100)
    });

    // console.log(point);

    return point.t;
  }
}
