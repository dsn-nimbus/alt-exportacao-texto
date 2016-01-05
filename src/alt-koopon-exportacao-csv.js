;(function(ng) {
  "use strict";

  ng.module('alt.koopon.exportacao-csv', [])
  .directive('altKooponExportacaoCsv', [function() {
    var _restrict = 'A';

    var _link = function(scope, element, attrs) {
      function _preparaCsv(info) {
        var _csv = [info.titulos];
        var _propriedades = info.propriedades;
        var _listagem = info.info;
        var _listagemFinal = [];

        angular.forEach(_listagem, function(informacao) {
          var _valores = [];

          angular.forEach(_propriedades, function(prop) {

            if (informacao[prop]) {
              _valores = _valores.concat(informacao[prop]);
            }
          });

          _csv.push(_valores);
        });

        angular.forEach(_csv, function(linha, indice) {
          _listagemFinal.push(linha.join(','));
        });

        return _listagemFinal.join("%0A");
      }

      function _exporta(csv, nomeArquivo) {
        var _a = document.createElement('a');

        _a.href = 'data:attachment/csv,' + csv;
        _a.target = '_blank';
        _a.download = nomeArquivo;

        document.body.appendChild(_a);

        _a.click();

        document.body.removeChild(_a);
      }

      element.on('click', function() {
        var _csv = _preparaCsv(scope.preparaInfo());
        _exporta(_csv, scope.nomeArquivo);
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
