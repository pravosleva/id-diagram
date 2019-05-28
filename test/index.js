import { assert } from 'chai';
// import Immutable from 'immutable';

import ID, { awesomeFunction } from '../src';

describe('Awesome test.', () => {
  // it('should test default awesome function', () => {
  //   const expectedVal = 'I am the Default Awesome Function, fellow comrade! - Dinesh'
  //   assert(defaultAwesomeFunction('Dinesh') === expectedVal, 'Default not awesome :(');
  // });

  // it('should test awesome function', () => {
  //   const expectedVal = 'I am just an Awesome Function'
  //   assert(awesomeFunction() === expectedVal, 'Named awesome :(');
  // });

  // it('ID.getTstCoeffs', () => {
  //   const expectedObj = Immutable.Map({ k: 2.207486631016043, b: -22.064 });
  //   const testedObj = Immutable.Map(ID.getTstCoeffs());
  //
  //   assert(testedObj.equals(expectedObj), `Named awesome :( testedObj is ${JSON.stringify(testedObj)}`);
  // });

  it('ID.getEnthalpyLines\ni= -16 kJ/kg; d= 5 g/kg', () => {
    const expectedEnthalpyVal = -11.026566844919786;
    const testedFns = ID.getEnthalpyLines();
    const testHumidity = 5;
    const testedVal = testedFns[0](testHumidity);

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal(${testHumidity}) is ${testedVal}`);
  });

  it('ID.getEnthalpyLines\ni= 88 kJ/kg; d= 15 g/kg', () => {
    const expectedEnthalpyVal = 1.5158924205378952;
    const testedFns = ID.getEnthalpyLines();
    const testHumidity = 15;
    const testedVal = testedFns[testedFns.length - 1](testHumidity);

    assert(testedVal === expectedEnthalpyVal, `Named awesome :( testedVal(${testHumidity}) is ${testedVal}`);
  });
});
