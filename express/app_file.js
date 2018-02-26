var express = require('express');

var multer = require('multer');
//var upload = multer({ dest : 'uploads/'}); //multer라는 함수를 옵션을 주면 업로드를 실행하면 받을수 있는 미드웨어를 리턴해줌
//dest(목적지) : {저장할 디렉토리}

var _storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
})

var upload = multer({ storage : _storage});

var fs = require('fs');
var app = express(); // 변수 express안에 함수를 실행해서 리턴된 값을 app변수에 담는다.

var bodyParser = require('body-parser'); // POST 방식의 body 값을 가져오기 위한 묘듈
// 사용자가 POST방식인 데이터가 있다면 body라는 객체를 bodyParser가 추가한다.
app.use(bodyParser.urlencoded({ extended: false}));

app.locals.pretty = true; // uglify 반대

app.set('views', './views_file');
app.set('view engine', 'jade'); // express에 jade를 사용한다고 선언

// ##########파일 업로드 START##########//
app.get('/upload', function(req, res){
	res.render('upload');
});

//upload.single('userfile') // 미들웨어이다. 함수가 실행하기전에 실행됨 사용자가 전송한것이 파일이 있다면 req에 파일이 추가?
app.post('/upload', upload.single('userfile'),  function(req, res){
	res.send('Uploaded' + req.file.filename);
	/*
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('data/' + title, description, function(err){
		if(err){
			res.status(500).send('Internal Server Error');
		} else {
			//res.send(title + ',' + description);
			res.redirect('/topic/' + title);
		}
	});
*/

});

// ##########파일 업로드 END##########//


app.get('/topic/new', function(req, res){
	fs.readdir('data', function(err, files){
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('new', {topics:files});
	});
});

app.get(['/topic', '/topic/:id'], function(req, res){
	fs.readdir('data', function(err, files){
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
		}

		var id = req.params.id;
		if(id) { // id값이 있을때 실행

			fs.readFile('data/' + id, 'UTF-8', function(err, data){
				if(err) {
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				//res.send(data);
				res.render('view', {topics:files, title:id, description:data});
			});

		} else {
			res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for Server'});
		}
	});
});


/*
app.get('/topic/:id', function(req, res){
	var id = req.params.id;

	fs.readdir('data', function(err, files){
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		fs.readFile('data/' + id, 'UTF-8', function(err, data){
			if(err) {
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			//res.send(data);
			res.render('view', {topics:files, title:id, description:data});
		});
	});
});
*/

app.post('/topic', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('data/' + title, description, function(err){
		if(err){
			res.status(500).send('Internal Server Error');
		} else {
			//res.send(title + ',' + description);
			res.redirect('/topic/' + title);
		}
	});
});

app.listen(1331, function(req, res){
	console.log('Conneted 1331 port!');
});