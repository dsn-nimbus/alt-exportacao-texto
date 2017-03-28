"use strict";

describe('alt.exportacao-texto', function() {
  var _scope, _element, _compile, _AltExportacaoTextoParser, _AltExportacaoTextoExec, _AltExportacaoTextoModel;

  beforeEach(module('alt.exportacao-texto'));

  beforeEach(inject(function($injector) {
    _scope = $injector.get('$rootScope').$new();
    _compile = $injector.get('$compile');

    _AltExportacaoTextoParser = $injector.get('AltExportacaoTextoParser');
    _AltExportacaoTextoExec = $injector.get('AltExportacaoTextoExec');
    _AltExportacaoTextoModel = $injector.get('AltExportacaoTextoModel');
  }));

  describe('directive', function() {
    describe('criação', function() {
      beforeEach(function() {
        _scope.cb = function() {};
        _scope.n = 'nome.123.csv';
        _scope.t = 'txt';
        _scope.s = '|';

        var _html = '<div alt-exportacao-texto prepara-info="cb()" nome-arquivo="{{n}}" tipo-arquivo="{{t}}" separador="{{s}}"></div>';

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
        expect(_element.isolateScope().separador).toEqual(_scope.s);
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

        var _html = '<div alt-exportacao-texto prepara-info="cb()" nome="nome"></div>';

        _element = angular.element(_html);
        _compile(_element)(_scope);

        _scope.$digest();

        _element.click();
      });
    });
  });

  describe('services', function() {
    describe('AltExportacaoTextoModel', function() {
      describe('criação', function() {
        it('deve ser uma function', function() {
          expect(typeof _AltExportacaoTextoModel).toBe('function');
        });

        it('deve ter os valores corretos para a instância - valores default', function() {
          var _m = new _AltExportacaoTextoModel();

          expect(_m.titulos).toEqual(undefined);
          expect(_m.infoNaoTabelada).toEqual(undefined);
          expect(_m.propriedades).toEqual([]);
          expect(_m.info).toEqual([]);
          expect(_m.arquivoContabil).toEqual(false);
        });

        it('deve ter os valores corretos para a instância - tudo preenchido', function() {
          var _titulos = [1, 2, 3];
          var _propriedades = ['a', 'b'];
          var _info = 'abc';
          var _arquivoContabil = true;
          var _separador = '|';

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil, _separador);

          expect(_m.titulos).toEqual(_titulos);
          expect(_m.propriedades).toEqual(_propriedades);
          expect(_m.separador).toEqual(_separador);
          expect(_m.info).toEqual(_info);
          expect(_m.arquivoContabil).toEqual(_arquivoContabil);
        });
      });
    });

    describe('AltExportacaoTextoParser', function() {
      describe('criação', function() {
        it('deve retornar uma function', function() {
          expect(typeof _AltExportacaoTextoParser).toBe('function');
        });
      });

      describe('parseArquivo', function() {
        it('deve fazer o parse corretamente - sem titulos e não é arquivo contábil, com valores vazios - todos devem ter aspas', function() {
          var _titulos = undefined;

          var _propriedades = [
            'a', 'b', 'c', 'd'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, d: ""},
            {a: 4, b: 5, c: 6, d: ""},
            {a: 7, b: 8, c: 9, d: 'abc123'},
          ];

          var _resposta = '"1";"2";"3";""%0A"4";"5";"6";""%0A"7";"8";"9";"abc123"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil);

          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - sem titulos e não é arquivo contábil', function() {
          var _titulos = undefined;

          var _propriedades = [
            'a', 'b', 'c'
          ];

          var _info = [
            {a: 1, b: 2, c: 3},
            {a: 4, b: 5, c: 6},
            {a: 7, b: 8, c: 9},
          ];

          var _resposta = '"1";"2";"3"%0A"4";"5";"6"%0A"7";"8";"9"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil);

          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos e não é arquivo contábil', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C'
          ];

          var _propriedades = [
            'a', 'b', 'c'
          ];

          var _info = [
            {a: 1, b: 2, c: 3},
            {a: 4, b: 5, c: 6},
            {a: 7, b: 8, c: 9},
          ];

          var _resposta = 'Coluna%20A;Coluna%20B;Coluna%20C%0A"1";"2";"3"%0A"4";"5";"6"%0A"7";"8";"9"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil);

          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos, não é arquivo contábil e tem separador diferente de ;', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C'
          ];

          var _propriedades = [
            'a', 'b', 'c'
          ];

          var _info = [
            {a: 1, b: 2, c: 3},
            {a: 4, b: 5, c: 6},
            {a: 7, b: 8, c: 9},
          ];

          var _separador = '|';

          var _resposta = 'Coluna%20A|Coluna%20B|Coluna%20C%0A"1"|"2"|"3"%0A"4"|"5"|"6"%0A"7"|"8"|"9"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil, _separador);
          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos, não é arquivo contábil, tem separador diferente de ; e tem valores com vírgula', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C', 'Coluna D'
          ];

          var _propriedades = [
            'a', 'b', 'c', 'd'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, d: 'a,b,c,d'},
            {a: 4, b: 5, c: 6, d: 'e,f,g,h'},
            {a: 7, b: 8, c: 9, d: 'i,j,k,l'},
          ];

          var _separador = '|';

          var _resposta = 'Coluna%20A|Coluna%20B|Coluna%20C|Coluna%20D%0A"1"|"2"|"3"|"a,b,c,d"%0A"4"|"5"|"6"|"e,f,g,h"%0A"7"|"8"|"9"|"i,j,k,l"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil, _separador);
          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos, não é arquivo contábil, tem informações o seperador default (;) e tem valores com vírgula e valores monetários', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C', 'Coluna D', 'Coluna E'
          ];

          var _propriedades = [
            'a', 'b', 'c', 'd', 'e'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, d: 'a,b,c,d', e: 1.11},
            {a: 4, b: 5, c: 6, d: 'e,f,g,h', e: 2.22},
            {a: 7, b: 8, c: 9, d: 'i,j,k,l', e: 3.33},
          ];

          var _resposta = 'Coluna%20A;Coluna%20B;Coluna%20C;Coluna%20D;Coluna%20E%0A"1";"2";"3";"a,b,c,d";"1,11"%0A"4";"5";"6";"e,f,g,h";"2,22"%0A"7";"8";"9";"i,j,k,l";"3,33"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil);
          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos, não é arquivo contábil, tem separador por vírgula e tem valores com vírgula nas informacoesNaoTabeladas e nos valores tambem', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C', 'Coluna D'
          ];

          var _propriedades = [
            'a', 'b', 'c', 'd'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, d: 'a,b,c,d'},
            {a: 4, b: 5, c: 6, d: 'e,f,g,h'},
            {a: 7, b: 8, c: 9, d: 'i,j,k,l'},
          ];

          var _separador = ',';

          var _resposta = 'Coluna%20A,Coluna%20B,Coluna%20C,Coluna%20D%0A"1","2","3","a,b,c,d"%0A"4","5","6","e,f,g,h"%0A"7","8","9","i,j,k,l"';

          var _arquivoContabil = false;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil, _separador);
          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos e é arquivo contábil', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C'
          ];

          var _propriedades = [
            'a', 'b', 'c', 'valor'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, valor: '1.99'},
            {a: 4, b: 5, c: 6, valor: '1.9'},
            {a: 7, b: 8, c: 9, valor: '0.99'},
            {a: 10, b: 11, c: 12, valor: '1000.99'},
          ];

          var _resposta = 'Coluna%20A;Coluna%20B;Coluna%20C%0A"1";"2";"3";"1,99"%0A"4";"5";"6";"1,9"%0A"7";"8";"9";"0,99"%0A"10";"11";"12";"1000,99"';

          var _arquivoContabil = true;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil);

          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos, é arquivo contábil e tem separador diferente', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C'
          ];

          var _separador = '|'

          var _propriedades = [
            'a', 'b', 'c', 'valor'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, valor: '1.99'},
            {a: 4, b: 5, c: 6, valor: '1.9'},
            {a: 7, b: 8, c: 9, valor: '0.99'},
            {a: 10, b: 11, c: 12, valor: '1000.99'},
          ];

          var _resposta = 'Coluna%20A|Coluna%20B|Coluna%20C%0A"1"|"2"|"3"|"1,99"%0A"4"|"5"|"6"|"1,9"%0A"7"|"8"|"9"|"0,99"%0A"10"|"11"|"12"|"1000,99"';

          var _arquivoContabil = true;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil, _separador);

          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });

        it('deve fazer o parse corretamente - com titulos e é arquivo contábil - existem outros valores parecidos com monetarios, mas não deve sofrer mudança', function() {
          var _titulos = [
            'Coluna A', 'Coluna B', 'Coluna C', 'Coluna D'
          ];

          var _propriedades = [
            'a', 'b', 'c', 'valor', 'outraInfo'
          ];

          var _info = [
            {a: 1, b: 2, c: 3, valor: '1.99', outraInfo: '1.88'},
            {a: 4, b: 5, c: 6, valor: '1.9', outraInfo: '777'},
            {a: 7, b: 8, c: 9, valor: '0.99', outraInfo: '5.77'},
            {a: 10, b: 11, c: 12, valor: '1000.99', outraInfo: 'itaú 1.1'}
          ];

          var _resposta = 'Coluna%20A;Coluna%20B;Coluna%20C;Coluna%20D%0A"1";"2";"3";"1,99";"1.88"%0A"4";"5";"6";"1,9";"777"%0A"7";"8";"9";"0,99";"5.77"%0A"10";"11";"12";"1000,99";"itaú%201.1"';

          var _arquivoContabil = true;

          var _m = new _AltExportacaoTextoModel(_titulos, _propriedades, _info, _arquivoContabil);

          var _parser = new _AltExportacaoTextoParser(_m);
          var _resultadoParsed = _parser.parseArquivo();

          expect(_resultadoParsed).toEqual(_resposta);
        });
      });
    });

    describe('AltExportacaoTextoExec', function() {
      describe('criação', function() {
        it('deve retornar uma function', function() {
          expect(typeof _AltExportacaoTextoExec).toBe('function');
        });

        it('deve ter document com o que é passado por parâmetro', function() {
          var _doc = {a: 1};

          var _exec = new _AltExportacaoTextoExec(_doc);

          expect(_exec.document).toEqual(_doc);
        });
      });

      describe('exporta', function() {
        it('deve adicionar os valores corretos ao elemento a', function() {
          var _a = {
              click: angular.noop
          };

          var _fakeDocument = {
            body: {
              removeChild: angular.noop,
              appendChild: angular.noop
            },
            createElement: function() {
              return _a;
            }
          };

          var _info = '{"a": 1}';
          var _nomeArquivo = 'nome.123';
          var _tipoArquivo = 'txt';

          spyOn(_fakeDocument, 'createElement').and.callThrough();
          spyOn(_fakeDocument.body, 'appendChild').and.callThrough();
          spyOn(_fakeDocument.body, 'removeChild').and.callThrough();
          spyOn(_a, 'click').and.callThrough();

          var _exec = new _AltExportacaoTextoExec(_fakeDocument);

          _exec.exporta(_info, _nomeArquivo, _tipoArquivo);

          expect(_a.href).toBe('data:attachment/' + _tipoArquivo + ';charset=utf-8,%EF%BB%BF' + _info)
          expect(_a.target).toBe('_blank');
          expect(_a.download).toBe(_nomeArquivo);

          expect(_fakeDocument.createElement).toHaveBeenCalledWith('a');
          expect(_fakeDocument.body.appendChild).toHaveBeenCalledWith(_a);
          expect(_a.click).toHaveBeenCalled();
          expect(_fakeDocument.body.removeChild).toHaveBeenCalledWith(_a);
        });
      });
    });
  });
});
