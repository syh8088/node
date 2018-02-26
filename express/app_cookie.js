var express = require('express');
var cookieParser = require('cookie-parser'); // $ npm install cookie-parser
var app = express();

app.use(cookieParser('23416eve%^2ds1@csw')); //cookieParser라는 미들웨어라는 녀석이 우리 애플리케이션을 사용한다는 의미

var products = {
	1:{title:'The history of web 1'},
	2:{title:'The next web'}
}

// ${} -> 달라 중괄호 안에 넣어야지 변수로 인식한다.
app.get('/products', function(req, res){
	var output = '';
	for(var name in products) {
		output += `
		<li>
			<a href="/cart/${name}">${products[name].title}</a>
		</li>`
	}
	res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart/:id', function(req, res){

	var id = req.params.id;
	if(req.signedCookies.cart) {
		var cart = req.signedCookies.cart;
	} else {
		var cart = {};
	}

	if(!cart[id]){
		cart[id] = 0;
	}

	cart[id] = parseInt(cart[id])+1;
	res.cookie('cart', cart, {signed:true}); // cart이라는 이름으로 쿠키 저장
	res.redirect('/cart');
});

app.get('/cart', function(req, res){
	var cart = req.signedCookies.cart;

	if(!cart) {
		res.rend('Empty!');
	} else {
		var output = '';
		for(var id in cart){
			output += `<li>${products[id].title} (${cart[id]}) <a href="/delete/${id}">delete</a></li>`;
		}
	}
	res.send(`
		<h1>Cart</h1>
		<ul>${output}</ul>
		<a href="/products">Products List</a>
	`);
});

app.get('/delete/:id', function(req, res){
	var id = req.params.id;
	var cart = req.signedCookies.cart;
	cart[id] = 0;
	res.cookie('cart', cart, {signed:true}); // cart이라는 이름으로 쿠키 저장
	res.redirect('/cart');
});

app.get('/count', function(req, res){

	//if(req.cookies.count) var count = parseInt(req.cookies.count);
	if(req.signedCookies.count) var count = parseInt(req.signedCookies.count); //signedCookies 암호화
	else var count = 0;

	count = count + 1;
	res.cookie('count', count, {signed:true}); // app.use(cookieParser()); 명령어에 의해 res(응답)안에 cookie함수가 생김
	res.send('count : ' + req.cookies.count);
});

app.listen(1331, function(){
	console.log('Connected 1331 port!!!');
});