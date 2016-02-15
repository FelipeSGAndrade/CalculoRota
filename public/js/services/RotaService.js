angular.module('rotas').factory('Rota',
  function($http){
    var api = {};

    api.calcularRota = function(enderecos, precoLitro, autonomia){
      var url = "/rota?enderecos=" + enderecos.join('|');

      if(precoLitro)
        url += "&preco=" + precoLitro;

      if(autonomia)
        url += "&autonomia=" + autonomia;

      return $http.get(url)
              .then(function(resultado){
                return resultado.data;
              });
    };

    return api;
});
