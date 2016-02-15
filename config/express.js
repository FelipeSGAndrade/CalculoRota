var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');

module.exports = function(){
  var app = express();

  app.set('port', process.env.PORT || 3000);
  app.set('appCode', 'desafiodev');
  app.set('token', 'z0vmywzpbCSLdJYl5mUk5m2jNGytNGt6NJu6NGU=');
  app.set('geocodeUrl', 'http://api.maplink.com.br/v0/search?q=');
  app.set('routeUrl', 'http://api.maplink.com.br/v0/route?');

  app.use(express.static('./public'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  load('models', {cwd: 'app'})
    .then('helpers')
    .then('services')
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
};
