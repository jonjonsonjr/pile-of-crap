var bitcore = require('bitcore');
var PublicKey = bitcore.PublicKey;
var Chain = require('chain-node');
var chain = new Chain({
  keyId: process.env.CHAIN_KEY_ID,
  keySecret: process.env.CHAIN_KEY_SECRET,
  blockChain: 'bitcoin'
});
var MINER_FEE = 20000;

exports.payOut = function (sources, output, cb) {
  var publics = sources.map(function (r) {
    return PublicKey.fromString(r.public).toAddress().toString();
  });

  var inputs = sources.map(function (r) {
    return {
      address: PublicKey.fromString(r.public).toAddress().toString(),
      private_key: r.private
    };
  });

  chain.getAddressesUnspents(publics, function(err, resp) {
    if (err) return cb(err);

    var total = resp.reduce(function (prev, curr) {
      return prev + curr.value;
    }, 0);

    var data = {
      inputs: inputs,
      outputs: [{
        address: output,
        amount: total - MINER_FEE
      }]
    };

    console.log(JSON.stringify(data));

    chain.transact(data, function(err, resp) {
      if (err) return cb(err);
      console.log(resp);
      cb(null);
    });
  });
};
