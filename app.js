var bitcore = require('bitcore');
var btc = require('./btc');
var qrcode = require('express-qrcode');
var express = require('express');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var router = require('./routes.js')(express);
var app = express();

var Users = require('./models/users');
var Games = require('./models/games');
var Addresses = require('./models/addresses');

var COST_BTC = "0.001";

app.engine('dust', cons.dust);
app.set('views', __dirname + '/views');
app.set('view engine', 'dustjs-linkedin');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(qrcode);

router.get('/', function (req, res) {
  res.render('users/new.dust');
});

router.post('/register', function (req, res) {
  var user_id = parseInt(req.body.id);

  Games.getLatestGameId(function (err, game_id) {
    Addresses.checkRegistration(user_id, game_id, function (err, transactions) {

      var complete = transactions.filter(function (r) { return r.complete === true; });
      var incomplete = transactions.filter(function (r) { return r.complete !== true; });

      if (complete.length !== 0) {
        return res.redirect('/games/' + game_id);
      }

      var qrcode = req.qrcode();
      qrcode.setDimension(200,200);
      qrcode.setCharset('UTF-8');
      qrcode.setCorrectionLevel('L', 0);

      if (incomplete.length !== 0) {
        var address = incomplete[0].address;
        qrcode.setData(address);
        var image = qrcode.getImage();

        return res.render('register.dust', {
          address: address,
          cost: COST_BTC,
          img: image
        });
      }

      generateKeyPair(user_id, game_id, function (err, address) {
        if (err) return console.log(err);

        qrcode.setData(address);
        var image = qrcode.getImage();

        return res.render('register.dust', {
          address: address,
          cost: COST_BTC,
          img: image
        });
      });
    });
  });
});

router.post('/api/diamond', function (req, res) {
  console.log(req.body);
  res.sendStatus(200);
});

router.get('/api/players/:username', function (req, res) {
  var username = req.params.username;

  Games.getLatestGameId(function (err, game_id) {
    Games.getParticipants(game_id, function (err, results) {
      if (err) return res.status(500).json({err: err});
      var players = results.rows || [];

      var player = players.filter(function (p) {
        return p.username === username;
      })[0];

      if (!player) {
        return res.sendStatus(404);
      }

      if (player.complete !== true) {
        return res.sendStatus(402);
      }

      res.sendStatus(200);
    });
  });
});

router.post('/api/winner/', function (req, res) {
  console.log(req.body);

  var username = req.body.winner;
  var diamond = req.body.diamond;

  Games.getLatestGameId(function (err, game_id) {
    Users.getByUsername(username, function(err, result) {
      if (err) return res.status(500).json({err: err});
      var user = result.rows[0];
      var user_id = user.id;
      var address = user.address;

      Games.update(game_id, {
        winning_address: address,
        winner: user_id
      }, function (err, result) {
        if (err) return res.status(500).json({err: err});

        // get all the completed addresses so we can calculate the payout
        Games.getAddresses(game_id, function (err, result) {
          if (err) return res.status(500).json({err: err});

          var sources = result.rows;
          var destination = address;

          btc.payOut(sources, destination, function (err) {
            if (err) return res.status(500).json({err: err});
            res.sendStatus(200);
          });
        });
      });
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

app.listen(process.env.PORT || 3000);

function generateKeyPair(user_id, game_id, cb) {
  var private_key = bitcore.PrivateKey();
  var public_key = private_key.toPublicKey();

  var private_key_str = private_key.toWIF();
  var public_key_str = public_key.toString();

  var address = public_key.toAddress().toString();

  Addresses.create({
    user_id: user_id,
    game_id: game_id,
    public: public_key_str,
    private: private_key_str
  },
  function (err, result) {
    if (err) return cb(err);

    console.log(address);
    cb(null, address);
  });
}

function sendBTC(source_addresses, destination_address, cb) {
  console.log('send btc to ' + destination_address + ' from ' + JSON.stringify(source_addresses));
  cb();
}
