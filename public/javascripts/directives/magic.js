module.exports = function ($timeout, $rootScope, Chats) {
  return function (scope, elem, attrs) {

    //send
    elem.on('keydown', function (event) {
      if (event.keyCode == 13) {
        $timeout(function () {
          Chats.save({
            id: $rootScope.currentChat
          }, {
            text: elem.val()
          });
          elem.val('');
        });
      }
    });

    //prevent multilines
    elem.on('paste', function () {
      $timeout(function () {
        elem.val(elem.val().replace(/\n/g, ' '));
      });
    });

    //autoresize
    var line;
    elem.on('change cut paste drop keydown', function () {
      if (!line) line = elem[0].style.height;
      $timeout(function () {
        elem[0].style.height = line;
        elem[0].style.height = elem[0].scrollHeight+'px';
      });
    });
  };
};