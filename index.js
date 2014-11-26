var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var less = require('less');
var browserify = require('browserify');

var app = express();

app.use(require('./db'));

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
	req.models.chats(1, function (e, chats) {
		if (e) return res.status(500).send(e);
		res.json(chats);
	})
});

app.get('/api/chat/:chat', function (req, res) {
	req.models.chat(req.params.chat, 1, function (e, messages) {
		if (e) return res.status(500).send(e);
		res.json(messages);
	});
	/*res.json([
		{
			text: 'chat #' + req.params.chat
		}
	]);*/
	/*res.json([
		{
			userpic: 'https://bnw.im/u/anonymous/avatar/thumb',
			text: 'завидуйте лол. blackjack, 50/50 indica/sativa',
			attaches: [
				{
					type: 'image',
					src: 'http://i.imgur.com/IjiKQ85.jpg'
				}
			],
			users: 6,
			messages: 20
		},
		{
			own: true,
			text: 'На самом деле я никогда не сливаюсь, я просто перехожу на новый уровень беседы, а ты ползёшь там по низам и не понимаешь моего уровня, и так всегда, поэтому тебе кажется, что ебанутый и нелогичный, а мне с тобой скучно, потому что я знаю твой следующий реплай. Спасибо за фидбек.',
			users: 9,
			messages: 18
		},
		{
			userpic: 'https://bnw.im/u/l29ah/avatar/thumb',
			text: 'ОДИН РАБОЧИЙ ХИНКПАД И ДВА ЗАПАСНЫХ',
			users: 3,
			messages: 8
		}
	]);*/
});

app.listen(8070);
console.log('Launched at ' + new Date());