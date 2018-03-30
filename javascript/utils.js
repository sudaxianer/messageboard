// Dom获取方法兼容处理
var get = {
	byId: function(id){
		return typeof id === "string" ? document.getElementById(id) : id;
	},
	byTag: function(tagName, obj){
		return (obj || document).getElementsByTagName(tagName);
	},
	byClass: function(clName, parentNode){
		var aryClass = [];
		var regClass = new RegExp("(^| )" + clName + "( |$)")
		var allItem = this.byTag("*",parentNode);
		for(var i=0; i<allItem.length; i++){
			var cur = allItem[i];
			regClass.test(cur.className) && aryClass.push(cur);
		}
		return aryClass;
	}
}
//DOM2级事件兼容处理
var EventUtil = {
	addHandler: function(curEle, evenType, fnHandler){
		if("addEventListener" in document){
			curEle.addEventListener(evenType,fnHandler,false);
			return;
		}
		var tempFn = function(){
			fnHandler.call(curEle);
		}
		curEle.attachEvent("on"+evenType,tempFn);
	},
	removeHandler: function (curEle, evenType, fnHandler) {
		if("removeEventListener" in document){
			curEle.removeEventListener(evenType,fnHandler,false);
		} else {
			curEle.detachEvent("on"+evenType,fnHandler);
		}
	},
	addLoadHandler: function(fnHandler){
		this.addHandler(window,"load",fnHandler);
	}
}
//设置css样式，获取css样式
function css(curEle, attr, value){
	//如果是传两参数
	switch(arguments.length){
		case 2:
			if(typeof arguments[1] === "object"){ //第二个参数是对象
				for(var key in attr){
					if(key == "opacity"){
						curEle.style["filter"] = "alpha(opacity=" + attr[key] + ")";
						curEle.style[key] = attr[key]/100;
					} else {
						curEle.style[key] = attr[key];
					}
				}
			} else { //第二个参数是字符串
				return curEle.currentStyle ? curEle.currentStyle[attr]: window.getComputedStyle(curEle,null)[attr]
			}
			break;
		case 3:
			if(attr == "opacity"){
				curEle.style["filter"] = "alpha(opacity=" + value + ")";
				curEle.style["opacity"] = value/100;
			} else {
				curEle.style[attr] = value;
			}
			break;
	}
}
