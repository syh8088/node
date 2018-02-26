module.exports = function(app){

	var conn = require('./db')();
	// pbkdf2 : 기존 암호화 + 랜덤화 salt 암호 이렇게 여러 단방향 암호화하는것 //
	var bkfd2Password = require('pbkdf2-password'); // sudo npm install pbkdf2-password --save
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;

	// sudo npm install passport-facebook --save
	var FacebookStrategy = require('passport-facebook').Strategy;
	var hasher = bkfd2Password();
	app.use(passport.initialize());
	app.use(passport.session());

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

	return passport;
}