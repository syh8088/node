var fs = require('fs');

// Sync
console.log("Sync");
var data = fs.readFileSync('test.txt', {encoding: 'utf8'});
console.log(data);

// Async
console.log("Async");
console.log("비동기 순서 1");
fs.readFile('test.txt', {encoding: 'utf8'}, function(err, data){
	console.log("비동기 순서 3");
	console.log(data);
});
console.log("비동기 순서 2");