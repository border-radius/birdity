var demo = require('./demo');

module.exports = function (req, res, next) {

	req.models = {
		chat: function (chat, user, next) {
			if (chat == 1)
			return next(null, []);
			next(null, [
				{
					userpic: 2,
					text: 'чух'
				},
				{
					userpic: 3,
					text: 'пук'
				},
				{
					userpic: 4,
					text: 'уау'
				}
			]);
		},
		chats: function (user, next) {
			next(null, demo.getChats(1));
		}
	}

	next();

};