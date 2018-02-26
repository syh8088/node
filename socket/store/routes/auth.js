module.exports = function(passport){
	var bkfd2Password = require("pbkdf2-password");
	var hasher = bkfd2Password();
	var conn = require('../config/db')();
	var route = require('express').Router();

	// 성공시// 실패시
	route.post(
		'/login',
		passport.authenticate(
			'local',
			{
				successRedirect: '/',
				failureRedirect: '/auth/login',
				failureFlash: false
			}
		)
	);

	route.get(
		'/facebook',
		passport.authenticate(
			'facebook',
			{scope:'email'}  // 추가 하고 싶은 정보를 scope에 담아서 보낸다.
		)
	);
	route.get(
		'/facebook/callback',
		passport.authenticate(
			'facebook',
			{
				successRedirect: '/topic',
				failureRedirect: '/auth/login'
			}
		)
	);

	route.post('/register', function(req, res){

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
					// req.login 메소드 :  passport에서 지원하는 메소드 로그인을 해주게 해준다.
					req.login(user, function(err){
						req.session.save(function(){
							res.redirect('/');
						});
					});
				}
			});
		});
	});

	route.get('/register', function(req, res){
		var sql = 'SELECT id,title FROM topic';
		conn.query(sql, function(err, topics, fields){
			res.render('auth/register', {topics:topics});
		});
	});

	route.get('/login', function(req, res){
		var sql = 'SELECT id,title FROM topic';
		conn.query(sql, function(err, topics, fields){
			res.render('auth/login', {topics:topics});
		});
	});

	route.get('/logout', function(req, res){
		req.logout();
		req.session.save(function(){
			return res.redirect('/');
		});
	});

	return route;
}