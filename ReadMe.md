# xyLib 文档

标签（空格分隔）： js库

---

[TOC]


- API
    - [工具函数](#tool "跳转到工具函数API")
    - [字符串函数](#string "跳转到字符串函数API")    
    - [cookie函数](#cookie "跳转到cookie函数API")    
    - [Ajax函数](#Ajax "跳转到Ajax函数API") 
    - [JQuery函数](#JQuery "跳转到JQuery扩展函数API") 
    - [DOM 函数](#DOM "跳转到DOM函数API")
    - [数组函数](#Array "跳转到数组函数API")


---------------------------------------



# **2015-5-6 var 1.0**
- 新增
    - 大量字符串常用函数

- 移除
    - 移除了X(),以及对应的DOM操作, 用JQuery代替

# **2015-5-7 var 1.1**
- 新增
    - slideMenu()滑动定位函数

------------------------------------------








## 使用须知
 1. [] 中的参数为可选参数
 2. 此文件加载需要在body闭合标签前,而不要放在head中,因为那个时候window.document.body还未生成
 3. 更新日期: 2015-4-14
 4. 版本 0.351



## API

<i id='tool'></i>
### 工具函数    (集成与 window.xy 对象)         

1. **isArray(value)** 
2. **isString(value)** 
3. **isNumber(value)** 
4. **isFunction(value)**
5. **isObject(value)**
6. **isElement(value)**
7. **typeOf(value)**
8. **isIE(ver)**
9. **expandClass(superClass,subClass, isCover)** 

 > 扩展类. 将subClass子类功能扩展到superClass基类 isCover规定是否覆盖之前的同名函数

10. **clone(object)** 

 > 浅度克隆一个对象

11. **extend(subClass, superClass)** 

 > subClass的原型继承与superClass, subClass先要用call复制

12. **random(min,max)**  

 > 返回2个参数之间的随机数, min > max 则自动调换位置

13. **gradientColor(from, to, callback, duration, framesPerSecond)** 

    ``` javascript 
    xy.gradientColor({r:55,g:189,b:255}, {r:0,g:19,b:55}, function(color){
        document.body.style.backgroundColor = color;
    }, 1, 45);
    
    /* duration 花费时间,单位为秒, framesPerSecond 帧数 如同游戏一样 60 越高就流畅 */
    ```

14. **forEach(arr, backCall, that)** 

 > 遍历数组并调用回调函数

15. **_Loop_obj(obj, backCall, that)** 

 > 遍历对象并调用回调函数

16. **isMobileUserAgent()**  

 > 是否为移动设备

17. **debounce(func, wait)**

 > 节流函数, 使频繁调用的函数节流

18. **objNameToArr(obj)**

 > 将obj的属性放置到数组







<i id='string'></i>
### 字符串函数  (集成与 window.xy 对象)
1. **trim(str)** 

 > 返回去除首尾空格后的字符串副本

2. **check_range(str, lt, gt)** 

 > 验证字符串字符个数范围

3. **isEmail(str)**  

 > 验证邮箱

4. **isInteger(str)**  

 > 验证整数

5. **isDate(str)**  

 > 验证日期

6. **isNum(str)**  

 > 验证正整数

7. **startWith(str, key, ignoreCase)** 

 > 判断是否以某个字母开头, ignoreCase 用来标志是否忽略大小写

8. **endWith(str, key, ignoreCase)** 

 > 判断是否以某个字母结尾, ignoreCase 用来标志是否忽略大小写
 
9. **formatCss(str)** 

 > 格式化CSS样式

10. **compressCss(str)** 

 > 压缩CSS样式
 
11. **isUrl(str)**  

 > 是否为网址
 
12. **uniqueId()**  

 > 随机数时间戳
 
13. **chgCase(sStr,iCase)** 

 > 全角半角转换, iCase=0 全角到半角 ,  iCase=1 半角到全角
 
14. **formatDate(date, format)** 

 > 格式化日期
 ``` javascript
    xy.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
 ```

15. **getAllLink()** 

 > 获取页面中所有A标签的链接地址

16. **reverse(str)** 

 > 字符串反序

17. **base64_decode(data)**  

 > base64解码

18. **utf8_decode(str_data)**  

 > utf8解码
 
19. **isValidPost(str)** 

 > 判断是否邮政编码

20. **isValidReg(chars)** 

 > 判断是否危险字符

21. **uncamelize(s)**

 > 将CSS属性名由驼峰式转为普通式

22. **camelize(string)**

 > 返回一个字符串的驼峰书写形式

23. **repeat(target, n, sep)**

 > 根据给定的格式字符串与指定的重复次数返回一个新的格式字符串，n：一共重复几次，sep(可选)：重复字符串连接方式，默认“”;返回string

24. **repeatS(target, n)** 

 > (高效2分法) 根据给定的格式字符串与指定的重复次数返回一个新的格式字符串，n：一共重复几次，;返回string

25. **byteLen(string, fix)**

 > 获取一个字符串的字节长度，string指定字符串，fix(可选)规定一个中文字符占几个字节，默认2个

26. **ellipsis(string, len, escripe)** 

 > 对大于指定长度的字符串，进行裁剪，增加省略号('...')的显示; string指定字符串，len总长度，默认30，escripe(可选)指定增加的符号默认“...”：

27. **pad(string, len, fill, direct)** 

 > string 指定字符串，len 填充后总长度（若小于给定字符串长度则不填充），fill(可选) 规定填充字符 默认"0"， direct(可选)规定填充方向 默认右侧填充 值："PAD_LEFT" "PAD_RIGHT"

 
<i id='JSON'></i> 
### JSON函数  (集成与 JSON 对象)
1. **stringify(value, [replacer], [space])**    

 > 对象转Json字符串
 
2. **parse(text, [reviver])**  

 > Json字符串转对象
 
 
 
 
 
 
<i id='cookie'></i> 
### cookie函数  (集成与 xy.cookie 对象)


1. **set(name, value)**    

 > 设置值
 
2. **get(name)**

 > 获取值
 
3. **remove(name)** 

 > 移除值 , 不填写参数则清除所有

4. **_GetData()**

 > 获取本地存储对象
 
5. **getLength()**

 > 获取长度









<i id='Ajax'></i> 
### Ajax  (集成与 xy.Ajax 对象)
 
> 默认参数 

``` javascript

            var options = {
                'async': true,       //是否为异步请求
                'complete': null,     // 完成后的回调
                'contentType':'application/x-www-form-urlencoded',   // 内容编码类型
                'context': options,                  // 回调函数的this对象
                'data': '',                  
                'type': 'POST',
                'url': ''
            };


> 使用

            xy.Ajax({
                'url':'index.php',
                'data': {'Name':'XueYou'},
                'complete': function(data){
                    document.getElementById("txtHint").innerHTML= data;
                }
            });
            
            /* 这里发送的数据 data, 将被转换成Json字符串.并用json字符串包裹发给服务器  {json=被转换的json数据字符串} */

```






<i id='JQuery'></i> 
### JQuery扩展

1. **JQuery.nocontextmenu()**   

 > 屏蔽右键菜单 $('div').nocontextmenu();  页面的所有div都不能右键了
 
2. **JQuery.backTop()** 

 > 返回页面顶部
 
3. **JQuery.slideMenu(options)**

 > 滑动定位功能
 
 
 
 
<i id='DOM'></i> 
### DOM 操作 (集成与 window.xy 对象)

1. **getPageHeight()**  

 > 获取页面总高度

2. **getPageWidth()** 

 > 获取页面总宽度

3. **getPageViewWidth()**

 > 获取页面可视宽度

4. **getPageViewHeight()**

 > 获取页面可视高度

5. **getPageScrollLeft()** 

 > 获取页面横向滑动条滑动了多少
 
6. **getPageScrollTop()**

 > 获取页面纵向滑动条滑动了多少
 
7. **hookScroll(callBack)**
 > 挂接鼠标滚轮事件. 回调函数的参数为正数则代表向下滚动


 
 
 
<i id='Array'></i>
### 数组操作 (集成与 window.xy 对象)
 
1. **insertionSort(array)**

  > 插入排序
 
2. **insertionSort(array)**

  > 二分插入排序


 
 
 
 
