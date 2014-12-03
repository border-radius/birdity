var _ = require('lodash');
var stringForms = require('./lib/stringforms');

var Users = [];
var Chats = [
	{
		id: 1,
		type: 'link',
		text: 'Бирдость',
		bump: new Date('2039-01-01')
	}
];
var Subscribes = [];
var Messages = []

function createUser(name, userpic, email, password) {

	var id = Users.length + 1;

	Users.forEach(function (user) {
		var chatID = Chats.length + 1;

		Chats.push({
			id: chatID,
			type: 'user',
			bump: new Date()
		});

		Subscribes.push({
			chatid: chatID,
			userid: id,
			unread: 0
		});

		Subscribes.push({
			chatid: chatID,
			userid: user.id,
			unread: 0
		});
	});

	Users.push({
		id: id,
		name: name,
		userpic: userpic,
		email: email,
		password: password
	});

	//subscribe to birdity
	Subscribes.push({
		chatid: 1,
		userid: id,
		unread: 0
	});

	return id;
}

function sendMessage (user, chat, text, newChat) {
	//check subscribe
	var subscribe = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == user && subscribe.chatid == chat;
	});

	if (!subscribe) return false;

	var id = Messages.length + 1;

	Messages.push({
		id: id,
		userid: user,
		chatid: chat,
		date: new Date(),
		type: 'text',
		text: text,
		newChat: newChat || false
	});

	Subscribes.forEach(function (subscribe) {
		if (subscribe.chatid == chat && subscribe.userid != user) subscribe.unread++;
		if (newChat && subscribe.chatid == 1 && subscribe.userid != user) subscribe.unread++;
	});

	//bump

	Chats = Chats.map(function (_chat) {
		if (_chat.id != chat) return _chat;
		_chat.bump = new Date();
		return _chat;
	})

	return id;
}

function joinChat (user, chat) {
	var subscribe = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == user && subscribe.chatid == chat;
	});

	if (subscribe) return;

	var thatChat = _.find(Chats, function (thatChat) {
		return thatChat.id == chat;
	});

	if (thatChat.type != 'chat') return;

	Subscribes.push({
		chatid: chat,
		userid: user,
		unread: 0
	});

	var id = Messages.length + 1;

	Messages.push({
		id: id,
		userid: user,
		chatid: chat,
		date: new Date(),
		type: 'status',
		status: 1
	});

	return chat;
}

function leaveChat (user, chat, isUser) {
	var subscribe = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == user && subscribe.chatid == chat;
	});

	if (!subscribe) return;

	var thatChat = _.find(Chats, function (thatChat) {
		return thatChat.id == chat;
	});

	if (thatChat.type == 'link') return;

	var id = Messages.length + 1;

	var status = (isUser) ? 3 : 2;

	Messages.push({
		id: id,
		userid: user,
		chatid: chat,
		date: new Date(),
		type: 'status',
		status: status
	});

	Subscribes = Subscribes.filter(function (subscribe) {
		return subscribe.userid != user || subscribe.chatid != chat;
	});

	return true;
}

function getPrivateChat (from, to) {
	var roster = Subscribes.filter(function (subscribe) {
		var chat = _.find(Chats, function (chat) {
			return chat.id == subscribe.chatid;
		});

		return chat.type == 'user' && subscribe.userid == from;
	});

	roster = _.pluck(roster, 'chatid');

	var subscribe = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == to && roster.indexOf(subscribe.chatid) > -1;
	});

	if (subscribe) return subscribe.chatid;
}

function createChat (user, text) {
	var chatID = Chats.length + 1;

	Chats.push({
		id: chatID,
		type: 'chat',
		bump: new Date()
	});

	Subscribes.push({
		chatid: chatID,
		userid: user,
		unread: 0
	});

	sendMessage(user, chatID, text, true);

	return chatID;
}

function getChats (user) {
	
	//find related subscribes
	var subscribes = Subscribes.filter(function (subscribe) {
		return subscribe.userid == user;
	});

	//convert subscribes to chats
	var chats = subscribes.map(function (subscribe) {
		var chats = Chats.map(function (chat) {
			if (chat.id != subscribe.chatid) return false;

			chat = _.clone(chat);

			chat.unread = subscribe.unread || '';

			switch (chat.type) {
				case 'user':

					var otherUser = _.find(Subscribes, function (subscribe) {
						return subscribe.chatid == chat.id && subscribe.userid != user;
					});

					otherUser = _.find(Users, function (user) {
						return user.id == otherUser.userid;
					});

					chat.text = otherUser.name;
					chat.userpic = otherUser.userpic;

					break;

				case 'chat':

					var post = _.find(Messages, function (message) {
						return message.newChat && message.chatid == chat.id;
					});

					chat.text = post.text.substr(0, 70);

					break;
			}

			return chat;
		});

		return _.compact(chats);
	});

	return _.flatten(chats);
}

