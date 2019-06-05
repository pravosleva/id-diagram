/* eslint-disable padded-blocks, space-before-blocks, max-len, no-mixed-operators, no-shadow, object-curly-newline, no-plusplus */
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
    const enthalpyLine = Lines.getEnthalpyLine({ t, fi });
    const d = Formulas.getHumidityByParams0({ t, fi });

    return enthalpyLine(d);
  }

  static getWBT1({
    t, // C
    fi // %
  }){
    // Существует более простая формула для приблизительного расчёта, дающая
    // погрешность ±1,0 °C при относительной влажности в объёмных долях более 0,5
    // https://ru.wikipedia.org/wiki/%D0%A2%D0%BE%D1%87%D0%BA%D0%B0_%D1%80%D0%BE%D1%81%D1%8B
    return t - ((1 - (fi / 100)) / 0.05);
  }
}
