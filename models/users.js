var db = require('../db');

exports.get = function (id, cb) {
	var query = 'SELECT users.id AS id, users.username AS username , users.address AS address , users.capital_one AS capital_one   FROM users  WHERE users.id = $1';
	db.query(query, [id], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.getByUsername = function (username, cb) {
	var query = 'SELECT users.id AS id, users.username AS username , users.address AS address , users.capital_one AS capital_one   FROM users  WHERE users.username = $1';
	db.query(query, [username], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.getAll = function (start, end, cb) {
  start = 0;
  end = 100;
	var query = 'SELECT users.id AS id, users.username AS username , users.address AS address , users.capital_one AS capital_one   FROM users  WHERE users.id >= $1 AND users.id <= $2';
	db.query(query, [start, end], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.create = function (args, cb) {
  var username = args.username || null;
  var address = args.address || null;
  var capital_one = args.capital_one || null;
	var params = [username,address,capital_one];
	var query = 'INSERT INTO users (username,address,capital_one) VALUES ($1, $2, $3) RETURNING id';
	db.query(query, params, function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.update = function (id, args, cb) {
  var username = args.username || null;
  var address = args.address || null;
  var capital_one = args.capital_one || null;
	var params = [id, username,address,capital_one];
	var query = 'UPDATE users SET (username,address,capital_one) = ($2, $3, $4) WHERE id = $1';
	db.query(query, params, function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};

exports.destroy = function (id, cb) {
	var query = 'DELETE FROM users WHERE id = $1';
	db.query(query, [id], function (err, result) {
		if (err) {
			return cb(err);
		}

		cb(null, result);
	});
};
