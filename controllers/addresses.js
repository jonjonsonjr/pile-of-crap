var Addresses = require('../models/addresses');
var async = require('async');
var pageSize = 10;

exports.index = function (req, res) {
	var page = req.query.page || 1;
	var start = (page - 1) * pageSize;
	var end = page * pageSize;

	Addresses.getAll(start, end, function (err, addresses) {
		if (err) {
			return res.sendStatus(err.code);
		}

    addresses.rows = addresses.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('addresses/index.dust', addresses);
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

  async.parallel(queries, function (err, result) {
    var data = {};

    result.forEach(function (r) {
      data[r.table] = r.rows;
    });

    res.render('addresses/new.dust', data);
  });
};

exports.show = function (req, res) {
	var id = req.params.id;
	Addresses.get(id, function (err, addresses) {
		if (err) {
			return res.sendStatus(err.code);
		}

    addresses.rows = addresses.rows.map(function (r) {
      Object.keys(r).forEach(function (key) {
        if (typeof r[key] === 'boolean') {
          r[key] = (r[key] === true) ? 'yes' : 'no';
        }
      });

      return r;
    });

		res.render('addresses/show.dust', addresses);
	});
};

exports.edit = function (req, res) {
	var id = req.params.id;
	Addresses.get(id, function (err, addresses) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('addresses/edit.dust', addresses);
	});
};

exports.create = function (req, res) {
	// validation
	Addresses.create(req.body, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

    var id = result.rows[0].id;

    res.redirect('addresses/' + id);
	});
};

exports.update = function (req, res) {
	// validation
	Addresses.update(id, values, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('addresses/index.dust', addresses);
	});
};

exports.destroy = function (req, res) {
	var id = req.params.id;
	Addresses.destroy(id, function (err, result) {
		if (err) {
			return res.sendStatus(err.code);
		}

		res.render('addresses/index.dust', addresses);
	});
};
