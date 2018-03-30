//元素获取
var oLayer = get.byId("layer");
var enterBtn = get.byId("enter");
var oMsgBox = get.byId("msgBox");
var oUserName = get.byId("userName");
var oConBox = get.byId("conBox");
var oForm = get.byTag("form",oMsgBox)[0];
var oSendBtn = get.byId("sendBtn");
var oMaxNum = get.byClass("maxNum")[0];
var oCountTxt = get.byClass("countTxt")[0];
var oList = get.byClass("list")[0];
var oUl = get.byTag("ul", oList)[0];
var aLi = get.byTag("li", oList);
var aFtxt = get.byClass("f-text", oMsgBox);
var aImg = get.byTag("img", get.byId("face"));
var isSend = true;
var timer = null;
var oTmp = "";
var i = 0;
var maxNum = 140;
//利用jquery实现页面切换
var enterBoard = function() {
	$(oLayer).hide('slow');
	$(oMsgBox).show('slow');
}
EventUtil.addHandler(enterBtn,"click",function(){
	enterBoard();
})
						//给元素绑定事件
//1.禁止提交表单
EventUtil.addHandler(oForm,"submit",function(){
	return false;
})
//2.为按钮绑定发送事件
EventUtil.addHandler(oSendBtn,"click",fnSend);
//3.为ctrl+enter快捷键绑定发送事件
EventUtil.addHandler(document,"keyup",function(e){
	e = e || window.event;
	e.ctrlKey && e.keyCode == 13 && fnSend();
})
//4.判断字符输入
EventUtil.addHandler(oConBox, "keyup", confine);	
EventUtil.addHandler(oConBox, "focus", confine);
EventUtil.addHandler(oConBox, "change", confine);
//5.按钮鼠标划过和离开样式
EventUtil.addHandler(oSendBtn, "mouseover", function () {this.className = "hover"});
EventUtil.addHandler(oSendBtn, "mouseout", function () {this.className = ""});

//输入字符限制
function confine (){
	var iLen = 0;		
	for (i = 0; i < oConBox.value.length; i++){
		//每一次键盘按下都要遍历输入的字符，并检测每一个字符的编码是否不在0-255之间，如果不在就算作一个字符，如果在算作半个字符，最后相加
		iLen += /[^\x00-\xff]/g.test(oConBox.value.charAt(i)) ? 1 : 0.5;
	}
	oMaxNum.innerHTML = Math.abs(maxNum - Math.floor(iLen));	
	if(maxNum - Math.floor(iLen) >= 0){
		css(oMaxNum, "color", "");
		oCountTxt.innerHTML = "还能输入";
		bSend = true;
	} else {
		css(oMaxNum, "color", "#f60");
		oCountTxt.innerHTML = "您已超出";
		bSend = false;
	} 
}
confine();	
//发送
function fnSend() {
	var reg = /^\s*$/;
	//输入框的判断，每次执行完条件判断后的语句后输入框需要重新获得焦点
	if(reg.test(oUserName.value)){
		alert("请填写您的姓名");
		oUserName.focus();
	} else if(!/^[u4e00-\u9fa5\w]{2,8}$/g.test(oUserName.value)){
		alert("姓名由2-8位字母，数字、下划线、汉字组成！")
		oUserName.focus();
	} else if(reg.test(oConBox.value)){
		alert("随便说点什么吧！")
		oConBox.focus();
	} else if(!isSend){
		alert("输入的内容超过字数限制，请检查！")
        oConBox.focus();
	} else {  
		//当所有条件都成立后，创建li节点
		var oLi = document.createElement("li");
		var oDate = new Date;
		//innerHTML里面的特殊字符需要转义
		oLi.innerHTML = "<div class=\"userPic\"><img src=\"" + get.byClass("current", get.byId("face"))[0].src + "\"></div>\
							 <div class=\"content\">\
							 	<div class=\"userName\"><a href=\"javascript:;\">" + oUserName.value + "</a>:</div>\
								<div class=\"msgInfo\">" + oConBox.value.replace(/<[^>]*>|&nbsp;/ig, "") + "</div>\
								<div class=\"times\"><span>" + format(oDate.getMonth() + 1) + "\u6708" + format(oDate.getDate()) + "\u65e5 " + format(oDate.getHours()) + ":" + format(oDate.getMinutes()) + "</span><a class=\"del\" href=\"javascript:;\">\u5220\u9664</a></div>\
							 </div>";

		//插入节点
		//如果ul下有子节点就在第一个子节点之前插入创建的节点，ul下没有子节点直接appendChild
		aLi.length ? oUl.insertBefore(oLi, aLi[0]) : oUl.appendChild(oLi);

		//重置表单
		oForm.reset();
		for(var i=0; i<aImg.length; i++){ //清除被选中的img头像
			aImg[i].className = "";
		}
		aImg[0].className = "current"; //默认选中第一个img头像
		//将元素高度保存
		var iHeight = oLi.clientHeight;
		//设置添加li的两个短暂动画(透明度，高度)
		var alpha = count = 0; //alpha用于渐显，count用于高度的慢慢累加，知道iHeight的高度
		css(oLi, {"opacity": "0", "height": "0"});
		timer = setInterval(function(){
			css(oLi, {"display": "block", "opacity": "0", "height": (count += 8) + "px"});
			if(count > iHeight){ //边界判断
				clearInterval(timer);
				css(oLi, "height", iHeight+"px");
				timer = setInterval(function(){
					css(oLi, "opacity", (alpha += 10));
					if(alpha > 100){
						clearInterval(timer);
						css(oLi, "opacity", 100)
					}
				}, 30)
			}
		}, 30);
		//调用鼠标滑过函数,注意，在此调用函数，说明只在点击"广播"按钮后才能执行
		liHover();
		//调用删除li的函数
		delLi();
	}
}

