'use strict';

const chai = require('chai'),
  expect = chai.expect,
  Routes = require('../index');

describe('"on" method', () => {

  it('Basic', () => {
    const routes = new Routes();

    const single = [{
      method: 'GET',
      path: '/a',
      handlers: [
        function handler0(ctx, next) {return next();},
      ],
    }];

    const multi = [{
      method: 'GET',
      path: '/a',
      handlers: [
        function handler0(ctx, next) {return next();},
        function handler1(ctx, next) {return next();},
        function handler2(ctx, next) {return next();},
      ],
    }, {
      method: 'POST',
      path: '/b',
      handlers: [
        function handler0(ctx, next) {return next();},
        function handler1(ctx, next) {return next();},
        function handler2(ctx, next) {return next();},
      ],
    }, {
      method: 'GET',
      path: '/c',
      handlers: [
        function handler0(ctx, next) {return next();},
        function handler1(ctx, next) {return next();},
        function handler2(ctx, next) {return next();},
      ],
    }];

    routes.on(single[0].method, single[0].path, single[0].handlers[0]);

    multi.forEach(r => {
      routes.on(r.method, r.path, r.handlers[0], r.handlers[1], r.handlers[2]);
    });

    expect(routes.routes).to.deep.equal(single.concat(multi));
  });

  it('Uses only previously declared middleware', () => {
    const routes = new Routes();

    const handler = function handler(ctx, next) {return next();};

    const setup = [{
      method: 'GET',
      path: '/a',
      handlers: [
        handler
      ],
    }, {
      method: 'POST',
      path: '/b',
      handlers: [
        handler
      ],
    }, {
      method: 'GET',
      path: '/c',
      handlers: [
        handler
      ],
    }];

    const mid1 = function mid1(ctx, next) {return next();};
    const mid2 = function mid2(ctx, next) {return next();};
    const mid3 = function mid3(ctx, next) {return next();};

    routes.on(setup[0].method, setup[0].path, setup[0].handlers[0]);
    routes.use(mid1);

    routes.on(setup[1].method, setup[1].path, setup[1].handlers[0]);
    routes.use(mid2);

    routes.on(setup[2].method, setup[2].path, setup[2].handlers[0]);
    routes.use(mid3);

    const target = setup.slice(0);
    target[1].handlers = [mid1, handler];
    target[2].handlers = [mid1, mid2, handler];

    expect(routes.routes).to.deep.equal(target);
  });

  it('Is chainable', () => {
    // One handler
    const routes = new Routes();
    const result = routes.on('GET', '/a', () => {});
    expect(result).to.equal(routes);

    // Multiple handlers
    const routes2 = new Routes();
    const result2 = routes2.on('GET', '/a', () => {}, () => {}, () => {});
    expect(result2).to.equal(routes2);
  });

  it('Fails if no handler is provided', () => {
    const routes = new Routes();

    expect(routes.on.bind(routes, 'GET', '/a')).to.throw;
  })

  it('Fails if any handler is not a function', () => {
    const routes = new Routes();

    expect(routes.on.bind(routes, 'GET', '/a', 'qwerty')).to.throw;
    expect(routes.on.bind(routes, 'GET', '/a', () => {}, () => {})).to.not.throw;
    expect(routes.on.bind(routes, 'GET', '/a', () => {}, 'qwerty')).to.throw;
  })

});
