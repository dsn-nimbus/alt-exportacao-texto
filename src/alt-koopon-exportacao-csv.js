;(function(ng) {
  "use strict";

  ng.module('alt.koopon.exportacao-csv', [])
  .factory('AltKooponExportacaoParser', [function() {
    var AltKooponExportacaoParser = function(arquivoContabil) {

    };

    AltKooponExportacaoParser.prototype.parseCsvNormal = function() {

    };

    AltKooponExportacaoParser.prototype.parseArquivoContabilPack = function() {

    };

    return AltKooponExportacaoParser;
  }])
  .factory('AltKooponExportacaoExec', [function() {
    var AltKooponExportacaoExec = function(doc) {

    };

    AltKooponExportacaoExec.prototype.exporta = function(info, nomeArquivo, tipoArquivo) {

    };

    return AltKooponExportacaoExec;
  }])
  .directive('altKooponExportacaoCsv', [function() {
    var _restrict = 'A';

    var _link = function(scope, element, attrs) {
      var _tipoArquivo = scope.tipoArquivo || 'csv';
      var _nomeArquivo = scope.nomeArquivo || 'Exportação';

      element.on('click', function() {
        var _info = _preparaMatriz(scope.preparaInfo());
        _exporta(_info, _nomeArquivo, _tipoArquivo);
      });

      function _preparaMatriz(info) {
        var _matriz = [];
        var _titulos = scope.titulos;
        var _arquivoContabil = !!scope.arquivoContabil;
        var _propriedades = info.propriedades;
        var _listagem = info.info;
        var _listagemFinal = [];
        var VALOR_MONETARIO_PATTERN = /\d+\.\d{2}/;
        var FIM_DE_LINHA_CODIFICADO = '%0A';
        var ESPACO_STRING_CODIFICADO = '%20';

        if (scope.titulos) {
          _matriz.push(_titulos);
        }

        ng.forEach(_listagem, function(informacao) {
          var _valores = [];

          ng.forEach(_propriedades, function(prop) {
              if (ng.isDefined(informacao[prop])) {
                  var _valor = informacao[prop];

                  if (_valor === "") {
                    _valor = "\"\"";
                  }
                  else {
                    if (_arquivoContabil) {
                      _valor = "\"" + _valor + "\"";

                      _valor = VALOR_MONETARIO_PATTERN.test(_valor) ? "\"" + VALOR_MONETARIO_PATTERN.exec(_valor).join().replace(".", ",") + "\""
                                                                    : _valor;
                    }
                  }

                  _valores.push(_valor);
              }
          });

          _matriz.push(_valores);
        });

        ng.forEach(_matriz, function(linha, indice) {
          _listagemFinal.push(linha.join(','));
        });

        return _listagemFinal.join(FIM_DE_LINHA_CODIFICADO).replace(/ /g, ESPACO_STRING_CODIFICADO);
      }

      function _exporta(info, nomeArquivo, tipoArquivo) {
        var _a = document.createElement('a');

        _a.href = 'data:attachment/' + tipoArquivo + ',' + info;
        _a.target = '_blank';
        _a.download = nomeArquivo;

        document.body.appendChild(_a);

        _a.click();

        document.body.removeChild(_a);
      }
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
}(window.angular));
