var express = require('express');
var app = express();

var p1 = require('./routes/p1')(app);
app.use('/p1', p1); // p1으로 모든 접속한것은 p1이라는 라우터에 있는것을 위임한다.

var p2 = require('./routes/p2')(app);
app.use('/p2', p2);

app.listen(1331, function(){
	console.log('connected');
});