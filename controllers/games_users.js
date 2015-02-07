var Games_users = require('../models/games_users');
var async = require('async');
var pageSize = 10;

exports.index = function (req, res) {
	var page = req.query.page || 1;
	var start = (page - 1) * pageSize;
	var end = page * pageSize;

	Games_users.getAll(start, end, function (err, games_users) {
		if (err) {
			return res.sendStatus(err.code);
		}

    games_users.rows = games_users.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('games_users/index.dust', games_users);
	});
};

exports.new = function (req, res) {
  var queries = [];
  queries.push(function (cb) {
    require('../models/games').getAll(0, 10, function (err, result) {
      if (err) {
        return console.log(err);
      }

      var data = {
        table: 'games',
        rows: result.rows
      };
      cb(null, data);
    });
  });
  queries.push(function (cb) {
    require('../models/users').getAll(0, 10, function (err, result) {
      if (err) {
        return console.log(err);
      }

      var data = {
        table: 'users',
        rows: result.rows
      };
      cb(null, data);
    });
  });

  async.parallel(queries, function (err, result) {
    var data = {};

    result.forEach(function (r) {
      data[r.table] = r.rows;
    });

    res.render('games_users/new.dust', data);
  });
};

exports.show = function (req, res) {
	var id = req.params.id;
	Games_users.get(id, function (err, games_users) {
		if (err) {
			return res.sendStatus(err.code);
		}

    games_users.rows = games_users.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('games_users/show.dust', games_users);
	});
};

exports.edit = function (req, res) {
	var id = req.params.id;
	Games_users.get(id, function (err, games_users) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('games_users/edit.dust', games_users);
	});
};

exports.create = function (req, res) {
	// validation
	Games_users.create(req.body, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

    var id = result.rows[0].id;

    res.redirect('games_users/' + id);
	});
};

exports.update = function (req, res) {
	// validation
	Games_users.update(id, values, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('games_users/index.dust', games_users);
	});
};

exports.destroy = function (req, res) {
	var id = req.params.id;
	Games_users.destroy(id, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('games_users/index.dust', games_users);
	});
};
