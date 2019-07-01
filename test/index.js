import { assert } from 'chai';
import Immutable from 'immutable';
import { getKB } from 'interpolate-by-pravosleva';

import { Formulas, Lines, Points, TDPoint } from '../src';


describe('Awesome test.', () => {
  // it('1.1. Lines.getEnthalpyLines\ni= -18 kJ/kg; d= 3 g/kg', () => {
  //   const expectedEnthalpyVal = -18;
  //   const testedFns = Lines.getEnthalpyLines();
  //   const testHumidity = 3;
  //   const testedVal = testedFns[0](testHumidity);
  //
  //   assert(testedVal === expectedEnthalpyVal, `FuckUp :( testedVal(${testHumidity}) is ${testedVal}`);
  // });

  // it('1.2. Lines.getEnthalpyLines\ni= 88 kJ/kg; d= 15 g/kg', () => {
  //   const expectedEnthalpyVal = 1.5158924205378952;
  //   const testedFns = Lines.getEnthalpyLines();
  //   const testHumidity = 15;
  //   const testedVal = testedFns[testedFns.length - 1](testHumidity);
  //
  //   assert(testedVal === expectedEnthalpyVal, `FuckUp :( testedVal(${testHumidity}) is ${testedVal}`);
  // });

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
  //     `FuckUp :( testedVal(${testTemp}) is ${testedVal}; Should be ${expectedHumidityVal}`
  //   );
  // });

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
  //     `FuckUp :( testedVal(${testTemp}) is ${testedVal}; Should be ${expectedHumidityVal}`
  //   );
  // });

  it('2.1. Formulas.getHumidityByParams0', () => {
    const expectedEnthalpyVal = 2.6474274931774056;
    const testedVal = Formulas.getHumidityByParams0({
      t: 12.310041624590525,
      fi: 30
    });

    assert(testedVal === expectedEnthalpyVal, `FuckUp :( testedVal is ${testedVal}`);
  });

  it('2.2. Formulas.getHumidityByParams1', () => {
    const expectedEnthalpyVal = 5.000000000000001;
    const testedVal = Formulas.getHumidityByParams1({
      e: 25,
      t: 12.310041624590525
    });

    assert(testedVal === expectedEnthalpyVal, `FuckUp :( testedVal is ${testedVal}`);
  });

  it('2.3. Formulas.getTemperatureByParams0', () => {
    const expectedEnthalpyVal = 12.310041624590525;
    const testedVal = Formulas.getTemperatureByParams0({
      e: 25,
      h: 5
    });

    assert(testedVal === expectedEnthalpyVal, `FuckUp :( testedVal is ${testedVal}`);
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

    assert(testedT.toFixed(2) === t.toFixed(2), `FuckUp :( testedT is ${testedT}; Should be ${t}`);
  });

  it('3.2. Lines.getConstEnthalpyLine', () => {
    const t = -41;
    const fi = 50;
    const enthalpyLine = Lines.getConstEnthalpyLine({ t, fi });
    const d = Formulas.getHumidityByParams0({ t, fi });
    const testedT = enthalpyLine(d);

    assert(testedT.toFixed(2) === t.toFixed(2), `FuckUp :( testedT is ${testedT}; Should be ${t}`);
  });

  it('4.1. Formulas.getEnthalpyByParams0', () => {
    const t = -41;
    const fi = 50;
    const enthalpy = Formulas.getEnthalpyByParams0({ t, fi });
    const humidity = Formulas.getHumidityByParams1({ e: enthalpy, t });
    const testedT = Formulas.getTemperatureByParams0({ e: enthalpy, h: humidity });

    assert(testedT.toFixed(2) === t.toFixed(2), `FuckUp :( testedT is ${testedT}; Should be ${t}`);
  });

  it('4.2. Points.getHValues', () => {
    const t = -41;
    const fi = 50;
    const hValues = Points.getHValues();
    const expectedObj = Immutable.List([
      0.07007710725563997,
      0.0785592029140801,
      0.08797924408173158,
      0.09843090770967834,
      0.11001619358421441,
      0.12284606858671178,
      0.13704115317769494,
      0.15273245236991417,
      0.17006213355589359,
      0.18918435366145067,
      0.2102661382086342,
      0.2334883149901159,
      0.25904650518306077,
      0.28715217486480776,
      0.3180337500363144,
      0.35193779841342376,
      0.3891302814118878,
      0.42989787993121437,
      0.4745493977364554,
      0.52341724644788,
      0.5768590163782246,
      0.6352591377082106,
      0.6990306367659711,
      0.7686169924779105,
      0.8444940983907006,
      0.9271723360303464,
      1.0171987657687929,
      1.1151594418160768,
      1.2216818584519133,
      1.3374375351607373,
      1.463144748945304,
      1.599571422773412,
      1.747538179868573,
      1.9079215743978324,
      2.0816575100490744,
      2.2697448590377944,
      2.473249295252825,
      2.693307356556901,
      2.9311307527179835,
      3.188010937080169,
      3.4653239619100726,
      3.7645356394003158,
      4.050189774041156,
      4.354973689056322,
      4.6800018728214745,
      5.0264452009967355,
      5.395533570737754,
      5.7885586770223165,
      6.2068769421233565,
      6.651912610311671,
      7.125161021028369,
      7.628192075039576,
      8.16265390948637,
      8.730276799285697,
      9.33287730403888,
      9.972362681481155,
      10.650735590578813,
      11.370099109672843,
      12.132662097605248,
      12.940744928576219,
      13.796785634600349,
      14.703346492895967,
      15.663121099397618,
      16.67894197387617,
      17.75378874694217,
      18.890796984559262,
      20.093267711681875,
      21.364677703339563,
      22.708690619018434,
      24.12916906465225,
      25.630187676062526,
      27.216047328432374,
      28.891290588537505,
      30.66071854019654,
      32.529409128980824,
      34.50273718991944,
      36.586396342075474,
      38.78642295683693,
      41.10922243301185,
      43.5615980418674,
      46.150782639739546,
      48.88447358549566,
      51.77087124584378
    ]);
    const testedObj = Immutable.List(hValues);

    assert(testedObj.equals(expectedObj), `FuckUp :( testedObj is ${JSON.stringify(testedObj)}; Should be ${expectedObj}`);
  });

  it('4.3. Lines.getBrokenLineByPoints', () => {
    const line = Lines.getBrokenLineByPoints([
      { x: 0, y: 1 },
      { x: 1, y: 2 }
    ]);
    const expectedVal = 0.5;
    const testedVal = line(-0.5);

    assert(expectedVal === testedVal, `FuckUp :( testedVal is ${testedVal}; Should be ${expectedVal}`);
  });

  // Пересечение прямой постоянной энтальпии для заданной точки с ломанной
  // кривой насыщения fi=100%
  it('4.4.1. Points.getWBT t= 16; fi= 50', () => {
    const t = 16;
    const fi = 50;
    const expectedVal = 10.484320675266424;
    const testedVal = Formulas.getWBT({ t, fi });

    assert(expectedVal === testedVal, `FuckUp :( testedVal is ${testedVal}; Should be ${expectedVal}`);
  });

  it('4.4.2. WET BULB TEMPERATURE Points.getWBT for Moscow: t= 28; fi= 43', () => {
    const t = 28;
    const fi = 43;
    const expectedVal = 19.030956508469423;
    const testedVal = Formulas.getWBT({ t, fi });

    assert(expectedVal === testedVal, `FuckUp :( testedVal is ${testedVal}; Should be ${expectedVal}`);
  });

  it('4.4.3. Formulas.getTR0 Moscow: t= 28; fi= 43', () => {
    const t = 28;
    const fi = 43;
    const expectedVal = 14.266000848002328; // Should be 14.2; https://planetcalc.ru/248/
    const testedVal = Formulas.getTR0({ t, fi });

    assert(expectedVal === testedVal, `FuckUp :( testedVal is ${testedVal}; Should be ${expectedVal}`);
  });

  it('4.4.4. Formulas.getTR1 Moscow: t= 28; fi= 43', () => {
    const t = 28;
    const fi = 43;
    const expectedVal = 16.6; // Should be 14.2; https://planetcalc.ru/248/
    const testedVal = Formulas.getTR1({ t, fi });

    assert(expectedVal === testedVal, `FuckUp :( testedVal is ${testedVal}; Should be ${expectedVal}`);
  });

  it('5.1 Points.getCommonPoint0', () => {
    const { k: k1, b: b1 } = getKB({ x1: 0, y1: 1, x2: 1, y2: 2 });
    const { k: k2, b: b2 } = getKB({ x1: 0, y1: 2, x2: 1, y2: 1 });
    const fn1 = x => (k1 * x) + b1;
    const fn2 = x => (k2 * x) + b2;
    const point = Immutable.Map(Points.getCommonPoint0({ fn1, fn2 }));
    const expectedPoint = Immutable.Map({ h: 0.5000384769439699, t: 1.5000384769439699 });

    assert(point.equals(expectedPoint), 'FUCKUP: Doesn\'t work!')
  });

  // Was not checked yet.
  // it('5.2. pointsFi100 test h= 5.034 g/kg', () => {
  //   const h = 5.034;
  //   const pointsFi100 = Points.getFi100Points();
  //   const lineFi100 = Lines.getBrokenLineByPoints(pointsFi100);
  //
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(h => console.log(lineFi100(h)));
  //
  //   const expectedVal = 4; // C
  //   const testedVal = lineFi100(h);
  //
  //   assert(testedVal === expectedVal, `FuckUp :( testedVal is ${testedVal}; Should be ${expectedVal}`);
  // });

  it('6.1 TDPoint.get(\'t\')', () => {
    const point = new TDPoint({ t: 28, fi: 43 });
    const expectedVal = 28;
    const testedT = point.get('t');

    assert(expectedVal === testedT, `FUCKUP: testedT is ${testedT}`)
  });

  it('6.2 TDPoint.process() HEATING', () => {
    const point = new TDPoint({ t: 28, fi: 43 });
    const testedHeatingProcess = point.process({
      type: 'heating',
      finalParams: {
        t: 50
      }
    });
    // const tAfter = testedHeatingProcess.get('t');
    const expectedFiAfter = 37.592996573271044;
    const testedFiAfter = testedHeatingProcess.get('fi');

    assert(testedFiAfter === expectedFiAfter, `FUCKUP: testedFiAfter is ${testedFiAfter}`)
  });

  it('6.3 TDPoint.getEnthalpy()', () => {
    const point = new TDPoint({ t: 28, fi: 43 });
    const expectedEnthalpy = 53.95286230707845;
    const testedEnthalpy = point.getEnthalpy();

    assert(testedEnthalpy === expectedEnthalpy, `FUCKUP: testedEnthalpy is ${testedEnthalpy}`)
  });

  it('6.4 TDPoint.getTR()', () => {
    const point = new TDPoint({ t: 28, fi: 43 });
    const expectedTR = 14.266000848002328;
    const testedTR = point.getTR();

    assert(testedTR === expectedTR, `FUCKUP: testedTR is ${testedTR}`)
  });

  it('6.5 TDPoint.getWBT()', () => {
    const point = new TDPoint({ t: 28, fi: 43 });
    const expectedWBT = 19.030956508469423;
    const testedWBT = point.getWBT();

    assert(testedWBT === expectedWBT, `FUCKUP: testedWBT is ${testedWBT}`)
  });
});
