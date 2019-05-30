# id-diagram

## TODO: STEP 1

Теоретическая база & уравнения кривых по точкам

- [x] ID.getHumidityByParams0 by `{ temperature, barometricPressure = 101.325, fi }`
- [x] ID.getTemperatureByParams0 by `{ enthalpy, humidity }`
- [x] ID.getHumidityByParams1 by `{ enthalpy, temperature }`
- [x] ID.getEnthalpyLines (Массив линейных функций в аналит. виде `h => k*t+b`) 54 pcs from -18 to 88 kJ/kg by step 2
- [ ] ID.getHumidityLines (Массив квадратичных функций в аналит. виде `h => a*t^2+b*t`) from 10 to 100 % (от этого нет пользы, т.к. при тестировании выявлена высокая погрешность, если использовать зависимости, полученные методом наименьших квадратов)

## TODO: STEP 2

Нахождение пересечений между найденными линиями для произвольной точки и кривой насыщения (fi === 100 %)

Для этого нужно решить математическую задачу:
- [x] 1. Дан массив линейных нункций `Lines.getEnthalpyLines()`.
- [ ] 2. Между двумя прямыми постоянных энтальпий уравнение **прямой**, параллельной остальным прямым и проходящую через **точку** `d=Formulas.getHumidityByParams0({ t, fi })` (d as x axis) и `t` (t as y axis) для данной точки `{ t, fi }`.
- [ ] 3. Есть массив точек кривой насыщения `fi=100%`. _Думаю, что делать дальше..._
- [ ] 4. Search tWB (wet bulb point) by `{ t, fi }` when i= const.
Найти пересечение прямой, найденной в пункте 2 и кривой насыщения, для которой известен только массив точек `Points.getHumidityPoints()` вида `[[{ x, y }]]` (в частности, для fi=100% `const pointsFi100 = Points.getHumidityPoints()[9];` вида `[{ x, y }]`).

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
