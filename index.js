'use strict';

const httpMethods = require('http').METHODS;

function Routes () {
  if (!(this instanceof Routes)) {
    return new Routes();
  }

  this._middlewares = [];
  this.routes = [];
}

// Static methods

Routes._chainPath = function _chainPath(a, b) {
  if (!a.length) {
    return b;
  }

  if (!b.length) {
    return a;
  }

  const sepA = a[a.length -1] === '/';
  const sepB = b[0] === '/';


  if (sepA && sepB) {
    return `${a}${b.slice(1)}`;
  }

  if (!sepA && !sepB) {
    return `${a}/${b}`;
  }

  return `${a}${b}`;
};


// Instance methods

Routes.prototype._on = function _on(method, path, handlers) {
  if (!handlers.length) {
    throw new Error(`A handler must be defined for ${method} - ${path}`);
  }

  handlers.forEach(h => {
    if (typeof h !== 'function') {
      throw new Error(`Handler for ${method} - ${path} is not a function: ${h}`);
    }
  });

  this.routes.push({
    method,
    path,
    handlers: this._middlewares.concat(handlers),
  });

  // Make method chainable
  return this;
};

Routes.prototype.on = function on (method, path, ...handlers) {
  this._on(method, path, handlers);
  return this;
};

Routes.prototype.use = function use (...middlewares) {
  this._middlewares.push.apply(this._middlewares, middlewares);
  
  // Make method chainable
  return this;
};

Routes.prototype.load = function load (path, instance) {
  if (path && typeof path !== 'string') {
    instance = path;
    path = '';
  }
  
  if (!(instance instanceof this.constructor)) {
    throw new Error('Invalid instance passed to load');
  }
  
  instance.routes.forEach(r => {
    this._on(r.method,
      this.constructor._chainPath(path, r.path),
      this._middlewares.concat(r.handlers));
  });
  
  // Make method chainable
  return this;
};

// Change method signature for multiple handlers, ...handlers
httpMethods.concat('ALL').forEach(m => {
  Routes.prototype[m.toLowerCase()] = function (path, ...handlers) {
    return this._on(m, path, handlers);
  };
});

module.exports = Routes;
