import { assert } from 'chai';
// import Immutable from 'immutable';
import { getKB } from 'interpolate-by-pravosleva';

import { Formulas, Lines } from '../src';

describe('Awesome test.', () => {
  // it('should test default awesome function', () => {
  //   const expectedVal = 'I am the Default Awesome Function, fellow comrade! - Dinesh'
  //   assert(defaultAwesomeFunction('Dinesh') === expectedVal, 'Default not awesome :(');
  // });

  // it('should test awesome function', () => {
  //   const expectedVal = 'I am just an Awesome Function'
  //   assert(awesomeFunction() === expectedVal, 'Named awesome :(');
  // });

  // it('Formulas.getTstCoeffs', () => {
  //   const expectedObj = Immutable.Map({ k: 2.207486631016043, b: -22.064 });
  //   const testedObj = Immutable.Map(Formulas.getTstCoeffs());
  //
  //   assert(testedObj.equals(expectedObj), `Named awesome :( testedObj is ${JSON.stringify(testedObj)}`);
  // });

  it('1.1. Lines.getEnthalpyLines\ni= -16 kJ/kg; d= 5 g/kg', () => {
    const expectedEnthalpyVal = -11.026566844919786;
    const testedFns = Lines.getEnthalpyLines();
    const testHumidity = 5;
    const testedVal = testedFns[0](testHumidity);

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal(${testHumidity}) is ${testedVal}`);
  });

  it('1.2. Lines.getEnthalpyLines\ni= 88 kJ/kg; d= 15 g/kg', () => {
    const expectedEnthalpyVal = 1.5158924205378952;
    const testedFns = Lines.getEnthalpyLines();
    const testHumidity = 15;
    const testedVal = testedFns[testedFns.length - 1](testHumidity);

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal(${testHumidity}) is ${testedVal}`);
  });

  // DEPRECATED METHODS
  // it('Lines._getHumidityLines fi= 10 %; t= 15 C', () => {
  //   const expectedHumidityVal = Formulas.getHumidityByParams0({
  //     temperature: 15,
  //     fi: 10
  //   });
  //   const testedFns = Lines._getHumidityLines();
  //   const testTemp = 15;
  //   const testedVal = testedFns[0](testTemp);
  //
  //   assert(
  //     testedVal === expectedHumidityVal,
  //     `Named awesome :( testedVal(${testTemp}) is ${testedVal}; Should be ${expectedHumidityVal}`
  //   );
  // });
  //
  // it('Lines._getHumidityLines fi= 100 %; t= 21 C', () => {
  //   const expectedHumidityVal = Formulas.getHumidityByParams0({
  //     temperature: 21,
  //     fi: 100
  //   });
  //   const testedFns = Lines._getHumidityLines();
  //   const testTemp = 21;
  //   const testedVal = testedFns[testedFns.length - 1](testTemp);
  //
  //   assert(
  //     testedVal === expectedHumidityVal,
  //     `Named awesome :( testedVal(${testTemp}) is ${testedVal}; Should be ${expectedHumidityVal}`
  //   );
  // });

  it('2.1. Formulas.getHumidityByParams0', () => {
    const expectedEnthalpyVal = 2.6474274931774056;
    const testedVal = Formulas.getHumidityByParams0({
      t: 12.310041624590525,
      fi: 30
    });

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal is ${testedVal}`);
  });

  it('2.2. Formulas.getHumidityByParams1', () => {
    const expectedEnthalpyVal = 5.000000000000001;
    const testedVal = Formulas.getHumidityByParams1({
      e: 25,
      t: 12.310041624590525
    });

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal is ${testedVal}`);
  });

  it('2.3. Formulas.getTemperatureByParams0', () => {
    const expectedEnthalpyVal = 12.310041624590525;
    const testedVal = Formulas.getTemperatureByParams0({
      e: 25,
      h: 5
    });

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal is ${testedVal}`);
  });

  it('3.1. userB coeff', () => {
    const t = 25;
    const fi = 20;
    const d = Formulas.getHumidityByParams0({ t, fi });

    const enthalpyLine = Lines.getEnthalpyLines()[4];
    const x1 = 1;
    const x2 = 5;
    const y1 = enthalpyLine(x1);
    const y2 = enthalpyLine(x2);
    const { k, b } = getKB({ x1, y1, x2, y2 });
    // b = y - (k * x);

    const userB = t - (k * d);
    const testedT = (k * d) + userB;

    assert(testedT.toFixed(2) === t.toFixed(2), `Named awesome :( testedT is ${testedT}; Should be ${t}`);
  });

  it('3.2. Lines.getEnthalpyLine', () => {
    const t = -41;
    const fi = 50;
    const enthalpyLine = Lines.getEnthalpyLine({ t, fi });
    const d = Formulas.getHumidityByParams0({ t, fi });
    const testedT = enthalpyLine(d);

    assert(testedT.toFixed(2) === t.toFixed(2), `Named awesome :( testedT is ${testedT}; Should be ${t}`);
  });

  it('4.1. Formulas.getEnthalpyByParams0', () => {
    const t = -41;
    const fi = 50;
    const enthalpy = Formulas.getEnthalpyByParams0({ t, fi });
    const humidity = Formulas.getHumidityByParams1({ e: enthalpy, t });
    const testedT = Formulas.getTemperatureByParams0({ e: enthalpy, h: humidity });

    assert(testedT.toFixed(2) === t.toFixed(2), `Named awesome :( testedT is ${testedT}; Should be ${t}`);
  });
});
