var Games = require('../models/games');
var async = require('async');
var pageSize = 10;

exports.index = function (req, res) {
	var page = req.query.page || 1;
	var start = (page - 1) * pageSize;
	var end = page * pageSize;

	Games.getAll(start, end, function (err, games) {
		if (err) {
			return res.sendStatus(err.code);
		}

    games.rows = games.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('games/index.dust', games);
	});
};

exports.new = function (req, res) {
  var queries = [];
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

    res.render('games/new.dust', data);
  });
};

exports.show = function (req, res) {
	var id = req.params.id;
	Games.get(id, function (err, games) {
		if (err) {
			return res.sendStatus(err.code);
		}

    games.rows = games.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('games/show.dust', games);
	});
};

exports.edit = function (req, res) {
	var id = req.params.id;
	Games.get(id, function (err, games) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('games/edit.dust', games);
	});
};

exports.create = function (req, res) {
	// validation
	Games.create(req.body, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

    var id = result.rows[0].id;

    res.redirect('games/' + id);
	});
};

exports.update = function (req, res) {
	// validation
	Games.update(id, values, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('games/index.dust', games);
	});
};

exports.destroy = function (req, res) {
	var id = req.params.id;
	Games.destroy(id, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('games/index.dust', games);
	});
};
