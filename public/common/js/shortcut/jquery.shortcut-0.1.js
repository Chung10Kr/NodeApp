/**
 * @author http://stove99.tistory.com/105
 * jQuery shortcut plug-in v0.1
 * 2011/11/18
 */
;(function($){
	$.shortcut = function(shortcuts){
		if(shortcuts){
			$(document).keyup(function(e){
				var el = e.srcElement ? e.srcElement : e.target;
				if( !(e.altKey || e.metaKey || e.shiftKey) & !$(el).is(":input") ){
					$.each(shortcuts, function(keycode, fnc){
						if(e.which==keycode && fnc ) fnc();
					});
				}
			});
		}
	};
})(jQuery);