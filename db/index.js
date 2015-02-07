var pg = require('pg');
var cs = 'postgres://jonjohnson:@localhost/test';

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
