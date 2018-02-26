var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);


/*
var express = require('express');
var session = require('express-session'); // sudo npm install express-session --save
var MySQLStore = require('express-mysql-session')(session); // sudo npm install express-mysql-session --save
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
var mysql = require('mysql');
var conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '====',
	database : 'syh8088'
});
conn.connect();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: '1234DSFs@adf1234!@#$asd',
	resave: false,
	saveUninitialized: true,
	store:new MySQLStore({
		host:'localhost',
		port:3306,
		user:'root',
		password:'=====',
		database:'syh8088'
	})
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/count', function(req, res){
	if(req.session.count) {
		req.session.count++;
	} else {
		req.session.count = 1;
	}
	res.send('count : '+req.session.count);
});

app.set('views', './views/mysql');
app.set('view engine', 'jade');

passport.serializeUser(function(user, done) {
	console.log('serializeUser', user);
	done(null, user.authId); // done함수를 호출하면 두번째 인자(user.username)가 세션에 저장됨
});

passport.deserializeUser(function(id, done) {
	console.log('deserializeUser', id);
	var sql = 'SELECT * FROM users WHERE authId=?';
	conn.query(sql, [id], function(err, results){
		if(err){
			console.log(err);
			done('There is no user.');
		} else {
			done(null, results[0]);
		}
	});
});

passport.use(new LocalStrategy(
	function(username, password, done){

		var uname = username;
		var pwd = password;
		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, ['local:' + uname], function(err, results){
			if(err){
				return done('There is no user.');
			}
			var user = results[0];
			return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					console.log('LocalStrategy', user);
					done(null, user);
				} else {
					done(null, false);
				}
			});
		});
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
		var authId = 'facebook:'+profile.id;
		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, [authId], function(err, results){
			if(results.length>0){
				done(null, results[0]);
			} else {
				var newuser = {
					'authId':authId,
					'displayName':profile.displayName,
					'email':profile.emails[0].value
				};
				var sql = 'INSERT INTO users SET ?'
				conn.query(sql, newuser, function(err, results){
					if(err){
						console.log(err);
						done('Error');
					} else {
						done(null, newuser);
					}
				});
			}
		});
	}
));
*/

// 1. /auth/login으로 post방식으로 데이터를 전송하면
 // 2. 전송된 데이터는 passport.authenticate 이라는 미들웨어가 받습니다.
 // 3. 이 미들웨어가 실행하면

 // 성공시// 실패시
 /*
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

app.get('/auth/login', function(req, res){
	res.render('auth/login');
});



app.get('/auth/register', function(req, res){
	res.render('auth/register');
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

		var sql = 'INSERT INTO users SET ?';
		conn.query(sql, user, function(err, results){
			if(err){
				console.log(err);
				res.status(500);
			} else {
				req.login(user, function(err){
					req.session.save(function(){
						res.redirect('/welcome');
					});
				});
			}
		});

	});

});



app.get('/auth/logout', function(req, res){
	req.logout();
	req.session.save(function(){
		res.redirect('/welcome');
	});

});
*/
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

//
var auth = require('./routes/mysql/auth')(passport);

// auth로 접근 하는 모든 요청에 대해서 auth라는 라이터가 처리하도록 위임
app.use('/auth/', auth);


app.listen(1331, function(){
	console.log('Connected 1331 port!!!');
});