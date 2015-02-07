var pg = require('pg');
var cs = process.env.HEROKU_POSTGRESQL_SILVER_URL || 'postgres://jonjohnson:@localhost/test';

module.exports = {
   query: function(text, values, cb) {
      pg.connect(cs, function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });
   }
}
