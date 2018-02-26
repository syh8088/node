module.exports = function(){
	var conn = require('../config/db')();
	var route = require('express').Router();

	route.get('/chat', function(req, res){
		var sql = 'SELECT * FROM chat';
		conn.query(sql, function(err, data, fields){
			res.render('chat', {datas:data});
		});
	});

	return route;

} // module.exports