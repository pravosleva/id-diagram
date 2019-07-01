# id-diagram

## Install

```
$ yarn add id-diagram
```

## Documentation

Method | Arguments | Description
------------ | ------------- | -------------
`Formulas.getHumidityByParams0` | | _g/kg dry air, (number)_
👉 | `t` | temperature, C
👉 | `fi` | relativities, %
`Formulas.getTemperatureByParams0` | | _C, (number)_
👉 | `e` | enthalpy, kJ/kg
👉 | `h` | humidity, g/kg dry air
`Formulas.getHumidityByParams1` | | _g/kg dry air, (number)_
👉 | `e` | enthalpy, kJ/kg
👉 | `t` | temperature, C
`Lines.getEnthalpyLine` | | _function_
👉 | `t` | temperature, C
👉 | `fi` | relativities, %
`Formulas.getEnthalpyByParams0` | | _kJ/kg (number)_
👉 | `t` | temperature, C
👉 | `fi` | relativities, %
`Formulas.getWBT` | | Wet Bulb Temperature, _C (number)_
👉 | `t` | temperature, C
👉 | `fi` | relativities, %
`Formulas.getTR0` | | Dew Point (RECOMMENDED), _C (number)_
👉 | `t` | temperature, C
👉 | `fi` | relativities, %
`Formulas.getTR1` | | Dew Point (DEPRECATED: low accuracy), _C (number)_
👉 | `t` | temperature, C
👉 | `fi` | relativities, %

## Road Map

Параметры произвольной точки на диаграмме `const point = new TDPoint({ t: 28, fi: 43 })`
- [x] `point.get('t')`
- [x] `point.get('fi')`
- [x] `point.getHumidity()` _Влагосодержание / Humidity, g/kg dry air_
- [x] `point.getEnthalpy()` _Энтальпия / Enthalpy, kJ/kg_
- [x] `point.getTR()` _Точка росы / Dew Point Temperature, C_
- [x] `point.getWBT()` _Температура мокрого термометра / Wet Bulb Temperature, C_
If `Array.isArray(point.get('errors'))` then this point is wrong. Check this.

Вычисление термодинамических процессов.
- [x] Heating
```javascript
import { TDPoint } from 'id-diagram';

const point = new TDPoint({ t: 28, fi: 50 });
const pointAfterHeating = point.process({
  type: 'heating',
  finalParams: {
    t: 50
  }
});
const finalFi = pointAfterHeating.get('fi');

console.log(finalFi);
// 37.592996573271044 // C
```
- [ ] Cooling
- [ ] Adiabatic cooling
- [ ] _Others..._

_To be continued..._

## TODO: STEP 1. Basis.

Теоретическая база & уравнения кривых по точкам

- [x] `Formulas.getHumidityByParams0` by `({ t, barometricPressure = 101.325, fi })`
- [x] `Formulas.getTemperatureByParams0` by `({ e, h })`
- [x] `Formulas.getHumidityByParams1` by `({ e, t })`
- [x] `Lines.getEnthalpyLines` (Массив линейных функций в аналит. виде `h => (k * h) + b`) 54 pcs from -18 to 88 kJ/kg by step 2
- [ ] `Lines.getHumidityLines` (Массив квадратичных функций в аналит. виде `h => (a * h ^ 2) + b * t`) from 10 to 100 %.
Неприменимо, т.к. при тестировании выявлена высокая погрешность, если использовать зависимости, полученные методом наименьших квадратов.
- [x] `Lines.getEnthalpyLine` by `({ t, fi })`. Линия постоянной энтальпии (см. пункт 3).
- [x] `Formulas.getEnthalpyByParams0` by `({ t, fi })`
- [x] `Formulas.getWBT` by `({ t, fi })`. Температура мокрого термометра по графику
- [x] `Formulas.getTR0` by `({ t, fi })`. Точка росы по графику (более точный вариант - high accuracy)
- [x] `Formulas.getTR1` by `({ t, fi })`. Точка росы по упрощенной формуле (low accuracy)

## TODO: STEP 2. Wet Bulb Temperature.

Нахождение мемпературы мокрого термометра. _Для этого нужно решить математическую задачу:_
- [x] 1. Дан массив линейных функций
```javascript
// (1.1)
const enthalpyLines = Lines.getEnthalpyLines();
```
- [x] 2. Исходные данные для расчета температуры мокрого термометра.
```javascript
// Data from user (2.1)
const t = 28;
const fi = 43;
```
- [x] 3. Найти уравнение **прямой** (3.1), параллельной прямым постоянных энтальпий (1.1) и проходящую через **точку** (2.1):
```
y      |      o     .       o
       |       o    [x]      o
       |        o     .       o
       |         o     .       o
       |          o     .       o
       |           o     .       o
       |            o     .       o
       ------------------------------------
                                          x
```
```javascript
// Линия (3.1) постоянной энтальпии, проходящая через точку пользователя
const enthalpyLine = Lines.getEnthalpyLine({ t, fi });

// Координаты точки (2.1)
// Влагосодержание h как значение по оси x
const x = Formulas.getHumidityByParams0({ t, fi });
// Температура как значение по оси y - известно из пункта 2.
const y = t;
```
- [x] 4. Есть массив точек кривой насыщения `fi= 100%`:
```
y      |                                  o
       |                     o
       |              o
       |         o
       |     o
       |  o
       |o
       ------------------------------------
                                          x
```
```javascript
const pointsFi100 = Points.getHumidityPoints()[9]; // Like [{ x, y }]

// Для диапазона температур -41 до 41 с шагом 1
// TODO: Усовершенствовать функцию
```
- [x] 5.1 Search Wet Bulb Temperature by `({ t, fi })` when i= const.
```
y      |            x                     o
y= t   |            [x]      o
tWB= ? |             [x]
       |         o     x
       |     o          x
       |  o              x
       |o                 x
       ------------------------------------
                     x= h                 x
                      hWB= ?
                     tR0 (or tR1)
```
- [x] 5.2 tR by `({ t, fi })` when i= const.
Найти пересечение прямой (3.1) и кривой насыщения.
```javascript
// 1) Определить зависимость для кривой насыщения (5.1)
const lineFi100 = Lines.getBrokenLineByPoints(pointsFi100); // Like h => val

// 2) Найти пересечение кривой насыщения (5.1) с линией (3.1) постоянной энтальпии

// Поиск температуры мокрого термометра по графику
const tWB = Formulas.getWBT({ t, fi });
// 19.051343647195182 // C

// Точка росы по графику (более точный вариант, чем следующий)
const tR0 = Formulas.getTR0({ t, fi });
// 14.266000848002328 // C

// Точка росы (упрощенная формула - не рекомендуется)
const tR1 = Formulas.getTR1({ t, fi });
// 16.6 // C
```
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
