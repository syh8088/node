module.exports = function(){
	var mysql = require('mysql');
	var conn = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '======',
		database : 'syh8088'
	});
	conn.connect();
	return conn;
}