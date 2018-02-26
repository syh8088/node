module.exports = function(passport){
	var bkfd2Password = require("pbkdf2-password");
	var hasher = bkfd2Password();
	var conn = require('../../config/mysql/db')();
	var route = require('express').Router();

	// 1. /auth/login���� post������� �����͸� �����ϸ�
	// 2. ���۵� �����ʹ� passport.authenticate �̶�� �̵��� �޽��ϴ�.
	// 3. �� �̵��� �����ϸ�

	// ������// ���н�
	route.post(
		'/login',
		passport.authenticate(
			'local',
			{
				successRedirect: '/topic',
				failureRedirect: '/auth/login',
				failureFlash: false
			}
		)
	);
	route.get(
		'/facebook',
		passport.authenticate(
			'facebook',
			{scope:'email'}  // �߰� �ϰ� ���� ������ scope�� ��Ƽ� ������.
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
					// req.login �޼ҵ� :  passport���� �����ϴ� �޼ҵ� �α����� ���ְ� ���ش�.
					req.login(user, function(err){
						req.session.save(function(){
							res.redirect('/welcome');
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
			res.redirect('/topic');
		});
	});

	return route;

} // module.exports