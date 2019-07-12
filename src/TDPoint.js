/* eslint-disable no-plusplus, max-len, object-curly-newline */
import { linear } from 'interpolate-by-pravosleva';
import Formulas from './Formulas';
import { fi as fiPoints } from './points';
import Points from './Points';
import Lines from './Lines';


class TDPoint {
  constructor(props) {
    const requiredProps = ['t', 'fi'];
    const optionalProps = [
      'errors', // Ошибки в результате процесса (всегда массив, так что проверяйте его длину)
      'parentPoint', // Каждая точка будет иметь доступ к методам своего родителя после какого-либо процесса
      'processResult', // Промежуточные результаты, к примеру, скрытая и явная теплота при охлаждении
    ];

    this.errors = [];

    for (let i = 0; i < requiredProps.length; i++) {
      if (props[requiredProps[i]]) {
        this[requiredProps[i]] = props[requiredProps[i]];
      } else {
        this.errors.push(`При создании объекта отсутствует обязательное поле ${props[requiredProps[i]]}`);
      }
    }
    for (let i = 0; i < optionalProps.length; i++) {
      if (props[optionalProps[i]]) {
        this[optionalProps[i]] = props[optionalProps[i]];
      }
    }

    if (props.fi) {
      if (props.fi <= 0) {
        this.errors.push(`Относительная влажность не может быть менее либо равно 0 %; Получено fi= ${props.fi}`);
      } else if (props.fi > 100) {
        this.errors.push(`Относительная влажность не может быть более 100 %; Получено fi= ${props.fi}`);
      }
    }
  }

