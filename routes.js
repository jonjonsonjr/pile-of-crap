module.exports = function (express) {
  var router = express.Router();
  router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
  });
  var addresses = require('./controllers/addresses');
  var games = require('./controllers/games');
  var games_users = require('./controllers/games_users');
  var users = require('./controllers/users');

  router.get('/addresses', addresses.index);
  router.get('/addresses/new', addresses.new);
  router.get('/addresses/:id', addresses.show);
  router.get('/addresses/:id/edit', addresses.edit);
  router.post('/addresses', addresses.create);
  router.put('/addresses/:id', addresses.update);
  router.delete('/addresses/:id', addresses.destroy);

  router.get('/games', games.index);
  router.get('/games/new', games.new);
  router.get('/games/:id', games.show);
  router.get('/games/:id/edit', games.edit);
  router.post('/games', games.create);
  router.put('/games/:id', games.update);
  router.delete('/games/:id', games.destroy);

  router.get('/games_users', games_users.index);
  router.get('/games_users/new', games_users.new);
  router.get('/games_users/:id', games_users.show);
  router.get('/games_users/:id/edit', games_users.edit);
  router.post('/games_users', games_users.create);
  router.put('/games_users/:id', games_users.update);
  router.delete('/games_users/:id', games_users.destroy);

  router.get('/users', users.index);
  router.get('/users/new', users.new);
  router.get('/users/:id', users.show);
  router.get('/users/:id/edit', users.edit);
  router.post('/users', users.create);
  router.put('/users/:id', users.update);
  router.delete('/users/:id', users.destroy);

  return router;
};
