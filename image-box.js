
(function($) {
	var settings = { //global config
		duration: 300,
		preserveHeight: true,
		prevText: "&lang;",
		nextText: "&rang;",
		closeText: "&times;",
		bulletText: "&bullet;",
		classOverlay: "iboxOverlay",
		classWrapper: "iboxWrapper",
		classButtons: "iboxButtons",
		classBullets: "iboxBullets",
		classBullet: "iboxBullet",
		classActiveBullet: "iboxActive",
		classTitle: "iboxTitle"
	};

	function close() {
		settings.onClose && settings.onClose(); //call onclose event
		return !$(iboxOverlay).fadeOut(settings.duration);
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

	$(iboxOverlay).click(close); //add close event
	$(btnClose).attr("id", "close").attr("href", "#").click(close);
	$(btnPrev).attr("id", "prev").attr("href", "#");
	$(btnNext).attr("id", "next").attr("href", "#");

	$(function() { document.body.appendChild(iboxOverlay); });
	$(document).keyup(function(e) {
		if (!$(iboxOverlay).is(":visible"))
			return null; //inactive box
		(e.keyCode == 27) && close(); // escape keycode = 27
		(e.keyCode == 37) && $(btnPrev).click(); // left keycode = 37
		(e.keyCode == 39) && $(btnNext).click(); // right keycode = 39
	});

	$.imageBoxOpen = function(img) {
		$(iboxImage).attr("src", img);
		$(btnClose).hide(); $(btnPrev).hide(); $(btnNext).hide();
		$(iboxBullets).hide().empty(); $(iboxTitle).hide().text("");
		$(iboxOverlay).unbind("click").fadeIn(settings.duration);
	};

	$.imageBoxClose = function() {
		$(iboxOverlay).unbind("click").click(close);
		$(iboxOverlay).fadeOut(settings.duration, function() {
			$(btnClose).show(); $(btnPrev).show(); $(btnNext).show();
			$(iboxBullets).show(); $(iboxTitle).show();
		});
	};

	$.fn.imagebox = function(opts) {
		var index = 0; //position indicator
		var self = this; //reference to jQuery list
		opts && $.extend(settings, opts); //inicialize settings
		function range(val, min, max) { return Math.min(Math.max(val, min), max); };
		function rangeList(val) { return range(val, 0, self.length - 1); };
		function setIndex(j) { index = rangeList(j); return index; };
		function onChange() {
			if (settings.preserveHeight) {
				var height = $(iboxImage).height() + "px";
				$(btnPrev).css({"line-height": height, "height": height});
				$(btnNext).css({"line-height": height, "height": height});
			}
			$(btnPrev).show(); $(btnNext).show();
			settings.afterChange && settings.afterChange(); //call event
		};

		function getImage(i) { setIndex(i); return $(self[i]).attr("href"); };
		function setImage(i) {
			$(btnPrev).hide(); $(btnNext).hide();
			settings.beforeChange && settings.beforeChange(); //call event
			$(iboxTitle).html($(self[i]).attr("title")); //set title image
			$($("a", iboxBullets).removeClass(settings.classActiveBullet)[i])
								.addClass(settings.classActiveBullet);
			$(iboxImage).fadeOut(settings.duration, function() { //fade old image
				$(this).attr("src", getImage(i)).fadeIn(settings.duration, onChange);
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
