var Users = require('../models/users');
var async = require('async');
var pageSize = 10;

exports.index = function (req, res) {
	var page = req.query.page || 1;
	var start = (page - 1) * pageSize;
	var end = page * pageSize;

	Users.getAll(start, end, function (err, users) {
		if (err) {
			return res.sendStatus(err.code);
		}

    users.rows = users.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('users/index.dust', users);
	});
};

exports.new = function (req, res) {
  var queries = [];

  async.parallel(queries, function (err, result) {
    var data = {};

    result.forEach(function (r) {
      data[r.table] = r.rows;
    });

    res.render('users/new.dust', data);
  });
};

exports.show = function (req, res) {
	var id = req.params.id;
	Users.getByUsername(id, function (err, users) {
		if (err) {
			return res.sendStatus(err.code);
		}

    users.rows = users.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('users/show.dust', users);
	});
};

exports.edit = function (req, res) {
	var id = req.params.id;
	Users.get(id, function (err, users) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('users/edit.dust', users);
	});
};

exports.create = function (req, res) {
	// validation
	Users.create(req.body, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

    var id = result.rows[0].id;

    res.redirect('users/' + req.body.username);
	});
};

exports.update = function (req, res) {
	// validation
	Users.update(id, values, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('users/index.dust', users);
	});
};

exports.destroy = function (req, res) {
	var id = req.params.id;
	Users.destroy(id, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('users/index.dust', users);
	});
};
