'use strict';

const chai = require('chai'),
  expect = chai.expect,
  httpMethods = require('http').METHODS.concat('ALL'),
  Routes = require('../index');

describe('Shorthand methods', () => {

  it('Test includes basic methods', () => {
    ['GET', 'HEAD', 'POST', 'ALL'].forEach(m => {
      httpMethods.includes(m);
    });
  });

  it('Accepts one or many handlers', () => {
    const single = [{
      path: '/a',
      handlers: [
        function handler0(ctx, next) {return next();},
      ],
    }];

    const multi = [{
      path: '/a',
      handlers: [
        function handler0(ctx, next) {return next();},
        function handler1(ctx, next) {return next();},
        function handler2(ctx, next) {return next();},
      ],
    }, {
      path: '/b',
      handlers: [
        function handler0(ctx, next) {return next();},
        function handler1(ctx, next) {return next();},
        function handler2(ctx, next) {return next();},
      ],
    }, {
      path: '/c',
      handlers: [
        function handler0(ctx, next) {return next();},
        function handler1(ctx, next) {return next();},
        function handler2(ctx, next) {return next();},
      ],
    }];

    httpMethods.forEach(method => {
      const routes = new Routes();

      routes[method.toLowerCase()](single[0].path, single[0].handlers[0]);

      multi.forEach(r => {
        routes[method.toLowerCase()](r.path, r.handlers[0], r.handlers[1], r.handlers[2]);
      });

      const target = single.concat(multi).map(r => {
        return Object.assign({ method: method }, r);
      });

      expect(routes.routes).to.deep.equal(target);
    });
  });

  it('Uses only previously declared middleware', () => {
    const handler = function handler(ctx, next) {return next();};

    const setup = [{
      path: '/a',
      handlers: [
        handler
      ],
    }, {
      path: '/b',
      handlers: [
        handler
      ],
    }, {
      path: '/c',
      handlers: [
        handler
      ],
    }];

    const mid1 = function mid1(ctx, next) {return next();};
    const mid2 = function mid2(ctx, next) {return next();};
    const mid3 = function mid3(ctx, next) {return next();};

    httpMethods.forEach(method => {
      const routes = new Routes();
      const methodSetup = setup.map(r => Object.assign({ method: method }, r));

      routes[method.toLowerCase()](setup[0].path, setup[0].handlers[0]);
      routes.use(mid1);

      routes[method.toLowerCase()](setup[1].path, setup[1].handlers[0]);
      routes.use(mid2);

      routes[method.toLowerCase()](setup[2].path, setup[2].handlers[0]);
      routes.use(mid3);

      const target = methodSetup.slice(0);
      target[1].handlers = [mid1, handler];
      target[2].handlers = [mid1, mid2, handler];

      expect(routes.routes).to.deep.equal(target);
    });
  });

  it('Is chainable', () => {
    httpMethods.forEach(method => {
      // One handler
      const routes = new Routes();
      const result = routes[method.toLowerCase()]('/a', () => {});
      expect(result).to.equal(routes);

      // Multiple handlers
      const routes2 = new Routes();
      const result2 = routes2[method.toLowerCase()]('/a', () => {}, () => {}, () => {});
      expect(result2).to.equal(routes2);
    });
  });

  it('Fails if no handler is provided', () => {
    const routes = new Routes();

    httpMethods.forEach(method => {
      expect(routes[method.toLowerCase()].bind(routes, '/a')).to.throw;
    });
  })

  it('Fails if any handler is not a function', () => {
    const routes = new Routes();

    httpMethods.forEach(method => {
      expect(routes[method.toLowerCase()].bind(routes, '/a', 'qwerty')).to.throw;
      expect(routes[method.toLowerCase()].bind(routes, '/a', () => {}, () => {})).to.not.throw;
      expect(routes[method.toLowerCase()].bind(routes, '/a', () => {}, 'qwerty')).to.throw;
    });
  })

});
