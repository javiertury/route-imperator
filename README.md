# Divide et impera

`route-imperator` helps you organizing declarative routes in an imperative way. After collecting all your routes, you may use any router of your choice.

This program assumes that all routes are orthogonal, therefore is a good match for trie, radix or prefix routers. It allows to nest collections of routes and to apply middlewares.

Routers with support for route-imperator:

- [koa-my-way](https://github.com/javiertury/koa-my-way)

## Installation

```javascript
npm install --save route-imperator
```

## Example

```javascript
// routes/users.js

const routes = require('route-imperator')()

routes
.get('/', searchUsers)
.get('/:id', findUser)

// this middlware only applies to subsequent route definitions
routes.use(verifyLoggedIn)

routes
.patch('/', modifyUser)
.delete('/', deleteUser, notifyDeletion)

module.exports = routes


// routes/index.js

const routes = require('route-imperator')()

const users = require('./users');
const messages = require('./messages');

// Nest routes using a path prefix
routes.load('/users', users)
routes.load('/messages', messages)

module.exports = routes


// router.js

const router = require('koa-my-way')()
const routes = require('./routes')

router.load(routes);

module.exports = router;
```

## API

### routes.use(...middlewares)

After a middleware is defined, all subsequent routes will use that middleware. Middlewares are applied in the order that they are defined.

```javascript

// No middlewares applied
routes.get('/', searchPhotos);

routes.use(mid1);

// mid1 executed before findPhoto
routes.get('/:id', findPhoto)

routes.use(mid2, mid3);
routes.use(mid4);

// This route has mid1, mid2, mid3 and mid4 and createPhoto
routes.post('/', createPhoto)
```

### routes.on(method, path, ...handlers)

Defines a route, there are also shorthand methods available

```javascript

routes.on('GET', '/', searchPhotos);
routes.on('GET', '/:id', findPhoto);
routes.on('POST', '/d', verifyLoggedIn, uploadPhoto);

// Equivalent calls using shorthand methods
routes
.get('/', searchPhotos)
.get('/:id', findPhoto)
.post('/', verifyLoggedIn, uploadPhoto)

```

### routes.load([path,] instance)

```javascript

// router/users.js

routes.use(usersMiddleware)

routes
.get('/', searchUsers)
.get('/:id', findUser)
.post('/', robotFilter, createUser)

module.exports = routes


// router/index.js

const users = require('./users');

routes.use(generalMiddleware)

routes.load('/users', users)

// Here the routes look like this
//  [{
//    method: 'GET', 
//    path: '/users/', 
//    handlers: [
//      generalMiddlware, 
//      usersMiddlware, 
//      searchUsers, 
//    ]
//  },{
//    method: 'GET', 
//    path: '/users/:id', 
//    handlers: [
//      generalMiddlware, 
//      usersMiddlware, 
//      findUser, 
//    ]
//  },
//  },{
//    method: 'POST', 
//    path: '/users/', 
//    handlers: [
//      generalMiddlware, 
//      usersMiddlware, 
//      robotFilter,
//      createUser, 
//    ]
//  }]
```

## Non nestable features

The following features cannot be (easily) applied to nested tries. The can only be implemented in the root of the trie router. Consult your router manual for more information, or construct yourself a general middleware.

- Default route
- Handle 405 errors
- Handle 501 errors
