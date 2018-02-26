module.exports = function(products){
	var fs = require('fs');
	var ejs = require('ejs');
	var route = require('express').Router();

	// ���Ʈ�� �����մϴ�.
	route.get('/', function(req, res){
		// HTMLPage.html ������ �н��ϴ�.
		var htmlPage = fs.readFileSync('./views/HTMLPage.html', 'utf8');
		// �����մϴ�.
		res.send(ejs.render(htmlPage, {
			products: products,
			user: req.user
		}));
	});

	return route;
}