var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var router = require('./routes.js')(express);
var app = express();

var Users = require('./models/users');
var Games = require('./models/games');
var Addresses = require('./models/addresses');

var COST_BTC = "0.0001";

app.engine('dust', cons.dust);
app.set('views', __dirname + '/views');
app.set('view engine', 'dustjs-linkedin');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', function (req, res) {
  res.render('users/new.dust');
});

router.post('/register', function (req, res) {
  var user_id = parseInt(req.body.id);

  Games.getLatestGameId(function (err, game_id) {
    generateKeyPair(user_id, game_id, function (err, address) {
      if (err) return console.log(err);

      console.log(address);
      res.render('register.dust', {
        address: address,
        cost: COST_BTC
      });
    });
  });
});

router.get('/api/players', function (req, res) {
  Games.getLatestGameId(function (err, game_id) {
    Games.getCurrentPlayers(function (err, results) {
      var players = results.rows.map(function (row) {
        return row.username;
      });
      var data = {
        game_id: game_id,
        players: players
      };

      res.json(data);
    });
  });
});

router.post('/api/games/:id/winner', function (req, res) {
  var game_id = parseInt(req.params.id);
  var username = req.body.winner;

  Users.getByUsername(username, function(err, result) {
    if (err) return res.status(500).json({err: err});
    var user = result.rows[0];
    var user_id = user.id;
    var address = user.address;

    Games.update(game_id, {
      winning_address: address,
      winner: user_id
    }, function (err, result) {
      if (err) return res.json({err: err});
      res.sendStatus(200);
    });
  });
});

router.get('/api/pending', function (req, res) {
  Addresses.getIncomplete(function (err, result) {
    if (err) return res.status(500).send(err);
    res.json(result.rows);
  });
});

router.post('/api/addresses/:id/complete', function (req, res) {
  var id = parseInt(req.params.id);
  Addresses.markComplete(id, function (err, result) {
    if (err) return res.send(err);
    res.sendStatus(200);
  });
});

app.use(router);

app.listen(3000);

function generateKeyPair(user_id, game_id, cb) {
  var public_key = '1234567';
  var private_key = 'abcdefg';

  Addresses.create({
    user_id: user_id,
    game_id: game_id,
    public: public_key,
    private: private_key
  },
  function (err, result) {
    if (err) return cb(err);

    console.log(result.rows);
    cb(null, public_key);
  });
}
