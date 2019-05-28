# id-diagram

## TODO: STEP 1

Теоретическая база & уравнения кривых по точкам

- [x] ID.getHumidityByParams0 by `{ temperature, barometricPressure = 101.325, fi }`
- [x] ID.getTemperatureByParams0 by `{ enthalpy, humidity }`
- [x] ID.getHumidityByParams1 by `{ enthalpy, temperature }`
- [x] ID.getEnthalpyLines (Массив линейных функций в аналит. виде `h => k*t+b`) 54 pcs from -18 to 88 kJ/kg by step 2
- [ ] ID.getHumidityLines (Массив квадратичных функций в аналит. виде `h => a*t^2+b*t`) from 10 to 100 %
- [ ] Поиск промежуточных аналитических зависимостей посредством аппроксимации для произвольных `t (C) & fi (%)` между двумя ближайшими

## TODO: STEP 2

Нахождение пересечений между найденными линиями для произвольной точки и кривой насыщения (fi === 100 %)

- [ ] Search d and tWB (wet bulb point) by `{ t, fi }` when i= const
- [ ] d= const
- [ ] Publish as npm module

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
