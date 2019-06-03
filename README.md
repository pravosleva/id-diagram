# id-diagram

## TODO: STEP 1. Basis.

Теоретическая база & уравнения кривых по точкам

- [x] `Formulas.getHumidityByParams0` by `{ t, barometricPressure = 101.325, fi }`
- [x] `Formulas.getTemperatureByParams0` by `{ e, h }`
- [x] `Formulas.getHumidityByParams1` by `{ e, t }`
- [x] `Formulas.getEnthalpyLines` (Массив линейных функций в аналит. виде `h=>k*t+b`) 54 pcs from -18 to 88 kJ/kg by step 2
- [ ] `Formulas.getHumidityLines` (Массив квадратичных функций в аналит. виде `h=>a*t^2+b*t`) from 10 to 100 % - неприменимо, т.к. при тестировании выявлена высокая погрешность, если использовать зависимости, полученные методом наименьших квадратов)
- [ ] `Formulas.getEnthalpyByParams0` by `{ t, fi }` by approximation between lines.
- [ ] `Lines.getEnthalpyLine` by `({ e })`

## TODO: STEP 2. Search Wet Bulb Temperature.

Нахождение мемпературы мокрого термометра. _Для этого нужно решить математическую задачу:_
- [x] 1. Дан массив линейных функций
```javascript
const enthalpyLines = Lines.getEnthalpyLines(); // (1.1)
```
- [ ] 2. Исходные данные для расчета температуры мокрого термометра.
```javascript
// Data from user (2.1)
const t = 35;
const fi = 50;
```
- [ ] 3. Найти уравнение **прямой** (3.1), параллельной прямым постоянных энтальпий (1.1) и проходящую через **точку** (2.1):
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
// Линия 3.1 постоянной энтальпии, проходящая через точку пользователя
const userEnthalpy = Formulas.getEnthalpyByParams0({ t, fi });
// TODO: { k, b } could be found Interpolate.getKB() method for other parallel lines
const userEnthalpyLine = Lines.getEnthalpyLine({ e });

// Координаты точки 2.1
// Влагосодержание как значение по оси x
const x = Formulas.getHumidityByParams0({ t, fi });
// Температура как значение по оси y - известно из пункта 2.
const y = t;
```
- [ ] 4. Есть массив точек кривой насыщения `fi=100%`:
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
_Думаю, что делать дальше..._
- [ ] 5. `getCommonPoint({ x1, y1, x2, y2, x3, y4, x4, y4 })`. Search tWB (wet bulb point) by `{ t, fi }` when i= const.
Найти пересечение прямой 3.1 и кривой насыщения из пункта 4.
```
y      |            x                     o
       |             x       o
tWB= ? |              x
       |         o     x
       |     o          x
       |  o              x
       |o                 x
       ------------------------------------
                                          x
```
```javascript
// TODO: const tWB = getCommonPoint();
```

## TODO: STEP 3. Processes.

Вычисление термодинамических процессов.
- [ ] `class TDPoint` как отдельная сущность
- [ ] `TDPoint.heating()` from to
- [ ] `TDPoint.cooling()` from to
- [ ] Адиабатическое охлаждение
- [ ] Пароувлажнение
- [ ] _Прочие процессы..._

_To be continued..._

## Usage

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
```

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
