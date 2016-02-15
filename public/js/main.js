angular.module('rotas', ['ngRoute', 'ngResource', 'ui.bootstrap'])
  .config(function($routeProvider){
    $routeProvider.when('/rota', {
      templateUrl: 'partials/rota.html',
      controller: 'RotaController'
    });

    $routeProvider.otherwise({redirectTo: '/rota'});
  });
