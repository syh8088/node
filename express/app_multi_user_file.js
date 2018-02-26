var express = require('express');
var session = require('express-session'); // sudo npm install express-session --save
var FileStore = require('session-file-store')(session); // sudo npm install session-file-store --save
var bodyParser = require('body-parser');

//var md5 = require('md5'); // sudo npm install md5 --save
//var sha256 = require('sha256'); // sudo npm install sha256 --save


// pbkdf2 : 기존 암호화 + 랜덤화 salt 암호 이렇게 여러 단방향 암호화하는것 //
var bkfd2Password = require('pbkdf2-password'); // sudo npm install pbkdf2-password --save
var hasher = bkfd2Password();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: '1234DSFs@adf1234!@#$asd',
	resave: false,
	saveUninitialized: true,
	store:new FileStore()
}));

//var salt = "efwf32$@#$egwegweg";
var users = [
	{
		username : 'syh8088',
		password : '+WhaIhEIwCVeF4kEWcsX6UzP4qfYKdpVnQqsEzUgD9DoJRhrwM9uIL/Ow1Ej/UMll8YisFG4S9wY41HTDJa/GElbt4id/49Dv257eLckDhOBUlc67B5+POIjbRXm9P+DM8IW8PUy0l6HsTjJ+4eoTAJXq9O6ZHt+aKjOGwpJM3o=',
		salt : 'moIfDX29Nlw+6XQOdrEX6JfPaiwTKpbOo8xYXW1MjxN+NoasTC4yfirg476+vRzZKVyk59/Vo+9dTLY0lbOjwQ==',
		displayName : 'Syh8088'
	}
];


app.get('/count', function(req, res){
	if(req.session.count) {
		req.session.count++;
	} else {
		req.session.count = 1;
	}
	res.send('count : '+req.session.count);
});

app.get('/auth/login', function(req, res){
	var output = `
		<h1>Login</h1>
		<form action="/auth/login" method="post">
			<p>
				<input type="text" name="username" placeholder="username">
			</p>
			<p>
				<input type="password" name="password" placeholder="password">
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
	`;

	res.send(output);
});

app.post('/auth/login', function(req, res){
	var uname = req.body.username;
	var pwd = req.body.password;

	for(var i=0; i<users.length; i++){

		var user = users[i];

		if(uname === user.username) {

			return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					req.session.displayName = user.displayName;
					req.session.save(function(){
						res.redirect('/welcome');
					});
				} else {
					res.send('Who are you? <a href="/auth/login">login</a>');
				}
			});
		}
/*
		if(uname === user.username && sha256(pwd+user.salt) === user.password){
			req.session.displayName = user.displayName;
			return req.session.save(function(){
				res.redirect('/welcome');
			});
		}
*/
	}
	res.send('Who are you? 2<a href="/auth/login">login</a>');
});

app.get('/auth/register', function(req, res){
	var output = `
		<h1>Register</h1>
		<form action="/auth/register" method="post">
			<p>
				<input type="text" name="username" placeholder="username">
			</p>
			<p>
				<input type="password" name="password" placeholder="password">
			</p>
			<p>
				<input type="text" name="displayName" placeholder="displayName">
			</p>
			<p>
				<input type="submit">
			</p>
		</form>
	`;
	res.send(output);
});

app.post('/auth/register', function(req, res){

	hasher({password:req.body.password}, function(err, pass, salt, hash){
		var user = {
			username : req.body.username,
			password : hash,
			salt : salt,
			displayName : req.body.displayName
		};
		users.push(user);
		req.session.displayName = req.body.displayName;
		req.session.save(function(){
			res.redirect('/welcome');
		});
	});

});

app.get('/auth/logout', function(req, res){
	delete req.session.displayName;
	res.redirect('/welcome');
});

app.get('/welcome', function(req, res){
	if(req.session.displayName) {
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href='/auth/logout'>logout</a>
		`);
	} else {
		res.send(`
			<h1>Welcome</h1>
			<ul>
				<li><a href='/auth/login'>Login</a></li>
				<li><a href='/auth/register'>Register</a></li>
			</ul>
		`);
	}

});

app.listen(1331, function(){
	console.log('Connected 1331 port!!!');
});