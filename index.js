var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var less = require('less');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/birdity.css', function (req, res) {
	fs.readFile('./birdity.less', { encoding: 'utf8' }, function (e, css) {
		if (e) return res.status(500).send(e);

		less.render(css, function (e, css) {
			if (e) return res.status(500).send(e);
			res.set('Content-type', 'text/css').send(css.css);
		});
	});
});

app.post('/mail', function (req, res) {
	fs.appendFileSync('mails', req.param('mail') + '\n');
	res.send();
});

app.listen(8070);
console.log('Launched at ' + new Date());