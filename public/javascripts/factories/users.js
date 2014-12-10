module.exports = function ($resource) {
  return $resource('/api/user/:id/');
};