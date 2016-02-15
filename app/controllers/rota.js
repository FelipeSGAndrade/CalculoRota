module.exports = function(app){
  var controller = {};
  var api = app.services.mapLink;

  controller.calcularRota = function(req, res){
    var enderecos = req.query.enderecos.split('|');
    var precoLitro = req.query.preco || 3.5;
    var autonomia = req.query.autonomia || 12;

    geocodeList(enderecos, 0, null)
    .then(route)
    .then(function(valores){
      var distanciaKm = valores.distance / 1000;
      var custoCombustivel = distanciaKm / autonomia * precoLitro;

      var custoPedagio = 0;
      for(var i = 0; i < valores.tollFees.length; i++){
          custoPedagio += valores.tollFees[i].prices.car;
      }
      console.log(valores.tollFees);
      var valoresTotais = {
        tempo: valores.duration,
        distancia: valores.distance,
        custoCombustivel: custoCombustivel,
        custoTotal: custoCombustivel + custoPedagio
      };

      res.json(valoresTotais);
    })
    .catch(function(erro){
      if(erro.error){
        var message = JSON.parse(erro.error);
        res.json(message);
      }

      res.json(erro);
    });
  };

  function geocodeList(enderecos){
    return geocodeFor(enderecos, 0, []);
  }

  function geocodeFor(enderecos, count, lista){
    if(count >= enderecos.length) return lista;

    return api.geocodificar(enderecos[count])
          .then(function(localizacao){
            lista.push(localizacao);
            return geocodeFor(enderecos, count+1, lista);
          });
  }

  function route(enderecos){
    return api.calcularRota(enderecos)
            .then(function(rota){
              return rota;
            });
  }

  return controller;
};
