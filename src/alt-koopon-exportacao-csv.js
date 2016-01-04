;(function(ng) {
  "use strict";

  ng.module('alt.koopon.exportacao-csv', [])
  .directive('altKooponExportacaoCsv', [function() {
    var _restrict = 'A';

    var _link = function(scope, element, attrs) {
      element.on('click', function() {
        var _info = scope.preparaInfo();

        var _csv = [_info.titulos];
        var _propriedades = _info.propriedades;
        var _listagem = _info.info;
        var _listagemFinal = [];

        angular.forEach(_propriedades, function(prop) {
          var _valores = [];

          angular.forEach(_listagem, function(informacao) {
            if (informacao[prop]) {
              _valores = _valores.concat(informacao[prop]);
            }
          });

          _csv.push(_valores);
        });

        angular.forEach(_csv, function(linha, indice) {
          _listagemFinal.push(linha.join(','));
        });

        var _csvString = _listagemFinal.join("%0A");

        var _a = document.createElement('a');

        _a.href = 'data:attachment/csv,' + _csvString;
        _a.target = '_blank';
        _a.download = scope.nomeArquivo;

        document.body.appendChild(_a);

        _a.click();

        document.body.removeChild(_a);
      });
    };

    var _scope = {
      nomeArquivo: '@',
      preparaInfo: '&'
    };

    return {
      restrict: _restrict,
      link: _link,
      scope: _scope
    };

  }]);
}(angular));
