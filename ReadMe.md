*推荐使用 emEditor编辑器打开, 并开启大纲显示
*最后更新与 2015-4-14
*版本0.3.51
*[] 中的参数为可选参数
*此文件加载需要在body闭合标签前,而不要放在head中,因为那个时候window.document.body还未生成
*前缀●代表此函数已经过 chrome,ie7,8,9 测试


## xyLib.js	

工具函数
 ●isArray(value)		-值是否为数组		返回布尔值		
 ●isString(value)		-值是否为字符串		返回布尔值		
 ●isNumber(value)	-值是否为数字		返回布尔值		
 ●isFunction(value)	-值是否为函数		返回布尔值		
 ●isObject(value)		-值是否为对象		返回布尔值			
 ●isElement(value)	-值是否为DOM元素	返回布尔值		
 ●typeOf(value)		-判断值类型.  		返回字符串值		
 ●clone(object)		-克隆一个对象		返回克隆后的对象		
 ●isIE(ver)		-是否为IE浏览器,ver可设置指定版本	返回布尔值		
 ●random(min, max)	-返回最小到最大之间的数(包括最大和最小)	如果min大于max,会自动颠倒			
 ●expandClass(superClass,subClass, [isCover=false])	-将subClass子类功能扩展到superClass基类 isCover规定是否覆盖之前的同名函数,默认为false不覆盖(IE浏览器下始终覆盖)		返回以扩展的类
 ●gradientColor(from, to, callback, [duration], [framesPerSecond])	-设置渐变色 from和to {r:55,g:189,b:255} 颜色对象, callback有一个color参数,    duration 为渐变时间,单位秒, framesPerSecond每秒帧数,越大肯定越流畅
 ●extend(subClass, superClass)	-原型继承 subClass的原型继承与superClass, subClass先要用call复制superClass
 ●eachChildren(element, callback, isRecursive)	-遍历子元素 isRecursive为真则递归枚举所有子元素
 ●animate(x1, x2, callback, speed, overBack, type, way)	-调用回调函数来完成缓动动画





字符串函数[已包含入String原型中,直接使用]
 ●trim()			-去除首位空格		返回去除后字符串的副本


数组函数[已包含入Array原型中,直接使用]
 ●forEach(callback, that)	-遍历数组


对象函数[已包含入Object原型中,直接使用]
 ●_Loop_obj(backCall, that)			-遍历对象  回调函数参数: 键, 值




DOM类:
 X()

 #事件
  ●bind(eventStr, fuc, data, that);		-绑定事件
  ●unbind(eventStr, func);		-取消事件
  ●_Get_Info();				-获取当前元素的事件总详情


 #CSS操作
  ●addClass(className, callback)		-添加样式
  ●removeClass(className)		-移出样式
  ●hasClass(className)			-是否存在样式
  ●css(classObject)			-添加样式对象
 





接口类:
	创建:
	var cookie_methods = ['set','get','remove','_GetData','getLength'];  接口拥有的方法
	var Cookie_face = new Interface('Cookie',cookie_methods);	创建一个名为Cookie的接口
	检测:
	使用静态方法: 
	// 检测window.xy.cookie对象是否遵循 Cookie 接口, 以及省略号后的接口
	Interface.ensureImplements(window.xy.cookie ,Cookie_face, [...]);
	// 检测LocalSave,Cookie等实例 是否匹配Cookie_face接口
	Interface.ensureImplementsX(Cookie_face ,new LocalSave(),new Cookie() );











xy.cookie
	●set('name', value);		-设置本地存储的名称和值
	●get('name', value);		-获取值
	●remove(name);		-删除值,也可以根据下标(但是在localStorage中下标并不是顺序保存)
	●_GetData();			-返回存储对象




新增x方法获取元素
	x(select, parent)		-方法与jquery一样




