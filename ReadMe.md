# xyLib 文档

标签（空格分隔）： js库

---

[TOC]


## 使用须知
 1. [] 中的参数为可选参数
 2. 此文件加载需要在body闭合标签前,而不要放在head中,因为那个时候window.document.body还未生成
 3. 更新日期: 2015-4-14
 4. 版本 0.351
 



## API
    
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
 