//鼠标滑过或离开样式函数
function liHover(){
	for(var i=0; i<aLi.length; i++){
		//鼠标滑过时候li的样式
		EventUtil.addHandler(aLi[i], "mouseover", function(e){
			this.className = "hover";
			oTmp = get.byClass("times", this)[0]; //获取class为times的div
			var aA = get.byTag("a", oTmp); //获取里面的a链接也就是"删除"
			if(!aA.length){ //假如该"删除"不存在，临时创建一个一模一样的a标签
				var oA = document.createElement("a");
				oA.innerHTML = "删除";
				oA.className = "del";
				oA.href = "javascript:;";
				oTmp.appendChild(oA);
			} else {
				aA[0].style.display = "block";
			}
		});
		//鼠标离开时候li的样式
		EventUtil.addHandler(aLi[i],"mouseout", function(){
			this.className = "";
			var oA = get.byTag("a", get.byClass("times",this)[0])[0];
			oA.style.display = "none";
		});
	}
}

liHover(); 

//删除li函数
function delLi(){
	var aA = get.byClass("del",oUl);
	for(var i=0; i<aA.length; i++){
		aA[i].onclick = function(){
			var oParent = this.parentNode.parentNode.parentNode;
			//同样是用动画来表示
			var alpha = 100; 
			var iHeight = oParent.offsetHeight;
			timer = setInterval(function(){
				//每隔30毫秒让li透明度降低10
				css(oParent, "opacity", (alpha -= 10));
				if(alpha < 0){ //边界判断
					clearInterval(timer); 
					timer = setInterval(function(){ //当透明度为0时，开始每隔30ms降低li列表高度
						iHeight -= 10;
						if(iHeight < 0){ //边界判断
							iHeight = 0;
						}
						css(oParent, iHeight + "px");
						//当li高度降为0时，从ul中移除该节点
						iHeight == 0 && (clearInterval(timer), oUl.removeChild(oParent));
					}, 30)
				}
		}, 30);
		//该li删除后，同样需要释放其点击事件
		this.onclick = null;  
		}
	}
}
delLi();

//输入框获取焦点时样式
for (i = 0; i < aFtxt.length; i++){
	EventUtil.addHandler(aFtxt[i], "focus", function ()	{this.className = "active"});		
	EventUtil.addHandler(aFtxt[i], "blur", function () {this.className = ""});
}

//格式化时间，如果为一位数时补0;捕获正则中的小分组，并用$1表示第一个小分组
function format(str){
	return str.toString().replace(/^(\d)$/,"0$1");
}

//小头像交互样式
for (i = 0; i < aImg.length; i++){
	aImg[i].onmouseover = function (){
		//因为该元素可能已经有一个current的样式了，所以添加多个样式需要"+="
		this.className += " hover";
	};
	aImg[i].onmouseout = function (){
		//去掉hover样式同样如此，需要用replace去掉空格和"hover"字符
		this.className = this.className.replace(/\s?hover/,"");
	};
	aImg[i].onclick = function (){
		//点击时，遍历img去掉所有className，再添加current样式;
		for (i = 0; i < aImg.length; i++) aImg[i].className = "";
		this.className = "current";	
	}
}
