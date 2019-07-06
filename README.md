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

### Вычисление термодинамических процессов.
![Processes](./img/id-diagram-B1-B5-484x400.png)
- [x] HEATING // Изобарный нагрев / Isobaric heating; h= const;
```javascript
const pointB2 = pointB1.process({
  type: 'heating',
  finalParams: { t: 50 }
});
const finalFi = pointB2.get('fi');

console.log(finalFi);
// 37.592996573271044 // %

console.log(pointB2.processResult);
// { DELTA_H: 19.701903411072525,
//   DELTA_E: 75.81706462959397,
//   DELTA_FI: -5.407003426728956 }

// And also, we have access to parent point:
console.log(pointB2.parentPoint.get('t'));
// 28 // C
```
- [ ] COOLING (Should be tested)
```javascript
// CASE 1: Без конденсации
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
console.log(fi3); // 81.25379924559114 // %
console.log(h3); // 16.228267828216858 // g/kg
console.log(e3); // 66.12402576390821 // kJ/kg
console.log(resultB1B3);
// { DELTA_H: 0
//   DELTA_E: 12.17116345682976,
//   DELTA_FI: 38.25379924559114 }

// CASE 2: С конденсацией
const pointB5 = pointB1.process({
  type: 'cooling',
  finalParams: { t: 20 }
});

const t5 = pointB5.get('t');
const fi5 = pointB5.get('fi');
const h5 = pointB5.getHumidity();
const e5 = pointB5.getEnthalpy();
const resultB1B5 = pointB5.processResult;

console.log(t5); // 20 // С
console.log(fi5); // 89.98595978005515 // %
console.log(h5); // 13.19970111553801 // g/kg
console.log(e5); // 53.127078563979126 // kJ/kg
console.log(resultB1B5);
// { DELTA_H: 3.048618541440435,
//   DELTA_E: -0.825783743099322,
//   DELTA_FI: 46.985959780055154 }
```
- [ ] ADIABATIC (Should be tested) // e= const
```javascript
const point2a = pointB1.process({
  type: 'adiabatic',
  finalParams: { t: 22 }
});
// Кстати, уменьшение температуры по линии энтальпии не может быть ниже
// температуры мокрого термометра - будет возвращена точка tWB, соответствующая
// минимально возможной температуре при изоэнтальпийном процессе.
const finalFi2a = point2a.get('fi');

console.log(finalFi2a);
// TODO: Should be tested.

console.log(point2a.processResult);
// TODO: Should be tested.

const point2b = pointB1.process({
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
