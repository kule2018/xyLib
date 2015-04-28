'use strict';
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
    * 下划线开头是私有函数
    * 使用X() 用法来操作DOM元素
    * []中的参数为可选参数

 */



if(!window.xy){

    +function(){


        window.xy = {};
        // 最终 X对象的原型
        var results = {};





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
        /*TODO =========================工具函数 (扩展 xy类)*/
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
                if(_checkPar(superClass,subClass) ||  !this.isObject(subClass) ){_showErr(ErrType.PARAMETER);return false;}
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
                if(!this.isObject(object)){return;}
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
                if(_checkPar(subClass) || _checkPar(superClass)){return false;}

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
             * 说明: 渐变调用回调函数. RGBObject类型为 {r:55,g:189,b:255}, duration 花费时间,但是为秒, framesPerSecond 帧数 如同游戏一样 60 越高就流程
             */
            gradientColor:function(from, to, callback, duration, framesPerSecond){
                if(_checkPar(from, to, callback)){return;}
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
             * 功能: 缓动动画
             * 参数: x1 Type:Number, x2 Type:Number, callback Type:Function, [speed Type:Number], [overBack Type:Function], [type Type:String], [way Type:String],
             * 说明: 调用回调函数来完成缓动动画, speed*10 = 为花费时间,  type 缓动方式, way 缓动类型
             */
            animate:function(x1, x2, callback, speed, overBack, type, way){

                // 参数初始化
                speed = speed || 100;
                type = type || 'Quart';
                way = way || 'easeIn';

                //参数检测
                if(!tool.isNumber(x1) || !tool.isNumber(x2) || !tool.isNumber(speed) || !tool.isFunction(callback) || !tool.isString(type) || !tool.isString(way)){_showErr(ErrType.TYPEERROR); return 0;}

                // 计数
                var t = 0;
                // 初始坐标
                var b = x1;
                // 2个坐标的偏移
                var c = x2 - x1 ;
                // 动画时间
                var d = speed;

                // 缓动算法函数
                var fun = Tween[type][way];




                function move() {

                    if(t < d){
                        t++;
                        x1 = fun(t, b, c, d);
                        if (callback != null) { callback(x1); }
                        setTimeout(move, 10);
                    }else{
                        x1 = x2;
                        if (overBack != null) { overBack(); }

                    }

                }


                move();










            }
        };
        tool.expandClass(window.xy, tool);




        /*TODO =========================数组函数 (扩展 Array原型)*/
        var xyArray = {
            /**
             * 功能: 遍历数组
             * 参数: backCall Type:Function that Type:Object
             * 说明: 遍历数组并调用回调函数
             */
            forEach:function(backCall,that){

                // 参数检查
                if(!tool.isFunction(backCall) || !this.length ){_showErr(ErrType.TYPEERROR); return this;}

                for(var i=0,len=this.length;i< len; ++i){
                    if(that){backCall.call(that,this[i],i);}
                    else{backCall(this[i],i);}
                }
            }
        };
        tool.expandClass(Array.prototype, xyArray);
        /*TODO =========================字符串函数 (扩展 String原型)*/
        var xyString = {

            /**
             * 功能: 去除首尾空格
             * 参数: 无
             * 说明: 返回去除首尾空格后的字符串副本
             */
            trim:function(){
                return  this.replace(/^\s+/,'').replace(/\s+$/,'') ;
            }

        };
        tool.expandClass(String.prototype, xyString);
        /*TODO =========================对象函数 (扩展 Object原型)*/
        var xyObject = {
            /**
             * 功能: 遍历对象
             * 参数: backCall Type:Function that Type:Object
             * 说明: 遍历对象并调用回调函数
             */
            _Loop_obj: function (backCall, that) {
                if (!tool.isFunction(backCall)) {return false;}

                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        backCall.call(that?that:this, key, this[key]);
                    }
                }
            }
        };
        tool.expandClass(Object.prototype, xyObject, true);
        /*TODO =========================DOM函数 (扩展 xy类)*/
        var xyElement = {
            /**
             * 功能: 遍历DOM树
             * 参数: element Type:HTMLElement, callBack Type:Function, isRecursive Type:Boolean,
             * 说明: isRecursive 可控制是否深度遍历所有子元素
             */
            eachChildren:function(element,callBack, isRecursive){
                // 参数检测
                if(!tool.isElement(element) || !tool.isFunction(callBack) ){_showErr(ErrType.TYPEERROR); return this}
                callBack(element);


                if(element.children.length > 0){

                    xyArray.forEach.call(element.children, function(value){

                        if(isRecursive){

                            xyElement.eachChildren(value, callBack, isRecursive);
                        }else{
                            callBack(value);
                        }

                    });



                }



            }




        };
        tool.expandClass(window.xy, xyElement);





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

            xyArray.forEach.call(_methods, function(method_Str){
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

            xyArray.forEach.call(arguments, function (arr, index) {
                if (index === 0) {return false;}
                if (arr.constructor !== Interface) {_showErr('要测试的必须是接口实例');}
                try{
                    xyArray.forEach.call(arr.methods, function(method){
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
            xyArray.forEach.call(arguments,function(arr,index){
                if(index === 0){if(interFace.constructor !== Interface){_showErr('要测试的必须是接口实例');}return false;}

                xyArray.forEach.call(interFace.methods, function(method){
                    if(!arr[method] || !tool.isFunction(arr[method])){
                        throw new Error('接口函数错误或缺失  : ' + '函数名称:'+ method   );
                    }
                });



            } );









        };




        /*TODO =========================事件操作  (扩展 X原型)*/
        var event = (function(){
            // 标准事件
            var Norm_Event = {
                /**
                 * 功能: 绑定事件
                 * 参数: eventStr Type:String, fuc Type:Function, data Type:Object, that Type:Object,
                 * 说明: 绑定一个DOM对象的指定事件
                 */
                bind:function(eventStr,fuc,data,that){
                    // 参数检测
                    if(!tool.isString(eventStr) || !tool.isFunction(fuc)){return this;}

                    var _that = this;
                    for(var i=0; i<_that.length; ++i){
                        var _element = _that[i];
                        _element.maxEventFuc = _element.maxEventFuc  ? _element.maxEventFuc : 0;
                        _element.funcs = _element.funcs ? _element.funcs : {};

                        var cacheFun =  function(event){

                            event.data = data ;
                            if(!event.relatedTarge){ event.relatedTarge = document.elementFromPoint(event.clientX, event.clientY);}
                            fuc.call(that ? that : this, event);
                        };

                        _element.maxEventFuc += 1;
                        _element.funcs[_element.maxEventFuc] = {'srcFun':fuc,'PackFuc':cacheFun,'type':eventStr};
                        _element.addEventListener(eventStr,_element.funcs[_element.maxEventFuc].PackFuc);

                    }
                    return _that;
                },
                /**
                 * 功能: 取绑事件
                 * 参数: eventStr Type:String, fuc Type:Function
                 * 说明: 取消一个DOM对象的指定事件
                 */
                unbind:function(eventStr,func){
                    // 参数检测
                    if(!tool.isString(eventStr) || !tool.isFunction(func)){return this;}
                    var _that = this;
                    for(var i=0; i<_that.length; ++i) {
                        var _element = _that[i];
                        xyObject._Loop_obj.call(_element.funcs, function(name,value){
                            var _milieu = this;
                            if(value['srcFun'] === func ){
                                _milieu.maxEventFuc -= 1;
                                _milieu.removeEventListener(eventStr,value['PackFuc']);
                                delete this.funcs[name];
                            }
                        },_element);

                    }

                    return _that;

                },
                /**
                 * 功能: 获取调试信息
                 * 参数: e无
                 * 说明: 调试输出这个元素的所有事件
                 */
                _Get_Info:function(){
                    var _that = this;
                    for(var i=0; i<_that.length; ++i) {
                        var _element = _that[i];
                        if(_element.maxEventFuc){
                            console.group('事件总数量:',_element.maxEventFuc);
                            xyObject._Loop_obj.call(_element.funcs, function(name,value){
                                console.log('事件类型:',value['type']);
                                console.log('事件函数',value['srcFun']);
                            });
                            console.groupEnd();
                        }else{
                            console.log('无事件');
                        }


                    }


                    return _element;



                }
            };

            //IE事件操作
            var IE_Event = {
                bind:function(eventStr,fuc,data,that){
                    // 参数检测
                    if(!tool.isString(eventStr) || !tool.isFunction(fuc)){return this;}

                    var _that = this;
                    for(var i=0; i<_that.length; ++i) {
                        var _element = _that[i];

                        _element.maxEventFuc = _element.maxEventFuc  ? _element.maxEventFuc : 0;
                        _element.funcs = _element.funcs ? _element.funcs : {};
                        var cacheFun =  function(event){
                            event.data = data ;
                            if(!event.relatedTarge){ event.relatedTarge = document.elementFromPoint(event.clientX, event.clientY);}
                            fuc.call( that?that:this,event);

                        };
                        _element.maxEventFuc += 1;
                        _element.funcs[_element.maxEventFuc] = {'srcFun':fuc,'PackFuc':cacheFun,'type':eventStr};
                        _element.attachEvent('on' + eventStr,_element.funcs[_element.maxEventFuc].PackFuc);

                    }


                    return _that;
                },
                unbind:function(eventStr,func){
                    // 参数检测
                    if(!tool.isString(eventStr) || !tool.isFunction(func)){return this;}

                    var _that = this;
                    for(var i=0; i<_that.length; ++i) {
                        var _element = _that[i];

                        xyObject._Loop_obj.call(_element.funcs, function(name,value){
                            var _milieu = this;


                            if(value['srcFun'] === func ){

                                _milieu.detachEvent('on' +eventStr,value['PackFuc'] );
                                _milieu.maxEventFuc -= 1;
                                delete _milieu.funcs[name];
                            }

                        },_element);



                    }




                    return _that;
                },
                _Get_Info:function(){

                    var _that = this;
                    for(var i=0; i<_that.length; ++i) {
                        var _element = _that[i];


                        if(_element.maxEventFuc){
                            console.log('事件总数量:',_element.maxEventFuc);

                            xyObject._Loop_obj.call(_element.funcs, function(name,value){
                                console.log('事件类型:',value['type']);
                                console.log('事件函数',value['srcFun']);
                            }, _element);

                        }else{
                            console.log('无事件');
                        }



                    }



                    return _that;

                }

            };

            var event_methods = ['bind','unbind','_Get_Info'];
            var Event_face = new Interface('event',event_methods);
            Interface.ensureImplementsX(Event_face ,Norm_Event,IE_Event );
            return  document.addEventListener ?   Norm_Event : IE_Event;

        })();
        tool.expandClass(results, event);





        /*TODO =========================CSS操作 (扩展 X原型)*/
        var css = (function(){
            return  {
                /**
                 * 功能: 添加类
                 * 参数: className Type:String
                 * 说明: 添加一个css类到DOM对象
                 */
                addClass:function(className){
                    // 参数检测
                    if(!tool.isString(className)){return this;}
                    var that = this;
                    for(var i=0; i<that.length; ++i) {
                        var _element = that[i];
                        if(!X(_element).hasClass(className)){
                            var cache = _element.className? ' ' : '';
                            _element.className += (cache + className);
                        }

                    }

                    return that;
                },
                /**
                 * 功能: 移除类
                 * 参数: className Type:String
                 * 说明: 移除DOM对象的所有指定类
                 */
                removeClass:function(className){
                    // 参数检测
                    if(!tool.isString(className)){return this;}
                    var that = this;
                    for(var i=0; i<that.length; ++i) {
                        var _element = that[i];

                        var className_Arr =  className.split(' ');

                        xyArray.forEach.call(className_Arr, function(now){
                            var _milieu = this;
                            if(now === className){_milieu.className = _milieu.className.replace(className,'');}
                        }, _element);


                    }

                    return that;
                },
                /**
                 * 功能: 判断类
                 * 参数: className Type:String
                 * 说明: DOM对象是否存在指定类名
                 */
                hasClass:function(className){
                    // 参数检测
                    if(!tool.isString(className)){return this;}
                    var that = this;
                    var fig = false;
                    for(var i=0; i<that.length; ++i) {
                        var _element = that[i];
                        if(_element.className.search(className) >= 0){
                            fig = true;
                        }
                    }
                    return fig;
                },
                /**
                 * 功能: 读/写 CSS属性
                 * 参数: classObject Type:String/Object
                 * 说明: 给定字符串参数代表获取属性值
                 */
                css:function(classObject){
                    // 参数检测
                    if(_checkPar(classObject)){return this;}


                    var that = this;
                    for(var i=0; i<that.length; ++i) {
                        var _element = that[i];

                        // 给入字符串, 返回属性值
                        if(_element.nodeType === 1 && tool.isString(classObject)){
                            if(tool.isIE()){
                                return _element.currentStyle[classObject];
                            }else{
                                return window.getComputedStyle(_element).getPropertyValue(classObject);
                            }
                        }else{

                            // 设置属性值
                            if(!tool.isObject(classObject)){return that;}
                            for(var x in classObject){
                                if(classObject.hasOwnProperty(x)){
                                    var summand = classObject[x];

                                    if(summand.charAt(1) === '=' && (summand.charAt(0) === '+' || summand.charAt(0) === '-') ){
                                        var addend = X(_element).css(x);
                                        addend = addend.slice(0, addend.length-2);
                                        var num = parseInt( summand.slice(2,summand.length-2));
                                        classObject[x] = eval(addend + summand.charAt(0) +  num ) + 'px';
                                    }


                                    if(tool.isIE()){

                                        _element.style[x] = classObject[x];
                                    }else{

                                        _element.style.setProperty(x,classObject[x], '');
                                    }

                                }



                            }

                        }




                    }























                    return this;
                }
            };


        })();
        tool.expandClass(results, css);




        /*TODO =========================本地存储 (扩展 xy类)*/
        window.xy.cookie = (function(){

            // 标准存储
            function LocalSave(){}
            LocalSave.prototype = {
                /**
                 * 功能: 设置值
                 * 参数: name Type:String, value:String
                 * 说明: 设置本地存储
                 */
                set:function(name,value){
                    if(_checkPar.call([name, value])){return false;}
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
                    if(_checkPar(name,value)){return false;}
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






        /*TODO =========================querySelectorAll (修复选择器)*/
        var _selector = (function () {


            if (!document.querySelectorAll) {
                document.querySelectorAll = function (selectors) {
                    var style = document.createElement('style'), elements = [], element;
                    document.documentElement.firstChild.appendChild(style);
                    document._qsa = [];
                    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this)); color:red;}';
                    window.scrollBy(0, 0);
                    style.parentNode.removeChild(style);
                    while (document._qsa.length) {
                        element = document._qsa.shift();
                        element.style.removeAttribute('x-qsa');
                        elements.push(element);
                    }
                    document._qsa = null;
                    return elements;
                };
            }

            if (!document.querySelector) {
                document.querySelector = function (selectors) {
                    var elements = document.querySelectorAll(selectors);
                    return (elements.length) ? elements[0] : null;
                };
            }

            function ie_Selector(selector, element) {
                var _saveID = element.id;
                element.id = element.id ? element.id : 'qsa';
                var result = document.querySelectorAll("#" + element.id + " " + selector);
                element.id = _saveID;
                return result;
            }

            function norm_Selector(selector, element) {

                return element.querySelectorAll( selector);
            }

            return document.body.querySelectorAll ? norm_Selector : ie_Selector;
        })();


        /**
         * 功能: 选择元素
         * 参数: selector Type:String, parentElement Type:HTMLElement
         * 说明: 获取parentElement中的 selector 选择器选中的元素, selector为HTMLElement类型时候直接进行包装
         */
        function X( selector, parentElement ){


            function XyElement(selector, parentElement){

                var that = this;
                that.length = 0;

                if(tool.isElement(selector)){
                    that['0'] = selector;
                    that.length = 1;
                }

                if(tool.isString(selector)){
                    var eleArr = _selector(selector, parentElement);


                    xyArray.forEach.call(eleArr, function(value, index){
                        that[index] = value;
                    });


                    that.length = eleArr.length;
                }


            }
            XyElement.prototype = results;

            var _parent = document.body;

            if(parentElement){

                try{
                    if(parentElement.hasOwnProperty('length')){
                        _parent = parentElement[0] ;
                        if(!_parent){_checkPar("parentElement 参数为空");}
                    }else{
                        _parent = parentElement;
                    }
                }catch (err) {
                    console.log(err.message, err.stack);
                    _parent = document.body;

                }


            }


            return new XyElement(selector, _parent   );

        }
        window.X = X;







        /*TODO =========================私有函数*/
        /**
         * 功能: 参数检测
         * 参数: 无
         * 说明: 检测参数列表是否为未定义或为空值
         */
        function _checkPar(){
            var flag = false;

            for(var i= 0, len=arguments.length; i<len; ++i){
                if(arguments[i] == undefined || arguments[i] == null ){
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
            throw new Error(errMessage);
        }










        /*
         算法来源：http://www.robertpenner.com/easing/
         */
        var Tween = {
            /*Linear 线性运动*/
            Linear: function(t,b,c,d){ return c*t/d + b; },
            /*Quad 二次方的缓动（t^2）*/
            Quad: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                }
            },
            /*Cubic 三次方的缓动（t^3）*/
            Cubic: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                }
            },
            /*Quart 四次方的缓动（t^4) */
            Quart: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                }
            },
            /*Quart 五次方的缓动（t^5) */
            Quint: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                }
            },
            /*Sine 正弦曲线的缓动（sin(t)） */
            Sine: {
                easeIn: function(t,b,c,d){
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOut: function(t,b,c,d){
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                }
            },
            /*Expo 指数曲线的缓动（2^t） */
            Expo: {
                easeIn: function(t,b,c,d){
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOut: function(t,b,c,d){
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            /*Circ 圆形曲线的缓动（sqrt(1-t^2)） */
            Circ: {
                easeIn: function(t,b,c,d){
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                }
            },
            /*Elastic 指数衰减的正弦曲线缓动 子弹弹出效果 */
            Elastic: {
                easeIn: function(t,b,c,d,a,p){
                    var s;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c;  s=p/4; }
                    else  s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOut: function(t,b,c,d,a,p){
                    var s;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c;  s=p/4; }
                    else  s = p/(2*Math.PI) * Math.asin (c/a);
                    return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
                },
                easeInOut: function(t,b,c,d,a,p){
                    var s;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (!a || a < Math.abs(c)) { a=c;  s=p/4; }
                    else  s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                }
            },
            /*Back 超过范围的三次方缓动（(s+1)*t^3 - s*t^2） */
            Back: {
                easeIn: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                }
            },
            /*Bounce 指数衰减的反弹缓动  弹弹效果 */
            Bounce: {
                easeIn: function(t,b,c,d){
                    return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
                },
                easeOut: function(t,b,c,d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOut: function(t,b,c,d){
                    if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
                    else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
        };































/*                console.log(results);
                console.log(tool.isNumber(1));
                console.log(tool.isElement(1));
                console.log(tool.typeOf(1));
                console.log(tool.isIE());

                console.log(tool.extend());
                console.log(tool.expandClass());
                console.log(tool.clone());
                console.log(tool.random());
                console.log(tool.gradientColor());
                console.log(xyString.trim());
                console.log(xyObject._Loop_obj());
                console.log(xyElement.eachChildren());

                console.log(css.addClass());
                console.log(css.hasClass());
                console.log(css.removeClass());
                console.log(css.css());
                console.log(Tween.Linear());
                console.log(tool.animate());*/

    }();

}







