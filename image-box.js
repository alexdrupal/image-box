
(function($) {
	var index = -1; //position indicator
	var settings = { //global config
		duration: 300,
		preserveHeight: true,
		prevText: "&lang;",
		nextText: "&rang;",
		closeText: "&times;",
		bulletText: "&bullet;",
		imageLoading: "data:image/svg+xml;base64," + btoa('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="60px" height="68px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" /></rect></svg>'),
		classOverlay: "iboxOverlay",
		classWrapper: "iboxWrapper",
		classButtons: "iboxButtons",
		classBullets: "iboxBullets",
		classBullet: "iboxBullet",
		classActiveBullet: "iboxActive",
		classTitle: "iboxTitle"
	};

	//desactive keyup events and call onClose event
	function onClose() { index = -1; settings.onClose && settings.onClose(); };
	function close() { $(iboxOverlay).fadeOut(settings.duration, onClose); return false; };

	//create once all DOM elements to overlay image-box
	var iboxOverlay = document.createElement("div");
	var iboxWrapper = iboxOverlay.appendChild(document.createElement("div"));
	var iboxImage = iboxWrapper.appendChild(document.createElement("img"));
	var iboxBullets = iboxWrapper.appendChild(document.createElement("div"));
	var iboxTitle = iboxWrapper.appendChild(document.createElement("div"));
	var btnClose = iboxWrapper.appendChild(document.createElement("a"));
	var btnPrev = iboxWrapper.appendChild(document.createElement("a"));
	var btnNext = iboxWrapper.appendChild(document.createElement("a"));

	$(iboxOverlay).click(close); //add close event
	$(btnClose).attr("id", "close").attr("href", "#").click(close);
	$(btnPrev).attr("id", "prev").attr("href", "#");
	$(btnNext).attr("id", "next").attr("href", "#");

	$(function() { document.body.appendChild(iboxOverlay); });
	$(document).keyup(function(e) {
		if (index < 0) return null; //inactive box
		(e.keyCode == 27) && close(); //escape keycode = 27
		(e.keyCode == 37) && $(btnPrev).click(); //left keycode = 37
		(e.keyCode == 39) && $(btnNext).click(); //right keycode = 39
	});

	$.imageBoxOpen = function(img) {
		settings.onLoad && settings.onLoad();
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
			onClose();
		});
	};

	$.fn.imagebox = function(opts) {
		var self = this; //reference to jQuery list
		opts && $.extend(settings, opts); //inicialize settings
		function range(val, min, max) { return Math.min(Math.max(val, min), max); };
		function rangeList(val) { return range(val, 0, self.length - 1); };
		function onChange() {
			if (settings.preserveHeight) {
				var height = $(iboxImage).height() + "px";
				$(btnPrev).css({"line-height": height, "height": height});
				$(btnNext).css({"line-height": height, "height": height});
			}
			$(btnPrev).show(); $(btnNext).show();
			settings.afterChange && settings.afterChange(); //call event
		};

		function getImage(i) {
			index = rangeList(i);
			return $(self[i]).attr("href");
		};
		function setImage(i) {
			$(btnPrev).hide(); $(btnNext).hide();
			settings.beforeChange && settings.beforeChange(); //call event
			$(iboxTitle).html($(self[i]).attr("title")); //set title image
			$(iboxImage).fadeOut(settings.duration, function() { //fade old image
				$(this).attr("src", getImage(i)).fadeIn(settings.duration, onChange);
				var bullets = $("a", iboxBullets).removeClass(settings.classActiveBullet);
				$(bullets[index]).addClass(settings.classActiveBullet);
			});
			return false; //prevent event default for links
		};

		$(btnClose).addClass(settings.classButtons).html(settings.closeText);
		$(btnPrev).addClass(settings.classButtons).html(settings.prevText);
		$(btnNext).addClass(settings.classButtons).html(settings.nextText);

		this.click(function() {
			$(iboxBullets).empty();
			$(iboxOverlay).fadeIn(settings.duration);
			$(btnPrev).unbind("click").click(function() { return setImage(index - 1); });
			$(btnNext).unbind("click").click(function() { return setImage(index + 1); });
			self.each(function(i) {
				var bullet = iboxBullets.appendChild(document.createElement("a"));
				$(bullet).attr("id", "bullet" + i).attr("href", "#").addClass(settings.classBullet)
						.click(function() { return setImage(i); })
						.html(settings.bulletText);
			});
			return setImage(self.index(this));
		});

		$(iboxOverlay).attr("id", "iboxOverlay").addClass(settings.classOverlay);
		$(iboxWrapper).attr("id", "iboxWrapper").addClass(settings.classWrapper);
		$(iboxBullets).attr("id", "iboxBullets").addClass(settings.classBullets);
		$(iboxTitle).attr("id", "iboxTitle").addClass(settings.classTitle);
		settings.onLoad && settings.onLoad();
		return this;
	};
}(jQuery));