function getChat (user, chat) {
	// 1 == birdity

	var userid = user;

	if (chat == 1) {
		var chats = Chats.filter(function (chat) {
			return chat.type == 'chat';
		});

		chats = chats.map(function (chat) {
			var message = _.find(Messages, function (message) {
				return message.chatid == chat.id;
			});

			message = _.clone(message);

			if (userid != message.userid) {
				var userchat = getPrivateChat(userid, message.userid);
				if (!userchat) return;
				message.userchat = userchat;
			}

			var user = _.find(Users, function (user) {
				return user.id == message.userid;
			});

			message.userpic = user.userpic;
			message.username = user.name;

			var countUsers = Subscribes.reduce(function (count, subscribe) {
				if (subscribe.chatid == message.chatid) count++;
				return count;
			}, 0);

			var countMessages = Messages.reduce(function (count, _message) {
				if (message.chatid == _message.chatid && _message.type == 'text') count++;
				return count;
			}, 0);

			message.newChat = [
				stringForms(countUsers, ['участник', 'участника', 'участников']),
				', ',
				stringForms(countMessages, ['сообщение', 'сообщения', 'сообщений'])
			].join(' ');

			return message;
		});

		return _.compact(chats);
	}

	// test if user can read this chat
	var subscribe = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == user && subscribe.chatid == chat;
	});

	if (!subscribe && !joinChat(user, chat)) return {
		error: {
			code: 1,
			text: 'Нет доступа.'
		}
	};
	

	var messages = Messages.map(function (message) {
		if (message.chatid != chat) return;

		message = _.clone(message);

		delete message.newChat;
		
		var user = _.find(Users, function (user) {
			return user.id == message.userid;
		});

		message.userpic = user.userpic;
		message.username = user.name;
		
		return message;
	});

	return _.compact(messages);
}

function Auth (email, password) {
	if (!email || !password) return;

	return _.where(Users, {
		email: email,
		password: password
	});
}

var me = createUser('безумный пользователь', '/userpics/1.jpg', 'test@test.com', 'qwe');
var hoofoo = createUser('Смерть неизбежна', '/userpics/2.jpg');
var komar = createUser('komar', '/userpics/3.jpg');
var fda = createUser('4da', '/userpics/4.jpg');
var goren = createUser('goren', '/userpics/5.jpg');

var hoofoo_1 = createChat(hoofoo, 'Приветствую участников Бирдости!');
var me_1 = createChat(me, 'tfw голубок принес приглашение');
var komar_1 = createChat(komar, 'Совершенно утратил навык письма, который выдрачивал столько лет, пишу буквы раздельно. Вообще похуй.');
var fda_1 = createChat(fda, 'Перцы, у меня при отправлении сообщений вговне оно не отправляется по return (так же не отправляется по C-return). Как зафиксить?');
var komar_2 = createChat(komar, 'Тестировал рендерилку GPX поверх OSM. Красиво! Подумал, что охуенно смотрелось бы в качестве обоев (на стену). Но для печати надо будет другой DPI намутить, наверное. Загуглил openstreetmap wallpaper — нашел только это.');
var me_2 = createChat(me, 'даже и без знания аппербаунда с неуёбищными (паскалевскими) строками конкатенация N строк в цикле = O(N), а не O(N²), этого уже более чем достаточно (ты не сделаешь быстрее)');
var goren_1 = createChat(goren, 'Пуууууук.');

setTimeout(function () {
	var chat = getPrivateChat(goren, me);
	sendMessage(goren, chat, 'Ничего не пойму');
}, 100);
setTimeout(function () {
	joinChat(me, goren_1);
}, 100);
setTimeout(function () {
	sendMessage(me, goren_1, 'хуй соси губой тряси');
}, 100);
setTimeout(function () {
	sendMessage(goren, goren_1, 'Лан.');
	leaveChat(goren, goren_1);
}, 100);

module.exports = {
	createUser: createUser,
	sendMessage: sendMessage,
	joinChat: joinChat,
	leaveChat: leaveChat,
	getPrivateChat: getPrivateChat,
	createChat: createChat,
	getChat: getChat,
	getChats: getChats,
	auth: Auth,
	debug: {
		Subscribes: Subscribes,
		Messages: Messages
	}
};

/*
		attaches: [
			{
				'webm': '//zippy.gfycat.com/ElasticSaneIsabellineshrike.webm',
				'mp4': '//zippy.gfycat.com/ElasticSaneIsabellineshrike.mp4',
				'poster': '//thumbs.gfycat.com/ElasticSaneIsabellineshrike-poster.jpg'
			}
		]
		attaches: [
			{
				src: '/attaches/1.jpeg'
			},
			{
				src: '/attaches/2.jpeg'
			}
		]
		attaches: [
			{
				src: '/attaches/3.jpg'
			}
		]
	}
*/