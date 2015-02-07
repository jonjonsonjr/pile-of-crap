var db = require('../db');

exports.get = function (id, cb) {
	var query = 'SELECT addresses.id AS id, addresses.public AS public , addresses.private AS private , addresses.user_id AS user_id , addresses.game_id AS game_id  , users.id AS users_name , games.id AS games_name FROM addresses LEFT JOIN users ON addresses.user_id = users.id LEFT JOIN games ON addresses.game_id = games.id WHERE addresses.id = $1';
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
	var query = 'SELECT addresses.id AS id, addresses.public AS public , addresses.private AS private , addresses.user_id AS user_id , addresses.game_id AS game_id  , users.id AS users_name , games.id AS games_name FROM addresses LEFT JOIN users ON addresses.user_id = users.id LEFT JOIN games ON addresses.game_id = games.id WHERE addresses.id >= $1 AND addresses.id <= $2';
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
	var params = [public,private,user_id,game_id];
	var query = 'INSERT INTO addresses (public,private,user_id,game_id) VALUES ($1, $2, $3, $4) RETURNING id';
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
	var params = [id, public,private,user_id,game_id];
	var query = 'UPDATE addresses SET (public,private,user_id,game_id) = ($2, $3, $4, $5) WHERE id = $1';
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
