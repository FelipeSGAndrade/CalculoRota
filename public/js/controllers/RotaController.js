angular.module('rotas').controller('RotaController',
  function($scope, $routeParams, $uibModal, Rota){
    var modal = null;

    $scope.processando = true;
    $scope.enderecos = [];
    $scope.endereco = novoEndereco();

    $scope.precoLitro = 3.5;
    $scope.autonomia = 11;

    $scope.valoresTotais = {
      tempo: -1,
      distancia: -1,
      custoCombustivel: -1,
      custoTotal: -1
    };

    $scope.addEndereco = function(){
      $scope.enderecos.push($scope.endereco);
      $scope.endereco = novoEndereco();
    };

    $scope.calcularRota = function(){
      $scope.aviso = null;
      $scope.erro = null;

      if($scope.enderecos.length < 2){
          $scope.aviso = {texto: "Adicione pelo menos 2 endereços para calcular."};
          return;
      }

      openModal();

      var enderecosUrl = [];

      for(var i in $scope.enderecos){
        var endereco = $scope.enderecos[i];
        var enderecoString = endereco.logradouro +
                        ' ' + endereco.numero +
                        ', ' + endereco.cidade +
                        ' - ' + endereco.estado;

        enderecosUrl.push(enderecoString);
      }

      Rota.calcularRota(enderecosUrl, $scope.precoLitro, $scope.autonomia)
        .then(function(valores){
          var valoresTotais = $scope.valoresTotais = valores;
          valoresTotais.tempo = valoresTotais.tempo/60;

          var horas = valoresTotais.tempo/60;
          if(horas >= 1){
            valoresTotais.tempo =  horas;
            valoresTotais.medidaTempo = 'horas';
          }
          else {
            valoresTotais.medidaTempo = 'minutos';
          }

          var km = valoresTotais.distancia/1000;
          if(km >= 1){
            valoresTotais.distancia = km;
            valoresTotais.medidaDistancia = 'km';
          }
          else{
            valoresTotais.medidaDistancia = 'm';
          }

          valoresTotais.tempo = Number(valoresTotais.tempo).toFixed(2);
          valoresTotais.distancia = Number(valoresTotais.distancia).toFixed(2);
          valoresTotais.custoCombustivel = Number(valoresTotais.custoCombustivel).toFixed(2);
          valoresTotais.custoTotal = Number(valoresTotais.custoTotal).toFixed(2);

          closeModal();
        })
        .catch(function(erro){
          $scope.erro = {texto: "Não foi possível calcular a rota."};
          closeModal();
        });
    };

    function novoEndereco(){
      return {
        logradouro: '',
        numero: 0,
        cidade: '',
        estado: ''
      };
    }

    function openModal(){
      modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        backdrop: 'static',
        keyboard: false
      });
    }

    function closeModal(){
      modalInstance.close();
    }
  });
