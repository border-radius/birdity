var token = 1;

module.exports = function ($resource) {
  return $resource('/api/chat/:id/', {
    token: token
  });
};