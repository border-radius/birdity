var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var less = require('less');
var browserify = require('browserify');

var app = express();

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
	res.json([
		{
			id: 1,
			type: 'link',
			text: 'Бирдость',
			unread: 12
		},
		{
			id: 3,
			type: 'user',
			text: 'tigrch',
			userpic: 'https://pbs.twimg.com/profile_images/3433388447/aaf19722ee9d58256e5e829db1515efe_bigger.jpeg',
			unread: 4
		},
		{
			id: 4,
			type: 'chat',
			text: 'Позвонил и из военкомата явиться на последнюю сверку документов, скоро',
			unread: 2
		},
		{
			id: 5,
			type: 'chat',
			text: 'Верните 2012 год пидоры',
			unread: 7
		},
		{
			id: 6,
			type: 'user',
			text: 'Velvet-Bird',
			userpic: 'http://cs14112.vk.me/c624528/v624528471/846e/vq4w6zYtm9g.jpg',
		},
		{
			id: 7,
			type: 'user',
			text: 'Смерть неизбежна',
			userpic: 'http://cs616326.vk.me/v616326553/213de/eRQoF38919M.jpg'
		},
		{
			id: 8,
			type: 'user',
			text: 'slavik the best',
			userpic: 'https://bnw.im/u/anonymous/avatar/thumb'
		},
		{
			id: 9,
			type: 'chat',
			text: 'Смотришь код, который написала твоя тян, и понимаешь, что тебя или не слушают, когда ты'
		},
		{
			id: 10,
			type: 'chat',
			text: 'Сегодня я понял, что я латентная пидораха. Такие дела.'
		}
	]);
});

app.get('/api/chat/:chat', function (req, res) {
	res.json([
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
	]);
});

app.listen(8070);
console.log('Launched at ' + new Date());