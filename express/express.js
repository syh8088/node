var express = require('express');
var bodyParser = require('body-parser'); // POST 방식의 body 값을 가져오기 위한 묘듈
var app = express();

app.locals.pretty = true; // uglify 반대

app.set('view engine', 'jade'); // express에게 알린다. 사용할 엔진을 jade 실행하라는 뜻

// 템플릿이 있는 디렉토리를 express에 알리는 코드
app.set('views', './views');

app.use(express.static('public')); // 정적파일 서비스(node 다시 실행 할 필요없음 반대어 : 동적)

/* Express-POST 방식을 이용한 정보의 전달 START*/

// GET 방식
app.get('/form', function(req, res){
	res.render('form');
});

app.get('/form_receiver', function(req, res){
	var title = req.query.title;
	var description = req.query.description;
	res.send(title + ',' + description);
});

// POST 방식

// 사용자가 POST방식인 데이터가 있다면 body라는 객체를 bodyParser가 추가한다.
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/form_post', function(req, res){
	res.render('form_post');
});

app.post('/form_receiver', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	res.send(title + ',' + description);
});
/* Express-POST 방식을 이용한 정보의 전달 END*/

/* query string START*/
//app.get('/topic', function(req, res){ 일반 URL
app.get('/topic/:id', function(req, res){ // semantic(시멘틱) URL
	var topics = [
		'Javascript is....',
		'Nodejs is...',
		'Express is...'
	];
	// 일반 URL
	/*
	var output = `
		<a href="/topic?id=0">JavaScript</a><br>
		<a href="/topic?id=1">Nodejs</a><br>
		<a href="/topic?id=2">Express</a><br><br>
		${topics[req.query.id]}
	`
	*/
	// semantic(시멘틱) URL
	var output = `
		<a href="/v?id=0">JavaScript</a><br>
		<a href="/topic?id=1">Nodejs</a><br>
		<a href="/topic?id=2">Express</a><br><br>
		${topics[req.params.id]}
	`

	//res.send(req.query.id + ',' + req.query.name);
	//res.send(topics[req.query.id]);
	res.send(output);
});

app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+','+req.params.mode)
})
/* query string END*/

// template으로 통해 경로로 온 고객은 함수가 실행되면서 temp 이라는 템플릿 파일을 웹페이지로 렌더링해서 전송하는 뜻
app.get('/template', function(req, res){
	res.render('temp', {time:Date(), title:'Jade'});
});

// http://IP주소:1331
app.get('/', function(req, res){
	res.send('Hello home page');
});

app.get('/dynamic', function(req, res){
	var lis = '';
	for(var i=0; i<5; i++){
	lis = lis + '<li>coding</li>';
	}
	var time = Date();
	var output = `
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="utf-8">
	  <title></title>
	</head>
	<body>
		Hello, Dynamic!
		<ul>
		  ${lis}
		</ul>
		${time}
	</body>
	</html>`;
	res.send(output);
});

// http://IP주소:1331/login
app.get('/login', function(req, res){
	res.send('<h1>Login please</h1>');
});

app.get('/route', function(req, res){
	res.send('Hello Router, <img src="/111.JPG">');
});

app.listen(1331, function(){
	console.log('Conneted 1331 port!');
});