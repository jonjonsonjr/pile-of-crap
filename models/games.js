var db = require('../db');

exports.get = function (id, cb) {
	var query = 'SELECT games.id AS id, games.winning_address AS winning_address , games.winner AS winner  , users.username AS users_name FROM games LEFT JOIN users ON games.winner = users.id WHERE games.id = $1';
	db.query(query, [id], cb);
};

exports.getAll = function (start, end, cb) {
  start = 0;
  end = 100;
	var query = 'SELECT games.id AS id, games.winning_address AS winning_address , games.winner AS winner  , users.username AS users_name FROM games LEFT JOIN users ON games.winner = users.id WHERE games.id >= $1 AND games.id <= $2 ORDER BY games.id ASC';
	db.query(query, [start, end], cb);
};

exports.create = function (args, cb) {
  var winning_address = args.winning_address || null;
  var winner = args.winner || null;
	var params = [winning_address,winner];
	var query = 'INSERT INTO games (winning_address,winner) VALUES ($1, $2) RETURNING id';
	db.query(query, params, cb);
};

exports.update = function (id, args, cb) {
  var winning_address = args.winning_address || null;
  var winner = args.winner || null;
	var params = [id, winning_address,winner];
	var query = 'UPDATE games SET (winning_address,winner) = ($2, $3) WHERE id = $1';
	db.query(query, params, cb);
};

exports.destroy = function (id, cb) {
	var query = 'DELETE FROM games WHERE id = $1';
	db.query(query, [id], cb);
};

exports.getLatestGameId = function (cb) {
	var query = 'SELECT games.id AS id, games.winning_address AS winning_address , games.winner AS winner  , users.id AS users_name FROM games LEFT JOIN users ON games.winner = users.id WHERE games.winning_address IS NULL ORDER BY id DESC LIMIT 1';
	db.query(query, [], function (err, result) {
		if (err) {
			return cb(err);
		}

    if (result.rows.length === 0) {
      exports.create({}, function (err, result) {
        if (err) return cb(err);
        cb(null, result.rows[0].id);
      });
    } else {
      cb(null, result.rows[0].id);
    }
	});
};

exports.getCurrentPlayers = function (cb) {
  var query = 'SELECT username FROM users JOIN games_users ON games_users.user_id = users.id WHERE games_users.game_id = (SELECT id AS game_id FROM games WHERE games.winner IS NULL ORDER BY id DESC LIMIT 1)';
	db.query(query, [], cb);
};

exports.getParticipants = function (id, cb) {
  var query = 'SELECT username, complete FROM users JOIN addresses ON users.id = addresses.user_id WHERE addresses.game_id = $1';
  db.query(query, [id], cb);
};

exports.getAddresses = function (id, cb) {
  var query = 'SELECT public, private FROM addresses WHERE complete IS true AND game_id = $1';
	db.query(query, [id], cb);
};
