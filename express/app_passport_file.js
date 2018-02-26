var express = require('express');
var session = require('express-session'); // sudo npm install express-session --save
var FileStore = require('session-file-store')(session); // sudo npm install session-file-store --save
var bodyParser = require('body-parser');

//var md5 = require('md5'); // sudo npm install md5 --save
//var sha256 = require('sha256'); // sudo npm install sha256 --save

// sudo npm install passport passport-local --save
// http://passportjs.org/ <-- 참고 페이지
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// sudo npm install passport-facebook --save
var FacebookStrategy = require('passport-facebook').Strategy;

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
app.use(passport.initialize());
app.use(passport.session());



//var salt = "efwf32$@#$egwegweg";
var users = [
	{
		authId : 'local:syh8088',
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
		<a href="/auth/facebook">facebook</a>
	`;

	res.send(output);
});


passport.serializeUser(function(user, done) {
	console.log('serializeUser', user);
	done(null, user.authId); // done함수를 호출하면 두번째 인자(user.username)가 세션에 저장됨
});

passport.deserializeUser(function(id, done) {
	console.log('deserializeUser', id);
	for(var i=0; i<users.length; i++){
		var user = users[i];
		if(user.authId === id){
			return done(null, user);
		}
	}
	done('There in no user.');
});

passport.use(new LocalStrategy(
	function(username, password, done){

		var uname = username;
		var pwd = password;

		for(var i=0; i<users.length; i++){

			var user = users[i];

			if(uname === user.username) {

				return hasher({password:pwd, salt:user.salt},
				function(err, pass, salt, hash){


					if(hash === user.password){ // 사용자라면


						done(null, user);


					} else {
						done(null, false);
					}
				});
			}
		}
		done(null, false);
	}
));

passport.use(new FacebookStrategy({
		clientID: '======',
		clientSecret: '======',
		callbackURL: "/auth/facebook/callback",
		profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName'] //추가 하고 싶은 정보를 기입해서 추가 전송 한다.
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		var authId = 'facebook:' + profile.id;
		for(var i=0; i<users.length; i++){
			var user = users[i];
			if(user.authId === authId){
				return done(null, user);
			}
		}
		var newuser = {
			'authId':authId,
			'displayName':profile.displayName,
			'email':profile.emails[0].value
		};
		users.push(newuser);
		done(null, newuser);
		// User.findOrCreate(..., function(err, user) {
		//   if (err) { return done(err); }
		//   done(null, user);
		// });
	}
));


// 1. /auth/login으로 post방식으로 데이터를 전송하면
 // 2. 전송된 데이터는 passport.authenticate 이라는 미들웨어가 받습니다.
 // 3. 이 미들웨어가 실행하면

 // 성공시// 실패시
app.post(
	'/auth/login',
	passport.authenticate(

		'local',
		{
			successRedirect: '/welcome',
			failureRedirect: '/auth/login',
			failureFlash: false
		}
	)
);

app.get(
	'/auth/facebook',
	passport.authenticate(
		'facebook',
		{scope: 'email'} // 추가 하고 싶은 정보를 scope에 담아서 보낸다.
	)
);
app.get(
	'/auth/facebook/callback',
	passport.authenticate(
		'facebook',
		{
			successRedirect: '/welcome',
			failureRedirect: '/auth/login'
		}
	)
);

/*
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
/*
	}
	res.send('Who are you? 2<a href="/auth/login">login</a>');
});
*/
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
			authId:'local:'+req.body.username,
			username : req.body.username,
			password : hash,
			salt : salt,
			displayName : req.body.displayName
		};
		users.push(user);

		req.login(user, function(err){ //로그인이 작동되면 실행되는 함수
			req.session.save(function(){
				res.redirect('/welcome');
			});
		});

	});

});

app.get('/auth/logout', function(req, res){
	req.logout();
	req.session.save(function(){
		res.redirect('/welcome');
	});

});

app.get('/welcome', function(req, res){
	if(req.user && req.user.displayName) {
		res.send(`
			<h1>Hello, ${req.user.displayName}</h1>
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