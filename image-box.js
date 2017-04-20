
(function($) {
	var settings = { //global config
		duration: 400,
		preserveHeight: true,
		prevText: "&lang;",
		nextText: "&rang;",
		closeText: "&times;",
		bulletText: "&bullet;",
		imageLoading: "data:image/svg+xml;base64," + btoa('<svg version="1.1" id="L1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="70px" height="80px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="8" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="16" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" /></rect></svg>'),
		classOverlay: "iboxOverlay",
		classWrapper: "iboxWrapper",
		classButtons: "iboxButtons",
		classButtonClose: "iboxClose",
		classButtonPrev: "iboxPrev",
		classButtonNext: "iboxNext",
		classBullets: "iboxBullets",
		classBullet: "iboxBullet",
		classActiveBullet: "iboxActive",
		classTitle: "iboxTitle",

		msgFadeDuration: 1000,
		msgNextDuration: 8000,
		msgCloseButton: "&times;",
		classMessageButton: "msgButton",
		classMessageOk: "msgOk",
		classMessageInfo: "msgInfo",
		classMessageWarn: "msgWarn",
		classMessageError: "msgError"
	};

	//create once all DOM elements to overlay image-box
	var iboxOverlay = document.createElement("div");
	var iboxWrapper = iboxOverlay.appendChild(document.createElement("div"));
	var iboxImage = iboxWrapper.appendChild(document.createElement("img"));
	var iboxBullets = iboxWrapper.appendChild(document.createElement("div"));
	var iboxTitle = iboxWrapper.appendChild(document.createElement("div"));
	var btnClose = iboxWrapper.appendChild(document.createElement("a"));
	var btnPrev = iboxWrapper.appendChild(document.createElement("a"));
	var btnNext = iboxWrapper.appendChild(document.createElement("a"));

	//keyup events and
	function fnKeyUp(ev) {
		(ev.keyCode == 27) && close(); //escape keycode = 27
		(ev.keyCode == 37) && $(btnPrev).click(); //left keycode = 37
		(ev.keyCode == 39) && $(btnNext).click(); //right keycode = 39
	};

	function onClose() {
		$(document).unbind("keyup", fnKeyUp);
		$(iboxImage).attr("src", settings.imageLoading);
		settings.onClose && settings.onClose();
	};

	function close() { $(iboxOverlay).fadeOut(settings.duration, onClose); return false; }; //close overlay
	function range(val, min, max) { return Math.min(Math.max(val, min), max); }; //range value

	//add overlay layer when DOM is fully loaded
	$(function() { document.body.appendChild(iboxOverlay); });
	//set default class and close event to overlay and wrapper
	$(iboxOverlay).addClass(settings.classOverlay).click(close);
	$(iboxWrapper).addClass(settings.classWrapper);
	$(btnClose).attr("href", "#").click(close);

	$.imageBoxOpen = function(img) {
		$(iboxImage).attr("src", img || settings.imageLoading);
		$(btnClose).hide(); $(btnPrev).hide(); $(btnNext).hide();
		$(iboxBullets).hide().empty(); $(iboxTitle).hide().text("");
		$(iboxOverlay).unbind("click").fadeIn(settings.duration);
	};

	$.imageBoxClose = function() {
		$(iboxOverlay).fadeOut(settings.duration, function() {
			$(btnClose).show(); $(btnPrev).show(); $(btnNext).show();
			$(iboxBullets).show(); $(iboxTitle).show();
			$(this).unbind("click").click(close);
		});
	};

	//create once all DOM elements to messages list-box
	function fnVoid() {}; //void function => none action
	function fnRemove() { $(this).remove(); }; //remove this DOM
	function fnHide() { $(this).fadeOut(settings.msgFadeDuration, fnRemove); };
	function msgBox(box, msg, cls) {
		var msgBox = document.createElement("div");
		var fnHideBox = function() { $(msgBox).next().each(fnHide); };
		var fnTimeout = function() { setTimeout(fnHideBox, settings.msgNextDuration); };
		var button = msgBox.appendChild(document.createElement("span"));
		$(button).addClass(settings.classMessageButton)
				.click(function() { $(msgBox).each(fnHide) })
				.html(settings.msgCloseButton);
		box.prepend($(msgBox).append("<span>" + msg + "</span>"));
		var fn = (settings.msgNextDuration < 0) ? fnVoid : fnTimeout;
		$(msgBox).addClass(cls).fadeIn(settings.msgFadeDuration, fn);
		return box;
	};

	$.fn.messageBox = function(opts) { $.extend(settings, opts); return this; };
	$.fn.showBoxOk = function(msg) { return msgBox(this, msg, settings.classMessageOk); };
	$.fn.showBoxInfo = function(msg) { return msgBox(this, msg, settings.classMessageInfo); };
	$.fn.showBoxWarn = function(msg) { return msgBox(this, msg, settings.classMessageWarn); };
	$.fn.showBoxError = function(msg) { return msgBox(this, msg, settings.classMessageError); };
	$.fn.hideBoxMsgs = function() { return $(this).children().each(fnHide); };

	$.fn.imageBox = function(opts) {
		opts = $.extend({}, settings, opts); //config
		var self = this; //reference to jQuery list
		var index = 0; //position indicator

		function onChange() {
			if (opts.preserveHeight) {
				var height = $(iboxImage).height() + "px";
				$(btnPrev).css({"line-height": height, "height": height});
				$(btnNext).css({"line-height": height, "height": height});
			}
			$(btnPrev).show(); $(btnNext).show();
			opts.afterChange && opts.afterChange(); //call event
		};

		function setImage(i) {
			index = range(i, 0, self.length - 1);
			$(btnPrev).hide(); $(btnNext).hide();
			opts.beforeChange && opts.beforeChange(); //call event
			$(iboxTitle).html($(self[i]).attr("title")); //set title image
			$(iboxImage).fadeOut(opts.duration, function() { //fade old image
				$(this).attr("src", $(self[i]).attr("href")).fadeIn(opts.duration, onChange);
				var bullets = $("a", iboxBullets).removeClass(opts.classActiveBullet);
				$(bullets[index]).addClass(opts.classActiveBullet);
			});
			return false; //prevent event default for links
		};

		$(btnClose).addClass(opts.classButtons + " " + opts.classButtonClose).html(opts.closeText);
		$(btnPrev).attr("href", "#").addClass(opts.classButtons + " " + opts.classButtonPrev).html(opts.prevText);
		$(btnNext).attr("href", "#").addClass(opts.classButtons + " " + opts.classButtonNext).html(opts.nextText);
		this.click(function() {
			$(iboxBullets).empty();
			$(document).keyup(fnKeyUp); //load key event
			$(btnPrev).unbind("click").click(function() { return setImage(index - 1); });
			$(btnNext).unbind("click").click(function() { return setImage(index + 1); });
			self.each(function(i) {
				var bullet = iboxBullets.appendChild(document.createElement("a"));
				$(bullet).attr("href", "#").addClass(opts.classBullet)
						.click(function() { return setImage(i); })
						.html(opts.bulletText);
			});
			$(iboxOverlay).fadeIn(opts.duration);
			return setImage(self.index(this)); //put image
		});

		$(iboxOverlay).addClass(opts.classOverlay);
		$(iboxWrapper).addClass(opts.classWrapper);
		$(iboxBullets).addClass(opts.classBullets);
		$(iboxTitle).addClass(opts.classTitle);
		opts.onLoad && opts.onLoad();
		return this;
	};
}(jQuery));
