var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var less = require('less');
var browserify = require('browserify');

var demo = require('./demo');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/mockup/:chat', function (req, res) {
	res.sendFile(__dirname + '/static/mockup/index.html');
});

app.get('/birdity.css', function (req, res) {
	fs.readFile('./birdity.less', { encoding: 'utf8' }, function (e, css) {
		if (e) return res.status(500).send(e);

		less.render(css, function (e, css) {
			if (e) return res.status(500).send(e);
			res.set('Content-type', 'text/css').send(css.css);
		});
	});
});

app.get('/birdity.js', function (req, res) {
	browserify().add('./birdity.js').bundle(function (e, js) {
		if (e) return res.status(500).send(e);
		res.set('Content-type', 'text/javascript').send(js);
	});
});

app.post('/mail', function (req, res) {
	fs.appendFileSync('mails', req.param('mail') + '\n');
	res.send();
});

app.get('/api/chat', function (req, res) {
	var chats = demo.getChats(1);
	res.json(chats);
});

app.get('/api/chat/:chat', function (req, res) {
	var chat = demo.getChat(1, req.params.chat);
	res.json(chat);
});

app.post('/api/chat/:chat', function (req, res) {
	var newChat = (req.params.chat == 1);
	var text = req.body.text || '';
	
	text = text.replace(/\n/g, ' ').trim();

	if (!text) return res.status(400).send();

	if (newChat && !demo.createChat(1, text)) {
		return res.status(400).send();
	}

	if (!newChat && !demo.sendMessage(1, req.params.chat, text)) {
		return res.status(400).send();
	}

	res.send();
});

app.delete('/api/chat/:chat', function (req, res) {
	if (demo.leaveChat(1, req.params.chat)) {
		res.send();
	} else {
		res.status(500).send();
	}
});

app.get('/test', function (req, res) {
	console.log(demo.debug.Messages);
});

app.listen(8070);
console.log('Launched at ' + new Date());