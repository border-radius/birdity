var _ = require('lodash');

var Users = [];
var Chats = [
	{
		id: 1,
		type: 'link',
		text: 'Бирдость'
	},
	{
		id: 2,
		type: 'link',
		text: 'Черный список'
	}
];
var Subscribes = [];
var Messages = []

function createUser(name, userpic) {

	var id = Users.length + 1;

	Users.forEach(function (user) {
		var chatID = Chats.length + 1;

		Chats.push({
			id: chatID,
			type: 'user'
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
		userpic: userpic
	});

	return id;
}

function sendMessage (user, chat, text) {
	var id = Messages.length + 1;

	Messages.push({
		id: id,
		userid: user,
		chatid: chat,
		chatid: 1,
		type: 'text',
		text: text
	});

	Subscribes.forEach(function (subscribe) {
		if (subscribe.chatid != 1 || subscribe.userid == user) return;
		subscribe.unread++;
	});

	return id;
}

function sendPrivateMessage (from, to, text) {
	var roster = Subscribes.filter(function (subscribe) {
		return subscribe.userid == from;
	});

	roster = _.pluck(roster, 'chatid');

	var chat = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == to && roster.indexOf(subscribe.chatid) > -1;
	}).chatid;

	return sendMessage(from, chat, text);;
}

function createChat (user, text) {
	var chatID = Chats.length + 1;

	Chats.push({
		id: chatID,
		type: 'chat'
	});

	Subscribes.push({
		chatid: chatID,
		userid: user
	});

	sendMessage(user, chatID, text);

	return chatID;
}


/*
var Messages = [
	{
		id: 1,
		userid: 1,
		chatid: 6,
		text: 'tfw голубок принес приглашение',
		attaches: [
			{
				'webm': '//zippy.gfycat.com/ElasticSaneIsabellineshrike.webm',
				'mp4': '//zippy.gfycat.com/ElasticSaneIsabellineshrike.mp4',
				'poster': '//thumbs.gfycat.com/ElasticSaneIsabellineshrike-poster.jpg'
			}
		]
	},
	{
		id: 2,
		userid: 3,
		chatid: 7,
		text: 'Совершенно утратил навык письма, который выдрачивал столько лет, пишу буквы раздельно. Вообще похуй.'
	},
	{
		id: 3,
		userid: 4,
		chatid: 8,
		text: 'Перцы, у меня при отправлении сообщений вговне оно не отправляется по return (так же не отправляется по C-return). Как зафиксить?'
	},
	{
		id: 4,
		userid: 3,
		chatid: 9,
		text: 'Тестировал рендерилку GPX поверх OSM. Красиво! Подумал, что охуенно смотрелось бы в качестве обоев (на стену). Но для печати надо будет другой DPI намутить, наверное. Загуглил openstreetmap wallpaper — нашел только это.',
		attaches: [
			{
				src: '/attaches/1.jpeg'
			},
			{
				src: '/attaches/2.jpeg'
			}
		]
	},
	{
		id: 5,
		userid: 1,
		chatid: 10,
		text: 'даже и без знания аппербаунда с неуёбищными (паскалевскими) строками конкатенация N строк в цикле = O(N), а не O(N²), этого уже более чем достаточно (ты не сделаешь быстрее)'
	},
	{
		id: 6,
		userid: 5,
		chatid: 11,
		text: '',
		attaches: [
			{
				src: '/attaches/3.jpg'
			}
		]
	}
];
*/

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
			}

			return chat;
		});

		return _.compact(chats);
	});

	return _.flatten(chats);
}

function getChat (user, chat) {
	// 1 == birdity

	if (chat == 1) {
		var chats = Chats.filter(function (chat) {
			return chat.type == 'chat';
		});

		return chats.map(function (chat) {
			return _.find(Messages, function (message) {
				return message.chatid == chat.id;
			});
		});
	}

	// test if user can read this chat
	var subscribe = _.find(Subscribes, function (subscribe) {
		return subscribe.userid == user && subscribe.chatid == chat;
	});

	if (!subscribe) return {
		error: {
			code: 1,
			text: 'Нет доступа.'
		}
	};

	var messages = Messages.map(function (message) {
		if (message.chatid == chat) return message;
	});

	return _.compact(messages);
}

//exports.getChats = getChats;

//console.log(getChat(1, 6));

var me = createUser('безумный пользователь', '/userpics/1');
var hoofoo = createUser('Смерть неизбежна', '/userpics/2');
var komar = createUser('komar', '/userpics/3');
var fda = createUser('4da', '/userpics/4');
var goren = createUser('goren', '/userpics/5');

sendPrivateMessage(goren, me, 'Ничего не пойму');

var hoofoo_1 = createChat(hoofoo, 'Приветики');

console.log(Messages);