var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(1331, function(){
	console.log('323ewfew');
});