module.exports = function(app){
  var controller = app.controllers.rota;

  app.get('/rota', controller.calcularRota);
};
