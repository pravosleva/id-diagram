/* eslint-disable no-plusplus */
import Formulas from './Formulas';


class TDPoint {
  constructor(props) {
    const requiredProps = ['t', 'fi'];
    const optionalProps = ['errors'];

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
        this.errors.push('Относительная влажность не может быть менее либо равно 0 %');
      } else if (props.fi > 100) {
        this.errors.push('Относительная влажность не может быть более 100 %');
      }
    }
  }

  // TODO: Processes...
  process({
    type,
    finalParams
  }) {
    const errors = [];
    let result = null;

    switch (type) {
      // [x] 1. HEATING: Направление процесса вертикально вверх
      case 'heating':
        if (finalParams && finalParams.t) {
          const newT = finalParams.t;

          // 1. Найти newFi by (h, newT) графически
          const h = this.getHumidity();
          const newFi = Formulas.getFi0({ t: newT, h });

          result = new TDPoint({ t: newT, fi: newFi });
        } else {
          errors.push('ERROR: TDPoint.process');
          errors.push('Проверьте параметр (finalParams && finalParams.t)');
          result = new TDPoint({ t: this.t, fi: this.fi, errors });
        }
        break;

      // [ ] 2. TODO: COOLING: Вниз до пересечения с кривой насыщения,
      // дальше вниз по ней, надо разюираться...

      // Others...
      default:
        errors.push('ERROR: TDPoint.process');
        errors.push(`Нет описания для type= ${type}`);
        result = new TDPoint({ t: this.t, fi: this.fi, errors });
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
  getTR() {
    const { t, fi } = this;

    return Formulas.getTR0({ t, fi });
  }
  getWBT() {
    const { t, fi } = this;

    return Formulas.getWBT({ t, fi });
  }

  // For testing only
  get(propName) {
    return this[propName];
  }
}

export default TDPoint;
