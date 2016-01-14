"use strict";

describe('alt.koopon.exportacao-csv', function() {
  var _scope, _element, _compile, _AltKooponExportacaoParser, _AltKooponExportacaoExec;

  beforeEach(module('alt.koopon.exportacao-csv'));

  beforeEach(inject(function($injector) {
    _scope = $injector.get('$rootScope').$new();
    _compile = $injector.get('$compile');

    _AltKooponExportacaoParser = $injector.get('AltKooponExportacaoParser');
    _AltKooponExportacaoExec = $injector.get('AltKooponExportacaoExec');
  }));

  describe('directive', function() {
    describe('criação', function() {
      beforeEach(function() {
        _scope.cb = function() {};
        _scope.n = 'nome.123.csv';
        _scope.t = 'txt';

        var _html = '<div alt-koopon-exportacao-csv prepara-info="cb()" nome-arquivo="{{n}}" tipo-arquivo="{{t}}"></div>';

        _element = angular.element(_html);
        _compile(_element)(_scope);

        _scope.$digest();
      })

      it('deve inicializar corretamente', function() {
        expect(_element).toBeDefined();
      });

      it('deve ter nome e preparaInfo definidos', function() {
        expect(typeof _element.isolateScope().preparaInfo).toEqual("function");
        expect(_element.isolateScope().nomeArquivo).toEqual(_scope.n);
        expect(_element.isolateScope().tipoArquivo).toEqual(_scope.t);
      });
    });

    describe('onClick', function() {
      it('deve funcionar corretamente ao ser clicada', function() {
        _scope.cb = function() {
          return {
            info: [{x: 1, y: 2, z: 3}],
            titulos: ['a', 'b', 'c'],
            propriedades: ['x', 'y', 'z']
          };
        };

        _scope.nome = 'meu_arquivo.csv';

        var _html = '<div alt-koopon-exportacao-csv prepara-info="cb()" nome="nome"></div>';

        _element = angular.element(_html);
        _compile(_element)(_scope);

        _scope.$digest();

        _element.click();
      });
    });
  });

  describe('services', function() {
    describe('AltKooponExportacaoParser', function() {
      describe('criação', function() {
        it('deve retornar uma function', function() {
          expect(typeof _AltKooponExportacaoParser).toBe('function');
        });
      });

      describe('parseCsvNormal', function() {
        it('deve fazer o parse corretamente', function() {
          throw 'não implementado ainda';
        });
      });

      describe('parseArquivoContabilPack', function() {
        it('deve fazer o parse corretamente', function() {
          throw 'não implementado ainda';
        });
      });
    });

    describe('AltKooponExportacaoExec', function() {
      describe('criação', function() {
        it('deve retornar uma function', function() {
          expect(typeof _AltKooponExportacaoExec).toBe('function');
        });
      });

      describe('exporta', function() {
        it('deve adicionar os valores corretos ao elemento a', function() {
          throw 'não implementado ainda';
        });
      });
    });
  });
});
