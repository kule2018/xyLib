
module('window.xy');




test('工具函数:',function(){
	ok( xy.isArray([]) , 'isArray ok');
	ok( xy.isString('') , 'isString ok');
	ok( xy.isNumber(12.2) , 'isNumber ok');
	ok( xy.isFunction(function(){}) , 'isFunction ok');
	ok( xy.isObject({}) , 'isObject ok');
	ok( xy.isElement(window.document.body) , 'isElement ok');
	equal( xy.typeOf([]) , 'Array', 'typeOf ok');
	ok( !xy.isIE() , 'isIE ok');

	var subObj = {'Name':'XueYou', 'Age':21};
	var superObj = {'Name':'jay'};
	deepEqual(xy.expandClass(superObj, subObj, true), subObj, 'expandClass ok'  );

	deepEqual(xy.clone(subObj), subObj, 'clone ok');


	var ClassA = function(){
		this.Name = 'XueYou';
		this.Age = 21;
	};
	ClassA.prototype = {
		getName:function(){ return this.Name; }
	};

	var ClassB = function(){
		ClassA.call(this);
	};
	xy.extend(ClassB, ClassA);
	var cb = new ClassB();







	ok(cb['Age'] === 21 && cb['Name'] === 'XueYou' && cb.getName() === 'XueYou', 'extend ok');


	ok( xy.isNumber(xy.random(5,20)), 'random ok'  );

	ok( !xy.isMobileUserAgent(), 'isMobileUserAgent ok'  );



});


test('字符串函数:', function(){

	ok(xy.trim(' 1 5 6 ') === '1 5 6', 'trim ok');
	ok(xy.check_range(' Xue You ', 6, 12), 'check_range ok');
	ok(xy.isEmail('chenlovekiss@126.com'), 'isEmail ok');
	ok(xy.isInteger(12), 'isInteger ok');
	ok(xy.isDate('1993/10/19'), 'isDate ok');
	ok(xy.isNum(33), 'isNum ok');
	ok(xy.startWith('get', 'G', true), 'startWith ok');
	ok(xy.endWith('geg s ge', 'Ge', true), 'startWith ok');


	ok( xy.isString(xy.formatCss('#home-page-widgets {   padding: 0; color: #fff; background-color: #D9534F;}')) , 'formatCss ok' );

	equal(xy.base64_decode('5aiD5ZOI5ZOI'), '娃哈哈', 'base64_decode ok');

	ok(xy.isValidPost('430100'), 'isValidPost ok');

	ok(xy.isValidReg('●'), 'isValidReg ok');

	equal(xy.uncamelize('backgroundColor'), 'background-color', 'uncamelize ok');

	equal(xy.camelize('background-color'), 'backgroundColor', 'camelize ok');

	equal(xy.repeat('我',5,'-'), '我-我-我-我-我', 'repeat ok');

	equal(xy.repeatS('我',5), '我我我我我', 'repeatS ok');

	equal(xy.byteLen('我哈哈wohaha'), 12, 'byteLen ok');

	equal(xy.ellipsis('今天是一个早上,天气真好!', 9), '今天是一个早...', 'ellipsis ok');

	equal(xy.pad('我A', 4, '0'), '我A00', 'pad ok');



});

test('本地存储:', function(){

	xy.cookie.set('Name','XueYou');
	xy.cookie.set('Age','21');
	ok( xy.cookie.get('Name') === 'XueYou', 'cookie.set/get  ok'  );
	xy.cookie.remove('Name');
	ok( xy.cookie.get('Name') === null, 'cookie.remove  ok'  );
	ok( xy.cookie.getLength() === 1, 'cookie.getLength  ok'  );






});



test('数组函数:', function(){

	var arr = [2,5,9,14,73,4,326];

	deepEqual(xy.insertionSort(arr), [2,4,5,9,14,73,326], 'insertionSort ok');

	deepEqual(xy.binaryInsertionSort(arr), [2,4,5,9,14,73,326], 'insertionSort ok');


});



module('JSON');


test('加密/解密', function(){

	var obj = {'Name':'XueYou', 'Age':21, 'arr': [1,2, {'3':'is 3'}]};
	var str = '{"Name":"XueYou","Age":21,"arr":[1,2,{"3":"is 3"}]}';
	deepEqual(JSON.stringify(obj), '{"Name":"XueYou","Age":21,"arr":[1,2,{"3":"is 3"}]}', 'JSON.stringify ok');
	deepEqual(JSON.parse(str), obj, 'JSON.parse ok');
});















