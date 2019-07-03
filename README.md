# id-diagram

<div align="center">
  <p align="center">
    <a href="https://t.me/hvac_ru" styles="lihe-height: 30px; border-radius: 15px; border: 1px solid rgb(3, 102, 214);">HVAC group on Telegram</a>
  </p>
</div>

## Install

```
$ yarn add id-diagram
```

## Documentation
```
import { TDPoint } from 'id-diagram';

const point = new TDPoint({ t: 28, fi: 43 });
```

## Road Map

### Параметры произвольной точки на диаграмме

- [x] `point.get('t')`
- [x] `point.get('fi')`
- [x] `point.getHumidity()` _Влагосодержание / Humidity, g/kg dry air_
- [x] `point.getEnthalpy()` _Энтальпия / Enthalpy, kJ/kg_
- [x] `point.getTR()` _Точка росы / Dew Point Temperature, C_
- [x] `point.getWBT()` _Температура мокрого термометра / Wet Bulb Temperature, C_

> If `point.get('errors').length > 0` then this point is wrong. Check this.

### Вычисление термодинамических процессов.

- [x] HEATING // Изобарный нагрев / Isobaric heating; h= const;
```javascript
const pointAfterHeating = point.process({
  type: 'heating',
  finalParams: { t: 50 }
});
const finalFi = pointAfterHeating.get('fi');

console.log(finalFi);
// 37.592996573271044 // %

console.log(pointAfterHeating.processResult);
// { DELTA_H: 19.701903411072525,
//   DELTA_E: 75.81706462959397,
//   DELTA_FI: -5.407003426728956 }
//   /* TODO: Скрытая энергия конденсации для процесса охлаждения */

// And also, we have access to parent point:
console.log(pointAfterHeating.parentPoint.get('t'));
// 28 // C
```
- [ ] COOLING (Should be tested)
```javascript
const pointAfterCooling = point.process({
  type: 'cooling',
  finalParams: { t: 20 }
});
const finalFi = pointAfterCooling.get('fi');

console.log(finalFi);
// TODO: Should be tested.

console.log(pointAfterCooling.processResult);
// TODO: Should be tested.
```
- [ ] ADIABATIC (Should be tested) // e= const
```javascript
const point2a = point1.process({
  type: 'adiabatic',
  finalParams: { t: 22 }
});
const finalFi2a = point2a.get('fi');

console.log(finalFi2a);
// TODO: Should be tested.

console.log(point2a.processResult);
// TODO: Should be tested.

const point2b = point.process({
  type: 'adiabatic',
  finalParams: { fi: 85 }
});

console.log(finalFi2b);
// TODO: Should be tested.

console.log(point2b.processResult);
// TODO: Should be tested.
```
- [ ] _Others_

_To be continued..._

## Usage examples

```javascript
import { Formulas, Points, Lines } from 'id-diagram';

const d0 = Formulas.getHumidityByParams0({
  t: 15, // temperature (C)
  fi: 10, // relativities (%)
  barometricPressure: 101.325, // BP (kPa), optional param= 101.325 by default
}); // (g/kg of dry air)

console.log(d0);
// 1.048908791886

const d1 = Formulas.getHumidityByParams1({
  e: 25, // enthalpy (kJ/kg)
  t: 12.310041624590525, // temperature (C)
}); // (g/kg of dry air)

console.log(d1);
// 5.000000000000001

const t0 = Formulas.getTemperatureByParams0({
  e: 25, // enthalpy (kJ/kg)
  h: 5, // humidity (g/kg of dry air)
}); // (C)

console.log(t0);
// 12.310041624590525

// Something else...
```
_To be continued..._

## Commands
- `npm run clean` - Remove `lib/` directory
- `npm test` - Run tests with linting and coverage results.
- `npm test:only` - Run tests without linting or coverage.
- `npm test:watch` - You can even re-run tests on file changes!
- `npm test:prod` - Run tests with minified code.
- `npm run test:examples` - Test written examples on pure JS for better understanding module usage.
- `npm run lint` - Run ESlint with airbnb-config
- `npm run cover` - Get coverage report for your code.
- `npm run build` - Babel will transpile ES6 => ES5 and minify the code.
- `npm run prepublish` - Hook for npm. Do all the checks before publishing your module.

## License

MIT © Den Pol
