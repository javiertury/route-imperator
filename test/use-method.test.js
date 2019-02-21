'use strict';

const chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  support = require('./support'),
  Routes = require('../index');

chai.use(sinonChai);

describe('"use" method', () => {
  it('Basic', () => {
    const routes = new Routes();

    const mid1 = function mid1(ctx, next) {return next();};
    routes.use(mid1);
    expect(routes._middlewares).to.deep.equal([mid1]);

    const mid2 = function mid2(ctx, next) {return next();};
    routes.use(mid2);
    expect(routes._middlewares).to.deep.equal([mid1, mid2]);

    const mid3 = function mid3(ctx, next) {return next();};
    const mid4 = function mid4(ctx, next) {return next();};
    const mid5 = function mid5(ctx, next) {return next();};
    routes.use(mid3, mid4, mid5);
    expect(routes._middlewares).to.deep.equal([mid1, mid2, mid3, mid4, mid5]);
  });

  it('Is chainable', () => {
    // One handler
    const routes = new Routes();
    const result = routes.use(() => {});
    expect(result).to.equal(routes);

    // Multiple handlers
    const routes2 = new Routes();
    const result2 = routes2.use(() => {}, () => {}, () => {});
    expect(result2).to.equal(routes2);
  });
});
