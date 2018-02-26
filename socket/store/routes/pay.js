module.exports = function(products){
	var fs = require('fs');
	var ejs = require('ejs');
	var route = require('express').Router();

	// 라우트를 수행합니다.
	route.get('/', function(req, res){
		// HTMLPage.html 파일을 읽습니다.
		var htmlPage = fs.readFileSync('./views/HTMLPage.html', 'utf8');
		// 응답합니다.
		res.send(ejs.render(htmlPage, {
			products: products,
			user: req.user
		}));
	});

	return route;
}