"use strict";

describe('alt.koopon.exportacao-csv', function() {
  var _scope, _element, _compile;

  beforeEach(module('alt.koopon.exportacao-csv'));

  beforeEach(inject(function($injector) {
    _scope = $injector.get('$rootScope').$new();
    _compile = $injector.get('$compile');

  }));

  describe('criação', function() {
    beforeEach(function() {
      _scope.cb = function() {};
      _scope.n = 'nome.123.csv';

      var _html = '<div alt-koopon-exportacao-csv prepara-info="cb()" nome-arquivo="{{n}}"></div>';

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
    });
  })

  describe('onClick', function() {
    it('deve funcionar corretamente ao ser clicada', function() {
      _scope.cb = function() {
        return [1, 2, 3];
      };

      _scope.nome = 'meu_arquivo.csv';

      var _html = '<div alt-koopon-exportacao-csv prepara-info="cb()" nome="nome"></div>';

      _element = angular.element(_html);
      _compile(_element)(_scope);

      _scope.$digest();

      _element.click();
    })
  });
});
