var db = require('../db');
var bitcore = require('bitcore');

exports.get = function (id, cb) {
	var query = 'SELECT addresses.id AS id, addresses.public AS public , addresses.private AS private , addresses.complete AS complete, addresses.user_id AS user_id , addresses.game_id AS game_id  , users.id AS users_name , games.id AS games_name FROM addresses LEFT JOIN users ON addresses.user_id = users.id LEFT JOIN games ON addresses.game_id = games.id WHERE addresses.id = $1';
	db.query(query, [id], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.getAll = function (start, end, cb) {
  start = 0;
  end = 100;
	var query = 'SELECT addresses.id AS id, addresses.public AS public , addresses.private AS private , addresses.complete AS complete, addresses.user_id AS user_id , addresses.game_id AS game_id  , users.id AS users_name , games.id AS games_name FROM addresses LEFT JOIN users ON addresses.user_id = users.id LEFT JOIN games ON addresses.game_id = games.id WHERE addresses.id >= $1 AND addresses.id <= $2';
	db.query(query, [start, end], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.create = function (args, cb) {
  var public = args.public || null;
  var private = args.private || null;
  var user_id = args.user_id || null;
  var game_id = args.game_id || null;
  var complete = args.complete || false;
	var params = [public,private,user_id,game_id,complete];
	var query = 'INSERT INTO addresses (public,private,user_id,game_id,complete) VALUES ($1, $2, $3, $4, $5) RETURNING id';
	db.query(query, params, function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.update = function (id, args, cb) {
  var public = args.public || null;
  var private = args.private || null;
  var user_id = args.user_id || null;
  var game_id = args.game_id || null;
  var complete = args.complete || false;

	var params = [id, public,private,user_id,game_id,complete];
	var query = 'UPDATE addresses SET (public,private,user_id,game_id,complete) = ($2, $3, $4, $5, $6) WHERE id = $1';
	db.query(query, params, function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.destroy = function (id, cb) {
	var query = 'DELETE FROM addresses WHERE id = $1';
	db.query(query, [id], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.getIncomplete = function (cb) {
  var query = 'SELECT id, public FROM addresses WHERE complete IS false AND addresses.game_id = (SELECT id AS game_id FROM games WHERE games.winner IS NULL ORDER BY id DESC LIMIT 1)';
	db.query(query, [], cb);
};

exports.getIncompleteByUser = function (id, cb) {
  var query = 'SELECT game_id, public FROM addresses WHERE complete IS false AND user_id = $1';
	db.query(query, [id], function (err, results) {
    if (err) return cb(err);

    var transactions = [];

    if (results.rows.length !== 0) {
      transactions = results.rows.map(function (r) {
        r.address = bitcore.PublicKey.fromString(r.public).toAddress().toString();
        return r;
      });
    }

    cb(null, transactions);
  });
};

exports.markComplete = function (id, cb) {
	var params = [id];
	var query = 'UPDATE addresses SET complete = true WHERE id = $1';
	db.query(query, params, cb);
};
