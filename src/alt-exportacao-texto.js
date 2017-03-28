;(function(ng) {
  "use strict";

  ng.module('alt.exportacao-texto', [])
  .factory('AltExportacaoTextoModel', [function() {
    var AltExportacaoTextoModel = function(titulos, propriedades, info, arquivoContabil, separador) {
      this.titulos = titulos || undefined;
      this.separador = separador || ';';
      this.propriedades = propriedades || [];
      this.info = info || [];
      this.arquivoContabil = arquivoContabil || false;
    };

    return AltExportacaoTextoModel;
  }])
  .factory('AltExportacaoTextoParser', ['AltExportacaoTextoModel', function(AltExportacaoTextoModel) {
    var AltExportacaoTextoParser = function(expModelo) {
      if (!(expModelo instanceof AltExportacaoTextoModel)) {
        return this.expModelo = new AltExportacaoTextoModel();
      }

      this.expModelo = expModelo;
    };

    AltExportacaoTextoParser.prototype.parseArquivo = function() {
      var _matriz = [];
      var _titulos = this.expModelo.titulos;
      var _propriedades = this.expModelo.propriedades;
      var _listagem = this.expModelo.info;
      var _separador = this.expModelo.separador;
      var _arquivoContabil = !!this.expModelo.arquivoContabil;
      var _listagemFinal = [];
      var VALOR_MONETARIO_PATTERN = /\d+\.\d{1,2}/;
      var NUMERO_PATTERN = /\d/;
      var FIM_DE_LINHA_CODIFICADO = '%0A';
      var ESPACO_STRING_CODIFICADO = '%20';

      if (_titulos) {
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

                if (VALOR_MONETARIO_PATTERN.test(_valor) && /valor/.test(prop)) {
                  _valor = "\"" + VALOR_MONETARIO_PATTERN.exec(_valor).join().replace(".", ",") + "\"";
                }
              }
              else {
                  if (NUMERO_PATTERN.test(_valor)) {
                    _valor = "\"" + String(_valor).replace(".", ",") + "\"";
                  } else {
                    _valor = "\""+_valor+"\"";
                  }
              }
            }

            _valores.push(_valor);
          }
        });

        _matriz.push(_valores);
      });

      ng.forEach(_matriz, function(linha, indice) {
        _listagemFinal.push(linha.join(_separador));
      });

      return _listagemFinal.join(FIM_DE_LINHA_CODIFICADO).replace(/ /g, ESPACO_STRING_CODIFICADO);
    };

    return AltExportacaoTextoParser;
  }])
  .factory('AltExportacaoTextoExec', [function() {
    var AltExportacaoTextoExec = function(doc) {
      this.document = doc;
    };

    AltExportacaoTextoExec.prototype.exporta = function(info, nomeArquivo, tipoArquivo) {
      var _a = this.document.createElement('a');

      _a.href = 'data:attachment/' + tipoArquivo + ';charset=utf-8,%EF%BB%BF' + info;
      _a.target = '_blank';
      _a.download = nomeArquivo;

      this.document.body.appendChild(_a);
      _a.click();
      this.document.body.removeChild(_a);
    };

    return AltExportacaoTextoExec;
  }])
  .directive('altExportacaoTexto', [
    'AltExportacaoTextoModel',
    'AltExportacaoTextoParser',
    'AltExportacaoTextoExec',
    function(AltExportacaoTextoModel, AltExportacaoTextoParser, AltExportacaoTextoExec) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var _parser = null;
          var _modelo = null;
          var _exec = new AltExportacaoTextoExec(document);

          element.on('click', function() {
            var _tipoArquivo = scope.tipoArquivo || 'csv';
            var _nomeArquivo = scope.nomeArquivo || 'Exportação';
            var _info = scope.preparaInfo();

            _modelo = new AltExportacaoTextoModel(_info.titulos, _info.propriedades, _info.info, scope.arquivoContabil, scope.separador);
            _parser = new AltExportacaoTextoParser(_modelo);

            _exec.exporta(_parser.parseArquivo(), _nomeArquivo, _tipoArquivo);
          });
        },
        scope: {
          nomeArquivo: '@',
          tipoArquivo: '@',
          arquivoContabil: '@',
          separador: '@',
          preparaInfo: '&'
        }
      };
  }]);
}(window.angular))
