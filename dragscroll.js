/**
 * @param {Object} elementId | 绑定事件的对象ID
 * @param {Object} hideSec | 松开后停留sec后隐藏
 */
function initDialog(elementId, hideSec, callback){
	elementId = "#" + elementId
	let demo= $(elementId);
	let contW = $(elementId).width();
	let contH = $(elementId).height();
	let startX, startY, sX, sY, moveX, moveY, disX, disY;
	let winW = $(window).width();
	let winH = $(window).height();
	
	let hideW = parseInt(contW/4);
	let endLeft  = 0;
	let endRight = "";
	let pullOverSec = 1500;
	let hideTimer,pullOverTimer = null;
	let floatLeft = true;
	
	demo.on({
		touchstart: function(e) {
			startX = e.originalEvent.targetTouches[0].pageX;
			startY = e.originalEvent.targetTouches[0].pageY;
			sX = $(this).offset().left;
			sY = $(this).offset().top;
			leftX = startX - sX;
			rightX = winW - contW + leftX;
			topY = startY - sY
			bottomY = winH - contH + topY -20;
			
			$(this).css({
				"opacity": 1
			});
			
			if(hideTimer) {
				clearTimeout(hideTimer);
				hideTimer = null;
			}
			if(pullOverTimer) {
				clearTimeout(pullOverTimer);
				pullOverTimer = null;
			}
		},
		touchmove: function(e) {
			e.preventDefault();
			moveX = e.originalEvent.targetTouches[0].clientX;
			moveY = e.originalEvent.targetTouches[0].clientY;
			if (moveX < leftX) {
				moveX = leftX;
			}
			if (moveX > rightX) {
				moveX = rightX;
			}
			if (moveY < topY) {
				moveY = topY;
			}
			if (moveY > bottomY) {
				moveY = bottomY;
			}
			$(this).css({
				"left": moveX + sX - startX,
				"top": moveY + sY - startY,
			});
		},
		touchend:function(){
			var endCss = {
				"left": endLeft,
				"top": moveY + sY - startY,
				"right":endRight,
				"opacity": 1
			};
			var elem = $(this);
			if((contW/3+moveX) > winW/2) {
				floatLeft = false;
			} else {
				floatLeft = true;
			}
			
			if(floatLeft) {
				endCss.left  = 0;
				endCss.right = "";
				elem.css(endCss);
				$(this).children(":first").css({
					"left":"",
					"right":0
				});
			} else {
				endCss.left  = "";
				endCss.right = 0;
				elem.css(endCss);
				$(this).children(":first").css({
					"left":0,
					"right":""
				});
			}
			// 靠边处理
			pullOverTimer = setTimeout(function(){
				endCss.opacity = 0.6;
				endCss.left = endCss.left === 0 ? endCss.left-hideW : "";
				endCss.right = endCss.right === 0 ? endCss.right-hideW : "";
				elem.css(endCss);
				clearTimeout(pullOverTimer);
				pullOverTimer = null;
			}, pullOverSec);
			// 隐藏处理
			if(hideSec !== undefined && hideSec > 0) {
				hideTimer = setTimeout(function(){
					elem.hide();
					clearTimeout(hideTimer);
					hideTimer = null;
					if(typeof callback === 'function') callback();
				}, hideSec);
			}
		}
	});
};