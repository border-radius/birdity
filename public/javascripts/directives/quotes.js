var stringForms = require('../../../lib/stringforms');

module.exports = function () {
  return function (scope, elem, attrs) {
    scope.$watch(attrs.quotes, function (quotes) {
      if (quotes) {
        elem.text(stringForms(quotes, ['цитата', 'цитаты', 'цитат']));
      } else {
        elem.text('');
      }
    });
  }
};