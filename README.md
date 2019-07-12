# id-diagram

<div align="center">
  <p align="center">
    <a href="https://tlgg.ru/hvac_ru">HVAC RU community in Telegram</a>
  </p>
</div>

## Install

```
$ yarn add id-diagram
```

## Documentation
```javascript
import { TDPoint } from 'id-diagram';

const pointB1 = new TDPoint({ t: 28, fi: 43 });

const h1 = pointB1.getHumidity(); // g/kg
const e1 = pointB1.getEnthalpy(); // kJ/kg
const tWB1 = pointB1.getWBT(); // C
const tR1 = pointB1.getDPT(); // C
```

## Road Map

### Параметры точки
> Точка росы и температура мокрого термометра определяются по линиям

- [x] `pointB1.get('t')`
- [x] `pointB1.get('fi')`
- [x] `pointB1.getHumidity()` _Влагосодержание / Humidity, g/kg dry air_
- [x] `pointB1.getEnthalpy()` _Энтальпия / Enthalpy, kJ/kg_
- [x] `pointB1.getDPT()` _Точка росы / Dew Point Temperature, C_
- [x] `pointB1.getWBT()` _Температура мокрого термометра / Wet Bulb Temperature, C_

> If `point.get('errors').length > 0` then this point is wrong. Check this.

### Вычисление термодинамических процессов (EXPERIMENTAL)
![Processes](./img/id-diagram-B1-B5-484x400.png)
- [x] **HEATING** _h= const_
```javascript
// Проверено по диаграмме (есть погрешность по влагосодержанию)
const pointB2 = pointB1.process({
  type: 'heating',
  finalParams: { t: 50 }
});

console.log(pointB2.get('fi'));
// 14.303548169006595 // %

console.log(pointB2.getHumidity());
// 11.030613525086391 // g/kg

console.log(pointB2.getEnthalpy());
// 79.36048832701628 // kJ/kg

console.log(pointB2.processResult);
// { DELTA_H: 0.8795309509888156, WTF?
//   DELTA_E: 25.407626019937837,
//   DELTA_FI: -28.696451830993404 }

// And also, we have access to parent point:
console.log(pointB2.parentPoint.get('t'));
// 28 // C
```
- [x] **COOLING**
```javascript
// ---
// CASE 1: Без конденсации (проверено по диаграмме)
// ---
const pointB3 = pointB1.process({
  type: 'cooling',
  finalParams: { t: 25 }
});

const t3 = pointB3.get('t');
const fi3 = pointB3.get('fi');
const h3 = pointB3.getHumidity();
const e3 = pointB3.getEnthalpy();
const resultB1B3 = pointB3.processResult;

console.log(t3); // 25 // С
console.log(fi3); // 51.307066576678906 // %
console.log(h3); // 10.149613772703198 // g/kg
console.log(e3); // 50.79081480354759 // kJ/kg
console.log(resultB1B3);
// { DELTA_H: -0.0014688013943775502,
//   DELTA_E: -3.1620475035308573,
//   DELTA_FI: 8.307066576678906 }

// ---
// CASE 2: С конденсацией (проверено по диаграмме)
// ---
const pointB5 = pointB1.process({
  type: 'cooling',
  finalParams: { t: 10 }
});

const t5 = pointB5.get('t');
const fi5 = pointB5.get('fi');
const h5 = pointB5.getHumidity();
const e5 = pointB5.getEnthalpy();
const resultB1B5 = pointB5.processResult;

console.log(t5); // 10 // С
console.log(fi5); // 100.03540745962107 // %
console.log(h5); // 7.630926160310488 // g/kg
console.log(e5); // 28.866936028559984 // kJ/kg
console.log(resultB1B5);
// Разница относительно предпоследнего процесса (прохождения через температуру
// точки росы):
// { DELTA_H: -2.516293286721109,
//   DELTA_E: -10.617290172969213,
//   DELTA_FI: 0.051985222719508783 }
```
- [ ] **ADIABATIC** (NOT COMPLETED!) _e= const_
```javascript
// ---
// CASE 1: Известна конечная температура
// ---
// [x] 1.1: Конечная температура ниже, чем tWB.
// Кстати, уменьшение температуры по линии энтальпии не может быть ниже
// температуры мокрого термометра - будет возвращена точка tWB, соответствующая
// минимально возможной температуре при изоэнтальпийном процессе.
// Результаты проверены по диаграмме.
const pointB6 = pointB1.process({
  type: 'adiabatic',
  finalParams: { t: 10 }
});

console.log(pointB6.get('t'));
// 19.030956508469423 // C

console.log(pointB6.get('fi'));
// 100 // %

console.log(pointB6.getHumidity());
// 13.82407829328307 // g/kg

console.log(pointB6.getEnthalpy());
// 53.66738700175793 // kJ/kg

console.log(pointB6.processResult);
// { DELTA_H: 3.6729957191854954,
//   DELTA_E: -0.28547530532051724,
//   DELTA_FI: 57 }

// [ ] FAILED! 1.2: Конечная температура выше исходной.
const pointB7 = pointB1.process({
  type: 'adiabatic',
  finalParams: { t: 40 }
});

console.log(pointB7.get('t'));
// 40 // C

console.log(pointB7.get('fi'));
// 21.0247699557539 // %

console.log(pointB7.getHumidity());
// 9.677198625202468 // g/kg

console.log(pointB7.getEnthalpy());
// 65.39190185806618 // kJ/kg

console.log(pointB7.processResult);
// { DELTA_H: -0.4738839488951072,
//   DELTA_E: 11.43903955098773,
//   DELTA_FI: -21.9752300442461 }

// ---
// CASE 2: Известна конечная влажность
// ---
// [x] 2.1: Влажность ниже исходной (есть погрешность)
const pointB8 = pointB1.process({
  type: 'adiabatic',
  finalParams: { fi: 85 }
});

console.log(pointB8.get('t'));
// 21.391231111503785 // C

console.log(pointB8.get('fi'));
// 85 // %

console.log(pointB8.getHumidity());
// 13.593025403474082 // g/kg

console.log(pointB8.getEnthalpy());
// 55.59186936444388 // kJ/kg (WTF? 54 по диаграмме)

console.log(pointB8.processResult);
// { DELTA_H: 3.441942829376506,
//   DELTA_E: 1.6390070573654327,
//   DELTA_FI: 42 }

// [ ] FAILED! 2.2: Влажность выше исходной
const pointB9 = pointB1.process({
  type: 'adiabatic',
  finalParams: { fi: 25 }
});

console.log(pointB9.get('t'));
// 30.832329523641235 // C

console.log(pointB9.get('fi'));
// 25 // %

console.log(pointB9.getHumidity());
// 6.912574036124484 // g/kg

console.log(pointB9.getEnthalpy());
// 48.89727121058972 // kJ/kg

console.log(pointB9.processResult);
// { DELTA_H: -3.2385085379730914,
//   DELTA_E: -5.055591096488726,
//   DELTA_FI: -18 }
```
- [ ] _Others_

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
