// utilFormat.js

var util = require('util');
var data = util.format('%d, %s, %j', 10, 'abc', { name: 'node.js'});

console.log(data);

// ��� ���
// 10, abc, {"name":"node.js"}