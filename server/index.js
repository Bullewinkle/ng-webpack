var compression = require('compression');
var express = require('express');
var path = require('path');
var app = express();

var assets = path.resolve(__dirname, '../dist/assets');
var index = path.resolve(__dirname, '../dist/index.html');
var port = process.env.PORT || 9000;

app.use(compression());
app.use('/assets', express.static(assets));
app.all('/*', function (req, res) {res.sendFile(index)});

app.listen(port, function (err) {
	if (err) throw err;
	console.log('[app] started on port: %s', port);
});