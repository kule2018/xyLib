*�Ƽ�ʹ�� emEditor�༭����, �����������ʾ
*�������� 2015-4-14
*�汾0.3.51
*[] �еĲ���Ϊ��ѡ����
*���ļ�������Ҫ��body�պϱ�ǩǰ,����Ҫ����head��,��Ϊ�Ǹ�ʱ��window.document.body��δ����
*ǰ׺�����˺����Ѿ��� chrome,ie7,8,9 ����


## xyLib.js	

���ߺ���
 ��isArray(value)		-ֵ�Ƿ�Ϊ����		���ز���ֵ		
 ��isString(value)		-ֵ�Ƿ�Ϊ�ַ���		���ز���ֵ		
 ��isNumber(value)	-ֵ�Ƿ�Ϊ����		���ز���ֵ		
 ��isFunction(value)	-ֵ�Ƿ�Ϊ����		���ز���ֵ		
 ��isObject(value)		-ֵ�Ƿ�Ϊ����		���ز���ֵ			
 ��isElement(value)	-ֵ�Ƿ�ΪDOMԪ��	���ز���ֵ		
 ��typeOf(value)		-�ж�ֵ����.  		�����ַ���ֵ		
 ��clone(object)		-��¡һ������		���ؿ�¡��Ķ���		
 ��isIE(ver)		-�Ƿ�ΪIE�����,ver������ָ���汾	���ز���ֵ		
 ��random(min, max)	-������С�����֮�����(����������С)	���min����max,���Զ��ߵ�			
 ��expandClass(superClass,subClass, [isCover=false])	-��subClass���๦����չ��superClass���� isCover�涨�Ƿ񸲸�֮ǰ��ͬ������,Ĭ��Ϊfalse������(IE�������ʼ�ո���)		��������չ����
 ��gradientColor(from, to, callback, [duration], [framesPerSecond])	-���ý���ɫ from��to {r:55,g:189,b:255} ��ɫ����, callback��һ��color����,    duration Ϊ����ʱ��,��λ��, framesPerSecondÿ��֡��,Խ��϶�Խ����
 ��extend(subClass, superClass)	-ԭ�ͼ̳� subClass��ԭ�ͼ̳���superClass, subClass��Ҫ��call����superClass
 ��eachChildren(element, callback, isRecursive)	-������Ԫ�� isRecursiveΪ����ݹ�ö��������Ԫ��
 ��animate(x1, x2, callback, speed, overBack, type, way)	-���ûص���������ɻ�������





�ַ�������[�Ѱ�����Stringԭ����,ֱ��ʹ��]
 ��trim()			-ȥ����λ�ո�		����ȥ�����ַ����ĸ���


���麯��[�Ѱ�����Arrayԭ����,ֱ��ʹ��]
 ��forEach(callback, that)	-��������


������[�Ѱ�����Objectԭ����,ֱ��ʹ��]
 ��_Loop_obj(backCall, that)			-��������  �ص���������: ��, ֵ




DOM��:
 X()

 #�¼�
  ��bind(eventStr, fuc, data, that);		-���¼�
  ��unbind(eventStr, func);		-ȡ���¼�
  ��_Get_Info();				-��ȡ��ǰԪ�ص��¼�������


 #CSS����
  ��addClass(className, callback)		-�����ʽ
  ��removeClass(className)		-�Ƴ���ʽ
  ��hasClass(className)			-�Ƿ������ʽ
  ��css(classObject)			-�����ʽ����
 





�ӿ���:
	����:
	var cookie_methods = ['set','get','remove','_GetData','getLength'];  �ӿ�ӵ�еķ���
	var Cookie_face = new Interface('Cookie',cookie_methods);	����һ����ΪCookie�Ľӿ�
	���:
	ʹ�þ�̬����: 
	// ���window.xy.cookie�����Ƿ���ѭ Cookie �ӿ�, �Լ�ʡ�Ժź�Ľӿ�
	Interface.ensureImplements(window.xy.cookie ,Cookie_face, [...]);
	// ���LocalSave,Cookie��ʵ�� �Ƿ�ƥ��Cookie_face�ӿ�
	Interface.ensureImplementsX(Cookie_face ,new LocalSave(),new Cookie() );











xy.cookie
	��set('name', value);		-���ñ��ش洢�����ƺ�ֵ
	��get('name', value);		-��ȡֵ
	��remove(name);		-ɾ��ֵ,Ҳ���Ը����±�(������localStorage���±겢����˳�򱣴�)
	��_GetData();			-���ش洢����




����x������ȡԪ��
	x(select, parent)		-������jqueryһ��




