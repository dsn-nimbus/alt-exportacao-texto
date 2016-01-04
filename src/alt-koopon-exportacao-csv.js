;(function(ng) {
  "use strict";

  ng.module('alt.koopon.exportacao-csv', [])
  .directive('altKooponExportacaoCsv', [function() {
    var _restrict = 'A';

    var _link = function(scope, element, attrs) {
      element.on('click', function() {
        var _csvRows = scope.preparaInfo();
        var _csvString = _csvRows.join("%0A");

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
