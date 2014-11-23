var pg = require('pg');
var config = 'postgres://postgres_user:bird@localhost/birdity';

var queries = {
	chat: 'SELECT m.*, u.name, u.userpic '+
		  'FROM messages m, chats_users cu, users u '+
		  'WHERE '+
		  	'm.chat = $1::int AND '+
		  	'm.chat = cu.chat AND '+
		  	'cu.userid = $2::int AND '+
		  	'm.userid = u.id'
};

module.exports = function (req, res, next) {

	var client = new pg.Client(config);

	client.connect(function (e) {

		if (e) return next(e);

		req.models = {
			chat: function (chat, user, next) {
				client.query(queries.chat, [chat, user], function (e, result) {
					if (e) return next(e);
					next(null, result.rows);
				});
			},

			chats: function (user, next) {

			}
		}

		next();

	});

};