  // [ ] TODO: Processes.
  process({
    type,
    finalParams
  }) {
    const errors = [];
    let result = null;
    let newPoint = null;

    // Расчетные параметры текущей позиции на диаграмме
    const h = this.getHumidity();
    const pointsFi100 = fiPoints['100'];
    const tR = Lines.getBrokenLineByPoints(pointsFi100)(h);
    const tWB = this.getWBT();

    switch (type) {
      // [x] 1. HEATING: Направление процесса вертикально вверх
      /*
        Процесс нагрева 1-2 влажного воздух происходит без изменения
        влагосодержания h= const;
        Количество тепла, необходимое для изобарного нагрева равно разнице
        энтальпий: q= e2 - e1 // кДж/кг с.в.
      */
      case 'heating': // Isobaric heating
        // finalParams.t isRequired
        if (finalParams && finalParams.t) {
          const newT = finalParams.t;

          // 1. Найти newFi by (h, newT) графически
          const newFi = Lines.getFi({ t: newT, h }); // h is const

          newPoint = new TDPoint({
            t: newT,
            fi: newFi,
            parentPoint: this
          });

          newPoint.processResult = this.getProcessResultObj({ endPoint: newPoint });
          result = newPoint;
        } else {
          errors.push('ERROR: TDPoint.process');
          errors.push(`Неприемлемые для передаваемого параметра (finalParams && finalParams.t) is ${Boolean(finalParams && finalParams.t)} в случае нагрева`);
          result = new TDPoint({
            t: this.t,
            fi: this.fi,
            errors,
            parentPoint: this
          });
        }
        break;

      // [ ] 2. COOLING: Вертикально вниз до fi= 100 % (дальше по кр. насыщения)
      /*
        Процесс 4-5 охлаждения ненасыщенного влажного воздуха также происходит при
        постоянном влагосодержании h. После того как воздух становится
        насыщенным, дальнейшее охлаждение 5-6 сопровождается конденсацией пара и
        уменьшением влагосодержания (условно, по линии насыщения) на величину:
        dH= h4 - h6 // г/кг с.в.
        Количество теплоты, отведенное от исходной точки равно разнице энтальний
        начального и конечного состояний:
        q= h6 - h3 // г/кг с.в.
      */
      case 'cooling':
        // finalParams.t isRequired
        if (finalParams && finalParams.t) {
          if (finalParams.t < this.get('t')) {
            const newT = finalParams.t;

            if (tR <= finalParams.t) {
              // [x] 2.1. Перпендикулярная линия не пересекается с кривой насыщения
              // скрытая энергия равна 0
              newPoint = new TDPoint({
                t: newT,
                fi: Lines.getFi({ t: newT, h }), // h is const
                errors,
                parentPoint: this
              });
              newPoint.processResult = this.getProcessResultObj({ endPoint: newPoint });
            } else {
              // [ ] 2.2. Нужно вычислить скрытую теплоту на конденсацию
              // TODO: Should be tested!
              // [x] 2.2.1 До точки насыщения
              const newPoint0 = new TDPoint({
                t: tR,
                fi: Lines.getFi({ t: tR, h }), // Should be 100 %
                errors,
                parentPoint: this
              });

              newPoint0.processResult = this.getProcessResultObj({ endPoint: newPoint0 });

              // [x] 2.2.2 После насыщения
              // Ищем пересечение заданной конечной t с кривой насыщения
              const commonPoint = Points.getCommonPoint0({
                fn1: Lines.getBrokenLineByPoints(pointsFi100),
                fn2: () => newT,
              });
              const newH = commonPoint.h;
              const newFi = Lines.getFi({ t: newT, h: newH });

              newPoint = new TDPoint({ t: newT, fi: newFi, errors, parentPoint: newPoint0 });
              newPoint.processResult = this.getProcessResultObj({ startPoint: newPoint0, endPoint: newPoint });
            }
            result = newPoint;
          } else {
            errors.push('ERROR: TDPoint.process');
            errors.push('Температура точки после охлаждения должна быть ниже исходной');
            result = new TDPoint({
              t: this.t,
              fi: this.fi,
              errors,
              parentPoint: this
            });
          }
        } else {
          errors.push('ERROR: TDPoint.process');
          errors.push(`Неприемлемые для передаваемого параметра (finalParams && finalParams.t) is ${Boolean(finalParams && finalParams.t)} в случае охлаждения`);
          result = new TDPoint({
            t: this.t,
            fi: this.fi,
            errors,
            parentPoint: this
          });
        }
        break;

      // [ ] 3. ADIABATIC (e= const)
      // TODO: test
      case 'adiabatic': // Осушение по линии постоянной энтальпии
        if (finalParams && finalParams.t) {
          // [ ] 3.1 Известна заданная конечная температура
          // finalParams.t isRequired
          const newT = finalParams.t;
          const newFi = Lines.getFi({
            t: newT,
            h: linear({ x: newT, x1: this.t, y1: this.fi, x2: tWB, y2: 100 })
          });

          if (newT >= tWB) {
            // [x] 3.1.1 Если newT >= tWB мокрого термометра, найдем нужную точку
            newPoint = new TDPoint({
              t: newT,
              fi: newFi,
              errors,
              parentPoint: this
            });
            newPoint.processResult = this.getProcessResultObj({ endPoint: newPoint });
            result = newPoint;
          } else {
            // [x] 3.1.2 Если нет, придется остановиться на tWB
            newPoint = new TDPoint({ t: tWB, fi: 100, errors, parentPoint: this });
            newPoint.processResult = this.getProcessResultObj({ endPoint: newPoint });
            result = newPoint;
          }
        } else if (finalParams && finalParams.fi) {
          // [x] 3.2 Известна заданная конечная влажность
          // finalParams.fi isRequired
          const newFi = finalParams.fi;

          if (newFi < 0) {
            errors.push('FUCKUP: Зачем указывать влажность менее 0?');
            result = new TDPoint({ t: this.t, fi: this.fi, errors, parentPoint: this });
          } else if (newFi <= 100 && newFi > 0) {
            // [x] 3.2.1 Если конечная влажность <= 100 %, найдем нужную точку
            const newT = linear({ x: finalParams.fi, x1: this.fi, y1: this.t, x2: 100, y2: tWB });

            newPoint = new TDPoint({ t: newT, fi: newFi, errors, parentPoint: this });
            newPoint.processResult = this.getProcessResultObj({ endPoint: newPoint });
            result = newPoint;
          } else {
            // [x] 3.2.2 Если нет, придется остановиться на tWB
            newPoint = new TDPoint({ t: tWB, fi: 100, errors, parentPoint: this });
            newPoint.processResult = this.getProcessResultObj({ endPoint: newPoint });
            result = newPoint;
          }
        } else {
          errors.push('ERROR: TDPoint.process');
          errors.push('Параметры finalParams.t or finalParams.fi не переданы для процесса adiabatic');
          result = new TDPoint({
            t: this.t,
            fi: this.fi,
            errors,
            parentPoint: this
          });
        }
        break;

      // [ ] Others...

      default:
        errors.push('ERROR: TDPoint.process');
        errors.push(`Нет описания для type= ${type}`);
        result = new TDPoint({
          t: this.t,
          fi: this.fi,
          errors,
          parentPoint: this
        });
        break;
    }

    if (!result) {
      return this;
    }
    return result;
  }

  // FORMULAS
  getHumidity() {
    const { t, fi } = this;

    return Formulas.getHumidityByParams0({ t, fi });
  }
  getEnthalpy() {
    const { t, fi } = this;

    return Formulas.getEnthalpyByParams0({ t, fi });
  }
  getDPT() {
    const { t, fi } = this;

    return Lines.getDPT({ t, fi });
  }
  getWBT() {
    const { t, fi } = this;

    return Lines.getWBT({ t, fi });
  }

  // ADDITIONAL METHODS
  getProcessResultObj({ startPoint = null, endPoint }) {
    if (startPoint) {
      return { // Я подумал, в верхнем регистре будет уместно...
        DELTA_H: endPoint.getHumidity() - startPoint.getHumidity(),
        DELTA_E: endPoint.getEnthalpy() - startPoint.getEnthalpy(),
        DELTA_FI: endPoint.get('fi') - startPoint.get('fi')
      };
    }

    return {
      DELTA_H: endPoint.getHumidity() - this.getHumidity(),
      DELTA_E: endPoint.getEnthalpy() - this.getEnthalpy(),
      DELTA_FI: endPoint.get('fi') - this.get('fi')
    };
  }

  // For testing only
  get(propName) {
    return this[propName];
  }
}

export default TDPoint;
