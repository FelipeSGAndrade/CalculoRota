var urlParser = require('url');
var crypto = require('crypto');

module.exports = function(app){
    var helper = {};

    helper.assinatura = function(url, token){
      var path = urlParser.parse(url).path;

      var tokenValido = token.replace("-","+").replace("_","/");

      var tokenBuffer = new Buffer(tokenValido, 'base64');
      var pathBuffer = new Buffer(path, 'utf8');

      var hash = crypto.createHmac('sha1', tokenBuffer).update(pathBuffer).digest('base64');

      var assinatura = hash.replace(/\+/g,"-").replace(/\//g,"_");

      return assinatura;
    };

    return helper;
};
