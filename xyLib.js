/**
 * Created by XueYou on 2015/4/9.
 */

/**
 * Class:
    * xy
 * Version:
    * 0.3.51
 * UpDate:
    * 2015/4/14 15:15:
 * Explanation:
 */


(function(xy, undefined){

    'use strict';


    /**
     * 功能: 类型检测模版
     * 参数: obj Type:object, [str Type:String]
     * 说明: 给入对象极其断言类型, 不传入str参数则返回对象类型
     */
    function _Template_Type(obj,str){
        // 参数检测
        if(_checkPar(obj)){return false;}
        var _str = Object.prototype.toString.apply(obj);
        _str.slice(8,_str.length-1);
        // 返回类型
        if(arguments.length === 1){return _str.match(/\s(\w+)]/)[1];}
        // 断言类型
        if(arguments.length === 2){return !(_str.indexOf(str) === -1);}

    }
    /*TODO =========================工具函数*/
    var tool = {
        isArray:function(value){
            return _Template_Type(value,'Array');
        },
        isString:function(value){
            return _Template_Type(value,'String');
        },
        isNumber:function(value){
            return _Template_Type(value,'Number');
        },
        isFunction:function(value){
            return _Template_Type(value,'Function');
        },
        isObject:function(value){
            return _Template_Type(value,'Object');
        },
        isElement:function(value){
            if(_checkPar(value)){return false;}
            return Object.prototype.hasOwnProperty.call(value, 'nodeType') || value.nodeType == 1;
        },
        typeOf:function(value){
            return  _Template_Type(value);
        },
        isIE:function(ver){
            var b = document.createElement('b');
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
            return b.getElementsByTagName('i').length === 1
        },
        /**
         * 功能: 扩展类
         * 参数: superClass Type:object, subClass Type:object, isCover Type:Boolean
         * 说明: 将subClass子类功能扩展到superClass基类 isCover规定是否覆盖之前的同名函数
         */
        expandClass:function(superClass,subClass, isCover){
            isCover = !(!isCover);
            if(_checkPar([superClass,subClass]) ||  !this.isObject(subClass) ){_showErr(ErrType.PARAMETER);return false;}
            for(var key in subClass){
                if(subClass.hasOwnProperty(key) ){
                    var cover = true;
                    if(superClass.hasOwnProperty(key)){
                        cover = (isCover || this.isIE() );
                    }
                    if(cover){
                        superClass[key] = subClass[key];
                    }

                }
            }
            return superClass;
        },
        /**
         * 功能: 克隆类
         * 参数: object Type:object
         * 说明: 浅度克隆一个对象
         */
        clone:function(object){
            if(!this.isObject(object)){ _showErr(ErrType.TYPEERROR); return;}
            function F(){}
            F.prototype = object;
            return new F;
        },
        /**
         * 功能: 原型继承
         * 参数: subClass Type:object, superClass Type:object
         * 说明: subClass的原型继承与superClass, subClass先要用call复制
         */
        extend:function(subClass, superClass){
            // 参数检测
            if(_checkPar([subClass, superClass])){return false;}

            var F = function(){};
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;
            subClass.superclass = superClass.prototype;
            if(superClass.prototype.constructor == Object.prototype.constructor){
                superClass.prototype.constructor = superClass;
            }
        },
        /**
         * 功能: 取随机数
         * 参数: min Type:Number, max Type:Number
         * 说明: 返回2个参数之间的随机数, min > max 则自动调换位置
         */
        random:function(min,max){
            if(!tool.isNumber(min) || !tool.isNumber(max)){ _showErr(ErrType.TYPEERROR); return false;}
            max += 1;
            if(min > max){
                var s = max;
                max = min;
                min = s;
            }

            return Math.floor(min+Math.random()*(max-min));
        },
        /**
         * 功能: 取渐变色
         * 参数: from Type:RGBObject, to Type:RGBObject, callback Type:Function, [duration Type:Number], [framesPerSecond Type:Number],
         * 说明: 渐变调用回调函数. RGBObject类型为 {r:55,g:189,b:255}, duration 花费时间,单位为秒, framesPerSecond 帧数 如同游戏一样 60 越高就流畅
         */
        gradientColor:function(from, to, callback, duration, framesPerSecond){
            if(_checkPar([from, to, callback])){return;}
            function doTimeout(color,frame) {
                setTimeout(function() {
                    try {
                        callback(color);
                    } catch(e) {
                        throw new Error(e);
                    }
                }, (durations*1000/framesPerSeconds)*frame);
            }
            var durations = duration || 3;
            var framesPerSeconds = framesPerSecond || durations*15;

            var r,g,b;
            var frame = 1;

            doTimeout('rgb(' + from.r + ',' + from.g + ',' + from.b + ')',0);

            while (frame < framesPerSeconds+1) {
                r = Math.ceil(from.r * ((framesPerSeconds-frame)/framesPerSeconds)
                + to.r * (frame/framesPerSeconds));
                g = Math.ceil(from.g * ((framesPerSeconds-frame)/framesPerSeconds)
                + to.g * (frame/framesPerSeconds));
                b = Math.ceil(from.b * ((framesPerSeconds-frame)/framesPerSeconds)
                + to.b * (frame/framesPerSeconds));
                doTimeout('rgb(' + r + ',' + g + ',' + b + ')',frame);
                frame++;
            }
        },
        /**
         * 功能: 遍历数组
         * 参数: arr Type:Array backCall Type:Function that Type:Object
         * 说明: 遍历数组并调用回调函数
         */
        forEach:function(arr, backCall, that){

            // 参数检查
            if(!tool.isFunction(backCall) || !arr.length ){_showErr(ErrType.TYPEERROR); return arr;}

            for(var i=0,len=arr.length;i< len; ++i){
                if(that){backCall.call(that,arr[i],i);}
                else{backCall(arr[i],i);}
            }
        },
        /**
         * 功能: 遍历对象
         * 参数: obj Type:Object backCall Type:Function that Type:Object
         * 说明: 遍历对象并调用回调函数
         */
        _Loop_obj: function (obj, backCall, that) {
            if (!tool.isFunction(backCall)) {return false;}
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    backCall.call(that?that:obj, key, obj[key]);
                }
            }
        },
        /**
         * 功能: 是否为移动设备
         * 参数:
         * 说明: 返回布尔值
         */
        isMobileUserAgent:function(){
            return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
        },
        /**
         * 功能: 节流函数, 使频繁调用的函数节流
         * 使用: var lazyLayout = debounce(calculateLayout, 300);  $(window).resize(lazyLayout);
         * @param: {[Function]}  func           [回调函数]
         * @param: {[Number]}  wait           [等待时长]
         * @return: {[Function]}               [返回包装后的参数func]
         */
        debounce:function(func, wait){
            var context, args, timeout, result, previous, later;
            previous = 0;
            later = function() {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date(),
                    remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {   //如果大于间隔时间（wait）
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {  //小于，延时调用later
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        /**
         * 功能: 将obj的属性放置到数组
         * 使用:
         * @param: {[Object]}  obj           [要遍历的对象]
         * @return: {[Array]}               [返回数组,成员都是obj对象的属性名]
         */
        objNameToArr:function(obj){
            var a=[];
            for(a[a.length] in obj){};
            return a;
        }
    };
    tool.expandClass(xy, tool);









    /*TODO =========================字符串函数*/
    var xyString = {

        /**
         * 功能: 去除首尾空格
         * 参数: str Type:String
         * 说明: 返回去除首尾空格后的字符串副本
         */
        trim:function(str){
            if(!tool.isString(str)){_showErr(ErrType.TYPEERROR); return '';}
            var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;    //Ext.js提供的正则
            if (str) {
                str = str.replace(trimRegex, "");
            }
            return str || '';
        },
        /**
         * 功能: 验证字符串字符个数范围
         * 参数: str Type:String, lt Type:Number, gt Type:Number
         * 说明: 返回布尔值
         */
        check_range:function(str, lt, gt){
            if(xyString.trim(str).length < lt){
                return false;
            }
            if(xyString.trim(str).length > gt){
                return false;
            }else{

            }

            return true;
        },
        /**
         * 功能: 验证邮箱
         * 参数: str Type:String
         * 说明: 返回布尔值
         */
        isEmail:function(str){
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            return reg.test(str);
        },
        /**
         * 功能: 验证整数
         * 参数: str Type:String
         * 说明: 返回布尔值
         */
        isInteger:function(str){
            var regu = /^[-]{0,1}[0-9]{1,}$/;
            return regu.test(str);

        },
        /**
         * 功能: 验证日期
         * 参数: str Type:String
         * 说明: 返回布尔值
         */
        isDate:function(str){

            if(xyString.trim(str)=="") return false;

            //年月日正则表达式
            var r=str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

            if(r==null){return false;}
            var d=new Date(r[1],r[3]-1,r[4]);
            var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
            if(num==0){return false;}

            return (num!=0);

        },
        /**
         * 功能: 验证正整数
         * 参数: str Type:String
         * 说明: 返回布尔值
         */
        isNum:function(str){
            var reg = /^[1-9]\d*$/;
            return reg.test(str);
        },
        /**
         * 功能: 判断是否以某个字母开头
         * 参数: str Type:String, key Type:String ignoreCase Type:Boolean
         * 说明: 返回布尔值, ignoreCase 用来标志是否忽略大小写
         */
        startWith:function(str, key, ignoreCase){

            var flag = ignoreCase ? 'i' : null;
            var result = str.match(new RegExp(key,flag));

            if(result){
                return result.index == 0;
            }else{
                return false;
            }


        },
        /**
         * 功能: 判断是否以某个字母结尾
         * 参数: str Type:String, key Type:String ignoreCase Type:Boolean
         * 说明: 返回布尔值, ignoreCase 用来标志是否忽略大小写
         */
        endWith:function(str, key, ignoreCase){

            var flag = ignoreCase ? 'ig' : 'g';
            var reg = new RegExp(key,flag);
            var lastIndex = 0;

            do {
                lastIndex = reg.lastIndex;
                reg.exec(str);
            }while(reg.lastIndex !== 0);

            return lastIndex === str.length;


        },
        /**
         * 功能: 格式化CSS样式
         * 参数: str Type:String
         * 说明: 返回格式化后的CSS样式
         */
        formatCss:function(str){
            str = str.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
            str = str.replace(/;\s*;/g, ";");
            str = str.replace(/\,[\s\.\#\d]*\{/g, "{");
            str = str.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
            str = str.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
            str = str.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
            return str;
        },
        /**
         * 功能: 压缩CSS样式
         * 参数: str Type:String
         * 说明: 返回压缩后的CSS样式
         */
        compressCss:function(str){
            str = str.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
            str = str.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
            str = str.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
            str = str.replace(/;\s*;/g, ";"); //清除连续分号
            str = str.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
            return (str == null) ? "" : s[1];
        },
        /**
         * 功能: 是否为网址
         * 参数: str Type:String
         * 说明: 返回布尔值
         */
        isUrl:function(str){
            var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i;
            return regular.test(str);
        },
        /**
         * 功能: 随机数时间戳
         * 参数:
         * 说明: 返回时间戳字符串
         */
        uniqueId:function(){
            var a=Math.random,b=parseInt;
            return Number(new Date()).toString()+b(10*a())+b(10*a())+b(10*a());
        },
        /**
         * 功能: 全角半角转换
         * 参数: sStr Type:String, iCase Type:Number
         * 说明: 返回转换后字符串, iCase=0 全角到半角 ,  iCase=1 半角到全角
         */
        chgCase:function(sStr,iCase){
            if(typeof sStr != "string" || sStr.length <= 0 || !(iCase === 0 || iCase == 1)){
                return sStr;
            }
            var i,oRs=[],iCode;
            if(iCase){/*半->全*/
                for(i=0; i<sStr.length;i+=1){
                    iCode = sStr.charCodeAt(i);
                    if(iCode == 32){
                        iCode = 12288;
                    }else if(iCode < 127){
                        iCode += 65248;
                    }
                    oRs.push(String.fromCharCode(iCode));
                }
            }else{/*全->半*/
                for(i=0; i<sStr.length;i+=1){
                    iCode = sStr.charCodeAt(i);
                    if(iCode == 12288){
                        iCode = 32;
                    }else if(iCode > 65280 && iCode < 65375){
                        iCode -= 65248;
                    }
                    oRs.push(String.fromCharCode(iCode));
                }
            }
            return oRs.join("");
        },
        /**
         * 功能: 格式化日期
         * 参数: date Type:Date  format Type:String
         * 说明: new Date().format("yyyy-MM-dd hh:mm:ss")
         */
        formatDate:function(date, format){
            var o = {
                "M+" : date.getMonth()+1, //month
                "d+" : date.getDate(),    //day
                "h+" : date.getHours(),   //hour
                "m+" : date.getMinutes(), //minute
                "s+" : date.getSeconds(), //second
                "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
                "S" : date.getMilliseconds() //millisecond
            };
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o){
                if(o.hasOwnProperty(k)){
                    if(new RegExp("("+ k +")").test(format)){
                        format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
                    }

                }

            }
            return format;
        },
        /**
         * 功能: 获取页面中所有A标签的链接地址
         * 参数:
         * 说明: 返回所有链接
         */
        getAllLink:function(){
            return   document.body.innerHTML.match(/(url\(|src=|href=)[\"\']*([^\"\'\(\)\<\>\[\] ]+)[\"\'\)]*|(http:\/\/[\w\-\.]+[^\"\'\(\)\<\>\[\] ]+)/ig).join("\r\n").replace(/^(src=|href=|url\()[\"\']*|[\"\'\>\) ]*$/igm,"");
        },
        /**
         * 功能: 字符串反序
         * 参数: str Type:String
         * 说明: 返回反序后的字符串
         */
        reverse:function(str){
            return str.split('').reverse().join('');
        },
        /**
         * 功能: base64解码
         * 参数: data Type:String
         * 说明: 返回解码后的字符串
         */
        base64_decode:function(data){
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,ac = 0,dec = "",tmp_arr = [];
            if (!data) { return data; }
            data += '';
            do {
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));
                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;
                if (h3 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);
            dec = tmp_arr.join('');
            dec = xyString.utf8_decode(dec);
            return dec;
        },
        /**
         * 功能: utf8解码
         * 参数: str_data Type:String
         * 说明: 返回解码后的字符串
         */
        utf8_decode:function(str_data){
            var tmp_arr = [],i = 0,ac = 0,c1 = 0,c2 = 0,c3 = 0;str_data += '';
            while (i < str_data.length) {
                c1 = str_data.charCodeAt(i);
                if (c1 < 128) {
                    tmp_arr[ac++] = String.fromCharCode(c1);
                    i++;
                } else if (c1 > 191 && c1 < 224) {
                    c2 = str_data.charCodeAt(i + 1);
                    tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = str_data.charCodeAt(i + 1);
                    c3 = str_data.charCodeAt(i + 2);
                    tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return tmp_arr.join('');
        },
        /**
         * 功能: 判断是否邮政编码
         * 参数: str Type:String
         * 说明: 返回布尔值
         */
        isValidPost:function(str){
            var re=/^\d{6}$/;
            return !(str.match(re) == null);

        },
        /**
         * 功能: 判断是否危险字符
         * 参数: chars Type:String
         * 说明: 返回布尔值
         */
        isValidReg:function(chars){
            var re=/<|>|\[|\]|\{|\}|『|』|※|○|●|◎|§|△|▲|☆|★|◇|◆|□|▼|㊣|﹋|⊕|⊙|〒|ㄅ|ㄆ|ㄇ|ㄈ|ㄉ|ㄊ|ㄋ|ㄌ|ㄍ|ㄎ|ㄏ|ㄐ|ㄑ|ㄒ|ㄓ|ㄔ|ㄕ|ㄖ|ㄗ|ㄘ|ㄙ|ㄚ|ㄛ|ㄜ|ㄝ|ㄞ|ㄟ|ㄢ|ㄣ|ㄤ|ㄥ|ㄦ|ㄧ|ㄨ|ㄩ|■|▄|▆|\*|@|#|\^|\\/;
            return (re.test( chars) == true);
        },
        /**
         * 功能: 驼峰式转为普通式
         * 参数: s Type:String
         * 说明: 返回布尔值
         */
        uncamelize:function(s){
            return s.replace(/[A-Z]/g,function (c) {
                return '-'+c.charAt(0).toLowerCase();
            });
        },
        /**
         * 功能: 将CSS属性名转换成驼峰式
         * 参数: string Type:String
         * 说明: 返回一个字符串的驼峰书写形式
         */
        camelize:function(string){
            if(string.indexOf("-") < 0 && string.indexOf("_") < 0) {
                return string;   //直接返回
            }
            return string.replace(/[-_][^-_]/g, function(match) {   //对 "_" 、"-" 及其紧跟的一个字符进行匹配
                return match.charAt(1).toUpperCase();
            })
        },
        /**
         * 功能: 重复字符串
         * 参数: target Type:String,  n Type:Number, sep Type:String,
         * 说明: 根据给定的格式字符串与指定的重复次数返回一个新的格式字符串，n：一共重复几次，sep(可选)：重复字符串连接方式，默认“”;返回string
         */
        repeat:function(target, n, sep){
            n = n < 0 ? 0 : n;
            for(var buf=[]; n > 0; n--){
                buf.push(target);
            }
            return buf.join(sep || "");
        },
        /**
         * 功能: 重复字符串(高效2分法)
         * 参数: target Type:String,  n Type:Number
         * 说明: 根据给定的格式字符串与指定的重复次数返回一个新的格式字符串，n：一共重复几次，;返回string
         */
        repeatS:function(target, n){
            var s = target,
                total = "";
            while (n > 0) {
                if (n % 2 == 1){
                    total += s;
                }
                if (n == 1) {
                    break;
                }
                s += s;
                n = n >> 1;    //相当于将n除以2取商
            }
            return total;
        },
        /**
         * 功能: 获取字符串长度
         * 参数: string Type:String,  fix Type:Number
         * 说明: 获取一个字符串的字节长度，string指定字符串，fix(可选)规定一个中文字符占几个字节，默认2个
         */
        byteLen:function(string, fix){
            fix = fix ? fix : 2;
            var str = new Array(fix + 1).join("-");
            return string.replace(/[^\x00-\xff]/g,str).length;  //将汉字全部替换成 -- 之类的,然后查看长度
        },
        /**
         * 功能: 裁剪字符串
         * 参数: string Type:String,  len Type:Number,  escripe Type:String,
         * 说明: 对大于指定长度的字符串，进行裁剪，增加省略号('...')的显示; string指定字符串，len总长度，默认30，escripe(可选)指定增加的符号默认“...”：
         */
        ellipsis:function(string, len, escripe){
            len = len || 30;  //默认30截去
            escripe = escripe === void 0 ? "..." : escripe;
            return string.length > len ? string.slice(0, len - escripe.length) + escripe : string;
        },
        /**
         * 功能: 填充字符串
         * 参数: string Type:String,  len Type:Number,  fill Type:String,  direct Type:String,
         * 说明: string 指定字符串，len 填充后总长度（若小于给定字符串长度则不填充），fill(可选) 规定填充字符 默认"0"， direct(可选)规定填充方向 默认右侧填充 值："PAD_LEFT" "PAD_RIGHT"
         * 例子: pad("AA","4");  //"AA00",   pad("AA","4","-","PAD_LEFT"); //"--AA"
         */
        pad:function(string, len, fill, direct){
            fill = fill || "0";
            while(string.length < len) {     //和给定填充后长度对； Ext.js采用质朴长存法，这样就可以避免了每次计算string.length的麻烦
                if(direct === "PAD_LEFT") {
                    string = fill + string;
                }else{
                    string = string + fill;
                }
            }
            return string;
        }

    };
    tool.expandClass(xy, xyString);


    /*TODO =========================数组函数*/
    var arrString = {
        /**
         * 功能: 插入排序
         * 参数: array Type:Array
         * 说明: 插入排序（Insertion-Sort）的算法描述是一种简单直观的排序算法.
         * 时间: 最佳情况：输入数组按升序排列。T(n) = O(n); 最坏情况：输入数组按降序排列。T(n) = O(n2);  平均情况：T(n) = O(n2)
         */
        insertionSort:function(array){
            if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
                for (var i = 1; i < array.length; i++) {
                    var key = array[i];
                    var j = i - 1;
                    while (j >= 0 && array[j] > key) {
                        array[j + 1] = array[j];
                        j--;
                    }
                    array[j + 1] = key;
                }
                return array;
            } else {
                return 'array is not an Array!';
            }
        },
        /**
         * 功能: 二分插入排序
         * 参数: array Type:Array
         * 说明: 二分插入（Binary-insert-sort)排序是一种在直接插入排序算法上进行小改动的排序算法
         * 时间: 最佳情况：T(n) = O(nlogn); 最差情况：T(n) = O(n2);  平均情况：T(n) = O(n2);
         */
        binaryInsertionSort:function(array){
            if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
                for (var i = 1; i < array.length; i++) {
                    var key = array[i], left = 0, right = i - 1;
                    while (left <= right) {
                        var middle = parseInt((left + right) / 2);
                        if (key < array[middle]) {
                            right = middle - 1;
                        } else {
                            left = middle + 1;
                        }
                    }
                    for (var j = i - 1; j >= left; j--) {
                        array[j + 1] = array[j];
                    }
                    array[left] = key;
                }
                return array;
            } else {
                return 'array is not an Array!';
            }
        }

    };

    tool.expandClass(xy, arrString);


    /*TODO =========================Json  (封装自: https://github.com/douglascrockford/JSON-js)*/
    if (typeof JSON !== 'object') {JSON = {};}
    (function(){

        var rx_one = /^[\],:{}\s]*$/,
            rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rx_four = /(?:^|:|,)(?:\s*\[)+/g,
            rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;


        function f(n) {
            // Format integers to have at least two digits.
            return n < 10
                ? '0' + n
                : n;
        }

        function this_value() {
            return this.valueOf();
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z'
                    : null;
            };

            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON = this_value;
            String.prototype.toJSON = this_value;
        }


        var gap,
            indent,
            meta,
            rep;

        function quote(string) {



            rx_escapable.lastIndex = 0;
            return rx_escapable.test(string)
                ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"'
                : '"' + string + '"';
        }

        function str(key, holder) {


            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];



            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }


            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }



            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':



                    return isFinite(value)
                        ? String(value)
                        : 'null';

                case 'boolean':
                case 'null':



                    return String(value);



                case 'object':


                    if (!value) {
                        return 'null';
                    }


                    gap += indent;
                    partial = [];



                    if (Object.prototype.toString.apply(value) === '[object Array]') {




                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }



                        v = partial.length === 0
                            ? '[]'
                            : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }



                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                        gap
                                            ? ': '
                                            : ':'
                                    ) + v);
                                }
                            }
                        }
                    } else {



                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                        gap
                                            ? ': '
                                            : ':'
                                    ) + v);
                                }
                            }
                        }
                    }


                    v = partial.length === 0
                        ? '{}'
                        : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        /**
         * 功能: 对象转字符串
         * 参数: obj Type:Object
         * 说明: 返回反序列化后的字符串
         */
        if (typeof JSON.stringify !== 'function') {
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };
            JSON.stringify = function (value, replacer, space) {
                var i;
                gap = '';
                indent = '';

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                } else if (typeof space === 'string') {
                    indent = space;
                }

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }


                return str('', {'': value});
            };
        }
        /**
         * 功能: 字符串转对象
         * 参数: text Type:String
         * 说明: 返回序列化后的对象
         */
        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


                text = String(text);
                rx_dangerous.lastIndex = 0;
                if (rx_dangerous.test(text)) {
                    text = text.replace(rx_dangerous, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }


                if (
                    rx_one.test(
                        text
                            .replace(rx_two, '@')
                            .replace(rx_three, ']')
                            .replace(rx_four, '')
                    )
                ) {



                    j = eval('(' + text + ')');



                    return typeof reviver === 'function'
                        ? walk({'': j}, '')
                        : j;
                }


                throw new SyntaxError('JSON.parse');
            };
        }

    })();













    /*TODO start=========================接口*/
    /**
     * 功能: 接口类
     * 参数: name Type:String, methods Type: [String..]
     * 说明: 创建一个用于检测对象是否遵循的接口
     */
    var Interface = function(name,methods){

        // 拷贝实参
        var _methods = methods;
        var _name = name;

        // 参数检查
        if(arguments.length != 2){ _showErr('Message:创建接口失败! reason:需要2个参数, 参数1为任意接口名称字符串, 参数2为接口字符串数组'); }
        if( !tool.isString(_name)  || !tool.isArray(_methods)){_showErr(ErrType.TYPEERROR);}

        // 参数初始化
        this.methods = [];

        tool.forEach(_methods, function(method_Str){
            if(!tool.isString(method_Str)){_showErr('接口方法名称必须是字符串');}
            this.methods.push(method_Str);
        }, this);

    };
    /**
     * 功能: 测试接口
     * 参数: object Type:Object, arguments[index>1]:Interface
     * 说明: 创建一个用于检测对象是否遵循的接口
     */
    Interface.ensureImplements = function(object) {

        // 参数检查
        if (arguments.length < 2) {_showErr('ensureImplements参数过少, 保证第一个为要检测实例类,第二个为接口实例');}

        tool.forEach(arguments, function (arr, index) {
            if (index === 0) {return false;}
            if (arr.constructor !== Interface) {_showErr('要测试的必须是接口实例');}
            try{
                tool.forEach(arr.methods, function(method){
                    if (!object[method] || !tool.isFunction(object[method])) {_showErr('接口函数错误或缺失  : ' + '函数名称:' + method);}
                });
            }catch (error){
                console.log(error.message, error.stack);
            }

        });
    };
    /**
     * 功能: 测试接口
     * 参数: interFace Type:Interface, arguments[index>1]:Object
     * 说明: 一个接口测试多个类
     */
    Interface.ensureImplementsX = function(interFace){
        if(arguments.length < 2){ _showErr('ensureImplements参数过少, 保证第一个为要检测实例类,第二个为接口实例'); }
        tool.forEach(arguments,function(arr,index){
            if(index === 0){if(interFace.constructor !== Interface){_showErr('要测试的必须是接口实例');}return false;}

            tool.forEach(interFace.methods, function(method){
                if(!arr[method] || !tool.isFunction(arr[method])){
                    throw new Error('接口函数错误或缺失  : ' + '函数名称:'+ method   );
                }
            });



        } );









    };




    /*TODO =========================本地存储*/
    xy.cookie = (function(){

        // 标准存储
        function LocalSave(){}
        LocalSave.prototype = {
            /**
             * 功能: 设置值
             * 参数: name Type:String, value:String
             * 说明: 设置本地存储
             */
            set:function(name,value){
                if(_checkPar([name, value])){return false;}
                localStorage.setItem(name,value);
            },
            /**
             * 功能: 获取值
             * 参数: name Type:String
             * 说明: 获取本地存储
             */
            get:function(name){
                if(!tool.isString(name)){return false;}
                return localStorage.getItem(name);
            },
            /**
             * 功能: 移除值
             * 参数: name Type:String/Number
             * 说明: 移除本地存储
             */
            remove:function(name){

                if(arguments.length === 0){localStorage.clear();return false;}
                else{
                    if(tool.isNumber(name)){
                        localStorage.removeItem(localStorage.key(name));
                    }else {
                        localStorage.removeItem(name);
                    }
                }

            },
            /**
             * 功能: 获取本地存储类
             * 参数: 无
             * 说明:
             */
            _GetData:function(){
                return localStorage;
            },
            /**
             * 功能: 获取本地存储长度
             * 参数: 无
             * 说明:
             */
            getLength:function(){
                return localStorage.length;
            }
        };

        //老式存储
        function Cookie(){
            this._Data = {};
            this._Name = [];
            var that = this;
            (function(){
                if(document.cookie){
                    var arrCookie = document.cookie.split("; ");
                    for(var i=0,len=arrCookie.length;i< len; i++){
                        var arr=arrCookie[i].split("=");
                        that._Data[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
                        that._Name.push(decodeURIComponent(arr[0]));
                    }

                }

            })();
        }
        Cookie.prototype = {
            set:function(name,value,expiresHours){
                if(_checkPar([name,value])){return false;}
                var cookieString = encodeURIComponent(name)+"="+encodeURIComponent(value);
                this._Data[name] = value;
                if(expiresHours>0 && tool.isNumber(expiresHours)){
                    var date=new Date();
                    date.setUTCDate(date.getUTCDate() + expiresHours);
                    cookieString=cookieString+"; expires="+date.toUTCString();
                }
                document.cookie=cookieString;
            },
            get:function(name){
                if(_checkPar(arguments)){return false;}
                if(this._Data[name]){
                    return this._Data[name];
                }
                var strCookie=document.cookie;
                var arrCookie=strCookie.split("; ");
                var value = '';
                arrCookie._Loop_arr(function(o,i){
                    var arr = o.split("=");
                    if(arr[0] == encodeURIComponent(name))return decodeURIComponent(arr[1]);
                    if(i === name){
                        value = decodeURIComponent(arr[1]);
                    }

                });

                return value;
            },
            remove:function(name){
                if(_checkPar(arguments)){return false;}
                var date = new Date();
                date.setTime(date.getTime() - 10000);
                if(arguments.length === 0){
                    var strCookie=document.cookie;
                    var arrCookie=strCookie.split("; ");
                    arrCookie._Loop_arr(function(o){
                        var arr = o.split("=");
                        document.cookie = encodeURIComponent(arr[0]) + "=; expires=" + date.toGMTString();
                    },this);
                    this._Data = {};

                }else{

                    if(tool.isNumber(name)){
                        document.cookie = encodeURIComponent(this._Name[name]) + "=; expires=" + date.toGMTString();
                        delete  this._Data[this._Name[name]];

                    }else{

                        document.cookie = encodeURIComponent(name) + "=; expires=" + date.toGMTString();
                        delete this._Data[name];

                    }



                }


            },
            _GetData:function(){
                return this._Data;
            },
            getLength:function(){
                var len = 0;
                for(var x in this._Data){
                    if(this._Data.hasOwnProperty(x)){
                        len += 1;
                    }
                }
                return len;
            }
        };


        var _cookie = window.localStorage ? new LocalSave() : new Cookie();
        var cookie_methods = ['set','get','remove','_GetData','getLength'];
        var Cookie_face = new Interface('Cookie',cookie_methods);
        Interface.ensureImplements(_cookie ,Cookie_face);
        return _cookie;

    })();







    /*TODO =========================Ajax 操作*/
    xy.Ajax = function( settings ){

        var options = {
            'async': true,       //是否为异步请求
            'complete': null,     // 完成后的回调
            'contentType':'application/x-www-form-urlencoded',   // 内容编码类型
            'context': options,                  // 回调函数的this对象
            'data': '',                  // 发送的数据, 如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'
            'type': 'POST',
            'url': ''
        };

        tool.expandClass(options, settings, true);



        // 获取Ajax对象
        function GetXmlHttpObject() {
            var xmlHttp=null;

            try {
                // Firefox, Opera 8.0+, Safari
                xmlHttp=new XMLHttpRequest();
            }
            catch (e) {
                // Internet Explorer
                try
                {
                    // 加载微软最新版本的XMLHttpRequest 对象
                    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch (e)
                {
                    // 旧版
                    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
            }

            return xmlHttp;
        }
        var xmlHttp=GetXmlHttpObject();
        if (xmlHttp==null) {
            alert ("你的浏览器不支持Ajax技术!");
            return {};
        }


        // 将数据转换成对应字符串

        var data = "json=" + JSON.stringify(options.data);

        xmlHttp.onreadystatechange = function(){
            if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete" && xmlHttp.status==200 ) {
                if(tool.isFunction(options.complete)){
                    options.complete.call(options.context, xmlHttp.responseText);
                }
            }
        };

        if(options.type.toLocaleLowerCase() === 'get'){
            options.url += data;
        }

        xmlHttp.open(options.type,options.url,options.async);
        xmlHttp.setRequestHeader("Content-type",options.contentType);

        if(options.type.toLocaleLowerCase() === 'post'){
            xmlHttp.send(data);
        }




    };


    /*TODO =========================JQuery扩展/DOM 操作*/
    (function(){

        /**
         * 功能: 屏蔽右键菜单
         * 参数:
         * 说明: $('div').nocontextmenu();
         */
        $.fn.nocontextmenu = function(){
            this.bind('contextmenu',function(e){return false;});
        };

        /**
         * 功能: 返回页面顶部
         * 参数:
         * 说明: $('div').backTop();
         */
        $.fn.backTop = function(){
            var btn = this;
            var d = document.documentElement;
            var b = document.body;
            window.onscroll = set;
            btn.css({'display': "none"});
            var timer = null;

            btn.click(function(){
                btn.css({'display': "none"});
                window.onscroll = null;
                timer = setInterval(function() {
                    d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                    b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                    if ((d.scrollTop + b.scrollTop) == 0) clearInterval(timer, window.onscroll = set);
                }, 10);


            });


            function set() {

                btn.css({'display':(d.scrollTop + b.scrollTop > 100) ? 'block': "none"});
            }
        };



        (function(window, $, undefined){

            // 滑动定位功能
            // 此函数运行时候确保之前的文档都已经生成完毕
            $.fn.slideMenu = function( options ){


                // 待浮动元素
                var $ele = this;


                var defaults = {
                    wrapper: $(document),		// 父容器
                    active: 'fixed',			// 激活时触发的样式
                    package: 'slideMenu_container',	// 元素浮动开后, 原来的位置会被一个容器元素保留空间, 这就是那个容器的class
                    direction: 'top',			// 方向		 (top && left)
                    callback: null,				// 回调函数
                    gap: 10						// 与顶部的偏移
                };

                if(options){
                    xy.expandClass(defaults, options, true);
                }


                // 包裹
                if(! $ele.parent().hasClass(defaults.package) ){
                    var div = $('<div></div>').addClass(defaults.package).css({width: $ele.outerWidth(), height: $ele.outerHeight(), display: $ele.css('display') });
                    $ele.wrap(div);
                }


                if(xy.isIE(7) || xy.isIE(8) && defaults.wrapper[0] == document ){
                    window.onscroll = _scroll;

                }else{
                    // 挂接父容器滚动条事件
                    defaults.wrapper.bind('scroll', _scroll);
                }



                // 触发事件
                function _scroll (){

                    var that = this == document ? document.body : this;


                    if(xy.isIE() &&  this == document ){
                        that = document.documentElement;
                    }


                    // 获取顶部与父容器的差
                    var offset = ($ele.parent().offset()[defaults.direction]) - defaults.gap;

                    var scrollOffset = defaults.direction == 'top' ? that.scrollTop : that.scrollLeft;


                    if(scrollOffset >= offset){
                        $ele.addClass(defaults.active).css({'top': defaults.gap});
                        if( xy.isFunction(defaults.callback) ){
                            defaults.callback($ele);
                        }
                    }else{
                        $ele.removeClass(defaults.active);
                    }

                }



                return $ele;

            };






        })(window, jQuery);







        var dom = {
            /**
             * 功能: 获取页面总高度
             * 参数:
             * 说明: 返回Number类型
             */
            getPageHeight:function(){
                var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
                    ? a
                    : g.documentElement;
                return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
            },
            /**
             * 功能: 获取页面总宽度
             * 参数:
             * 说明: 返回Number类型
             */
            getPageWidth:function(){
                var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
                    ? a
                    : g.documentElement;
                return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
            },
            /**
             * 功能: 获取页面可视宽度
             * 参数:
             * 说明: 返回Number类型
             */
            getPageViewWidth:function(){
                var d = document, a = d.compatMode == "BackCompat"
                    ? d.body
                    : d.documentElement;
                return a.clientWidth;
            },
            /**
             * 功能: 获取页面可视高度
             * 参数:
             * 说明: 返回Number类型
             */
            getPageViewHeight:function(){
                var d = document, a = d.compatMode == "BackCompat"
                    ? d.body
                    : d.documentElement;
                return a.clientHeight;
            },

            /**
             * 功能: 获取页面横向滑动条滑动了多少
             * 参数:
             * 说明: 返回Number类型
             */
            getPageScrollLeft:function(){
                var a = document;
                return a.documentElement.scrollLeft || a.body.scrollLeft;
            },
            /**
             * 功能: 获取页面纵向滑动条滑动了多少
             * 参数:
             * 说明: 返回Number类型
             */
            getPageScrollTop:function(){
                var a = document;
                return a.documentElement.scrollTop || a.body.scrollTop;
            },
            /**
             * 功能: 挂接鼠标滚轮事件 (注意不是滚动条,而是鼠标滚轮事件)
             * 参数: callback Type:Function
             * 说明:
             */
            hookScroll: function(callBack){
                function handle(delta) {
                    if(!callBack){return;}
                    // 滚动事件后触发回调函数, delta 为正数则代表向下滚动
                    callBack(delta);
                }

                function wheel(event){

                    var delta = 0;
                    if (!event){
                        event = window.event;
                    }

                    if (event.wheelDelta) {
                        delta = event.wheelDelta/120;
                        if (window.opera) delta = -delta;
                    } else if (event.detail) {
                        delta = -event.detail/3;
                    }
                    if (delta){
                        handle(-delta);
                    }

                }
                // 挂接滚动条事件
                if (window.addEventListener){
                    window.addEventListener('DOMMouseScroll', wheel, false);
                    window.onmousewheel = document.onmousewheel = wheel;
                }else{
                    document.body.onmousewheel =wheel;
                }
            }


        };
        tool.expandClass(xy, dom);




    })();








    /*TODO =========================私有函数*/
    /**
     * 功能: 参数检测
     * 参数: 无
     * 说明: 检测参数列表是否为未定义或为空值
     */
    function _checkPar(arr){
        var flag = false;

        var _str = Object.prototype.toString.apply(arr);
        _str.slice(8,_str.length-1);

        if(_str.match(/\s(\w+)]/)[1] !== 'Array'){
            arr = [arr];
        }


        for(var i= 0, len=arr.length; i<len; ++i){
            if(arr[i] == undefined || arr[i] == null ){
                _showErr(ErrType.PARAMETER);
                flag = true;
            }
        }
        return flag;
    }




    /**
     * 功能: 错误输出
     * 参数: errMessage Type:String
     * 说明: 扔出异常, 异常字符串为errMessage
     */
    function ErrType() {}
    ErrType.PARAMETER = '传入参数为空或不完整,请检查参数';
    ErrType.TYPEERROR = '参数类型不匹配';
    function _showErr(errMessage){
        //throw new Error(errMessage);
        console.error(errMessage);
    }





})( window.xy = window.xy || {}, undefined );










