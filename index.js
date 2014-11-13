var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

app.post('/mail', function (req, res) {
	fs.appendFileSync('mails', req.param('mail') + '\n');
	res.send();
});

app.listen(8070);
console.log('Launched at ' + new Date());