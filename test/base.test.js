'use strict';

const chai = require('chai'),
  expect = chai.expect,
  Routes = require('../index');

describe('Base', () => {
  it('Short constructor', () => {
    const routes1 = new Routes();
    const routes2 = Routes();
    const routes3 = Routes();

    expect(routes1 instanceof Routes).to.be.ok;
    expect(routes2 instanceof Routes).to.be.ok;
    expect(routes3 instanceof Routes).to.be.ok;

    expect(routes1 === routes2).to.not.be.ok;
    expect(routes2 === routes3).to.not.be.ok;
    expect(routes1 === routes3).to.not.be.ok;

  });
});
