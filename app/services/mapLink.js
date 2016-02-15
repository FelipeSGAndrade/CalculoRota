var rp = require('request-promise');

module.exports = function(app){
  var helper = {};
  var autenticacao = app.helpers.autenticacao;

  var geocodeUrl = app.get('geocodeUrl');
  var routeUrl = app.get('routeUrl');
  var token = app.get('token');
  var appCode = app.get('appCode');

  helper.geocodificar = function(endereco){
    var enderecoSemAcento = removerAcentos(endereco);
    var url = geocodeUrl + enderecoSemAcento + "&type=address&applicationCode=" + appCode;
    var assinatura = autenticacao.assinatura(url, token);
    var urlAssinada = url + "&signature=" + assinatura;

    return rp(urlAssinada)
          .then(function(data){
            var dataJson = JSON.parse(data);
            return dataJson.results[0].location;
          });
  };

  helper.calcularRota = function(enderecos){
    var waypoints = [];

    for(var i = 0; i < enderecos.length; i++){
      var waypoint = "waypoint." + i + ".latlng=" + enderecos[i].lat + "," + enderecos[i].lng;
      waypoints.push(waypoint);
    }

    var url = routeUrl + waypoints.join('&') + "&result=summary.duration,summary.distance,summary.tolls&applicationCode=" + appCode;

    var assinatura = autenticacao.assinatura(url, token);
    var urlAssinada = url + "&signature=" + assinatura;

    return rp(urlAssinada)
          .then(function(data){
            var dataJson = JSON.parse(data);
            console.log(dataJson.routes[0].summary);
            return dataJson.routes[0].summary;
          });
  };

  function removerAcentos(strToReplace) {
    str_acento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
    str_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";

    var nova = "";
    for (var i = 0; i < strToReplace.length; i++) {
        if (str_acento.indexOf(strToReplace.charAt(i)) != -1) {
            nova += str_sem_acento.substr(str_acento.search(strToReplace.substr(i, 1)), 1);
        } else {
            nova += strToReplace.substr(i, 1);
        }
    }

    return nova;
  }

  return helper;
};
