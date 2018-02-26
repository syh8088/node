module.exports = function(){
	// ����� �����մϴ�.


	var express = require('express');
	var session = require('express-session');
	var MySQLStore = require('express-mysql-session')(session);
	var bodyParser = require('body-parser');

	var app = express();

	// �������� ���� �մϴ�.
	//app.use(express.static(__dirname + './views'));
	//app.use(express.static(`${__dirname}/views`));
	app.set('views', './views');
	app.set('view engine', 'jade');

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(session({
		secret: '1234DSFs@adf1234!@#$asd',
		resave: false,
		saveUninitialized: true,
		store:new MySQLStore({
			host:'localhost',
			port:3306,
			user:'root',
			password:'======',
			database:'syh8088'
		})
	}));
	return app;
}