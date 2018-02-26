


// 생성자 함수를 선언합니다.
var counter = 0;
function Product(name, image, price, count) {
	this.index = counter++;
	this.name = name;
	this.image = image;
	this.price = price;
	this.count = count;
}

// 변수를 선언합니다.
var products = [
	new Product('JavaScript', 'chrome.png', 28000, 30),
	new Product('jQuery', 'chrome.png', 28000, 30),
	new Product('Node.js', 'chrome.png', 32000, 30),
	new Product('Socket.io', 'chrome.png', 17000, 30),
	new Product('Connect', 'chrome.png', 18000, 30),
	new Product('Express', 'chrome.png', 31000, 30),
	new Product('EJS', 'chrome.png', 12000, 30)
];

var app = require('./config/express')();
var passport = require('./config/passport')(app);

var auth = require('./routes/auth')(passport);
// auth로 접근 하는 모든 요청에 대해서 auth라는 라이터가 처리하도록 위임
app.use('/auth/', auth);

var pay = require('./routes/pay')(products);
app.use('/', pay);

var socket = require('./config/socket')(app, products);

// 웹 서버를 실행합니다.
socket.listen(1331, function(){
	console.log('Success 1331 Port Connect');
});




