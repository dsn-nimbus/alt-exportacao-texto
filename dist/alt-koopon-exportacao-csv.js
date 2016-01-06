;(function(ng) {
  "use strict";

  ng.module('alt.koopon.exportacao-csv', [])
  .directive('altKooponExportacaoCsv', [function() {
    var _restrict = 'A';

    var _link = function(scope, element, attrs) {
      scope.tipoArquivo = scope.tipoArquivo || 'csv';

      function _preparaMatriz(info) {
        var _matriz = [];
        var _titulos = scope.titulos;
        var _arquivoContabil = !!scope.arquivoContabil;
        var _propriedades = info.propriedades;
        var _listagem = info.info;
        var _listagemFinal = [];

        if (scope.titulos) {
          _matriz.push(_titulos);
        }

        angular.forEach(_listagem, function(informacao) {
          var _valores = [];

          angular.forEach(_propriedades, function(prop) {
              if (ng.isDefined(informacao[prop])) {
                  var _valor = informacao[prop];

                  if (_valor === "") {
                    _valor = "\"\"";
                  }
                  else {
                    if (_arquivoContabil) {
                      _valor = "\"" + _valor + "\"";

                      _valor = /\d+\.\d{2}/.test(_valor) ? "\"" + /\d+\.\d{2}/.exec(_valor).join().replace(".", ",") + "\""
                                                         : _valor;
                    }
                  }

                  _valores.push(_valor);
              }
          });

          _matriz.push(_valores);
        });

        angular.forEach(_matriz, function(linha, indice) {
          _listagemFinal.push(linha.join(','));
        });

        return _listagemFinal.join("%0A");
      }

      function _exporta(info, nomeArquivo) {
        var _a = document.createElement('a');

        _a.href = 'data:attachment/' + scope.tipoArquivo + ',' + info;
        _a.target = '_blank';
        _a.download = nomeArquivo;

        document.body.appendChild(_a);

        _a.click();

        document.body.removeChild(_a);
      }

      element.on('click', function() {
        var _info = _preparaMatriz(scope.preparaInfo());
        _exporta(_info, scope.nomeArquivo);
      });
    };

    var _scope = {
      nomeArquivo: '@',
      tipoArquivo: '@',
      arquivoContabil: '@',
      preparaInfo: '&'
    };

    return {
      restrict: _restrict,
      link: _link,
      scope: _scope
    };

  }]);
}(angular));
