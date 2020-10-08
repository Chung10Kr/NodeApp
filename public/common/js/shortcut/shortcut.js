
/**
 * 단축키 세팅
 *  0 : 화면 확대 / 축소
 *  8: 로딩화면 on
 *  esc : 로당화면 off 
 */
$(document).ready(function() {
	$.shortcut({
		//0
        48 : function(){
        	gfnExpand()
        },
        //esc
        27 : function(){
        	//stopBluckUi()
        },
        //8
        56 : function(){
        	//startBlockUi()
        }
    });
});


/**
 * 화면 확대/축소 함수
 * tablefix 사용시 재구성
 */
function gfnExpand(){
	var ss = $('#ajaxTable').height();
	if($("#leftmenu").css("display") == 'none'){
		$("#leftmenu").show();
		$("#header").show();
		$("#footer").show();
		$("#contentArea").addClass("content");
		$("#contentArea").css("width","1237px");//1237px
		$(".subcont2").css("width","1020px");//1020px 
	}else{
		$("#leftmenu").hide();
		$("#header").hide();
		$("#footer").hide();
		$("#contentArea").removeClass("content");
		$("#contentArea").css("width","100%");//1237px
		$(".subcont2").css("width","99%");//1020px
	}
	
	/*if($('#ajaxTable #tablefix').length > 1){
		var cloneTable = $($("#ajaxTable table")[0]).clone();
		var cloneHtml = $("#ajaxTable").clone();
		cloneHtml.find(".baseDiv").remove();
		cloneHtml.append(cloneTable);
		$("#ajaxTable").html("");
		$("#ajaxTable").append(cloneHtml);
		$('#ajaxTable #tablefix').tablefix({width: $("#cont").width()-2, height: ss, fixRows: 1});
	}
	
	if($('#ajaxTable2 #tablefix').length > 1){
		var cloneTable = $($("#ajaxTable2 table")[0]).clone()
		var cloneHtml = $("#ajaxTable2").clone();
		cloneHtml.find(".baseDiv").remove();
		cloneHtml.append(cloneTable)
		$("#ajaxTable2").html("");
		$("#ajaxTable2").append(cloneHtml);
		$('#ajaxTable2 #tablefix').tablefix({width: $("#cont").width()-2, height: ss, fixRows: 1});
	}*/
}

