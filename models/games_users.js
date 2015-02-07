var db = require('../db');

exports.get = function (id, cb) {
	var query = 'SELECT games_users.id AS id, games_users.game_id AS game_id , games_users.user_id AS user_id  , games.id AS games_name , users.id AS users_name FROM games_users LEFT JOIN games ON games_users.game_id = games.id LEFT JOIN users ON games_users.user_id = users.id WHERE games_users.id = $1';
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
	var query = 'SELECT games_users.id AS id, games_users.game_id AS game_id , games_users.user_id AS user_id  , games.id AS games_name , users.id AS users_name FROM games_users LEFT JOIN games ON games_users.game_id = games.id LEFT JOIN users ON games_users.user_id = users.id WHERE games_users.id >= $1 AND games_users.id <= $2';
	db.query(query, [start, end], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.create = function (args, cb) {
  var game_id = args.game_id || null;
  var user_id = args.user_id || null;
	var params = [game_id,user_id];
	var query = 'INSERT INTO games_users (game_id,user_id) VALUES ($1, $2) RETURNING id';
	db.query(query, params, function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.update = function (id, args, cb) {
	var params = [id, game_id,user_id];
	var query = 'UPDATE games_users SET (game_id,user_id) = ($2, $3) WHERE id = $1';
	db.query(query, params, function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.destroy = function (id, cb) {
	var query = 'DELETE FROM games_users WHERE id = $1';
	db.query(query, [id], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};
