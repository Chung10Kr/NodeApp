/*
 * class 사용 
 * 
 * entrKey - fn_enter()함수 호출
 * intCheck - 숫자만 입력 가능
 * floatCheck - 소수점 숫자만 입력 가능
 * notHangul - 영문,숫자만 입력 가능
 * timeCheck - 시간,분 체크
 * 
**/
$(document).ready(function() {
	//fn_enter()함수 호출
    $(".entrKey").keypress(function(e) {
    	if('13' == e.keyCode){
    		if( typeof(fn_enter) == 'function' ) {
    			fn_enter();
    		}else if( typeof(goSearch) == 'function' ) {
    			goSearch();
    		}
    		return false;
    	}
    });
	//(숫자만 입력 가능)
	$(".intCheck").css('imeMode', 'disabled').keypress(function(event) {
		if (event.which && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
	}).keyup(function() {
		if ($(this).val() != null && $(this).val() != '') {
			$(this).val($(this).val().replace(/[^0-9]/g, ''));
		}
	});
	
	
	//정수만 입력
	$(".floatCheck").css('imeMode', 'disabled');
	$(document).on('keypress', ".floatCheck", function(event) {
		if (event.which && ( (event.which != 45 && event.which < 48) || event.which > 57)&& (event.which != 46)) {
			event.preventDefault();
		}
	}).on('focusout', ".floatCheck", function() {
		//console.log($(this).attr("max"));
		if ($(this).val() != null && $(this).val() != '') {
			if (isNaN(Number($(this).val()))) {
				alert("잘못된 값입니다.");
				$(this).val('');
				$(this).focus();
			}
		}
	}).on('keyup', ".floatCheck62", function() {
		var num = $(this).val();
		var pattern = /^(\d{1,6})([.]\d{0,2}?)?$/; // 정규식
		if ( !pattern.test(num) && num != '') {
			if ( num.indexOf('.') > 0) {	// 정수인지 아닌지 판별
				num = Number(num);
				//num = Math.floor(num*100)/100;
				num = num.toFixed(2);
			} else {
				num = num.substring(0,6);
			}
			$(this).val(num);
		}
	}).on('keyup', ".floatCheck64", function() {
		var num = $(this).val();
		var pattern = /^(\d{1,6})([.]\d{0,4}?)?$/; // 정규식
		if ( !pattern.test(num) && num != '') {
			if ( num.indexOf('.') > 0) {	// 정수인지 아닌지 판별
				num = Number(num);
				//num = Math.floor(num*100)/100;
				num = num.toFixed(4);
			} else {
				num = num.substring(0,6);
			}
			$(this).val(num);
		}
	});
	
	$(".floatCheckEtc").css('imeMode', 'disabled');
	$(document).on('keypress', ".floatCheckEtc", function(event) {
		console.log($(this).attr("class"));
		if (event.which && ( (event.which != 45 && event.which < 48) || event.which > 57)&& (event.which != 46)) {
			event.preventDefault();
		}
	}).on('focusout', ".floatCheckEtc", function() {
		if ($(this).val() != null && $(this).val() != '') {
			if (isNaN(Number($(this).val())) && $(this).val() != "-") {
				alert("잘못된 값입니다.");
				$(this).val('');
				$(this).focus();
				$(this).css("background-color", "#ffffff");
			}
		}
	}).on('keyup', ".floatCheckEtc", function() {
		var classNm = $(this).attr("class");
		if(classNm.indexOf("cipher") > 0 ){
			var cipher = parseInt(classNm.substr(classNm.indexOf("cipher")+6));
			var num = $(this).val();
			if ( !isNaN(Number($(this).val())) && num != '') {
				
				if ( num.indexOf('.') > 0) {	// 정수인지 아닌지 판별
					
					if(num.substr(num.indexOf('.')+1).length > cipher){
						num = Number(num);
						num = num.toFixed(cipher);	
					}
					
				} else {
					num = num.substring(0,15);
				}
				$(this).val(num);
			}
		}
	});
		
	//(영문,숫자만 입력 가능)
	$(".notHangul").css('imeMode', 'disabled').keypress(
			function(event) {
				if (event.keyCode >= 37 && event.keyCode <= 40) {
					event.preventDefault();
				}
			}).keyup(function() {
		if ($(this).val() != null && $(this).val() != '') {
			$(this).val($(this).val().replace(/[^a-z0-9]/gi, ''));
		}
	});
  
	//시간,분 체크
	$(".timeCheck").keyup(function() {
		var time = this.value;
		if (time.length == 4) {
			var t1 = time.substr(0, 2);
			var t2 = time.substr(2, 2);
			if (t1 > 23) {
				alert("잘못된 시간입니다 \n다시입력하세요");
				this.value = "";
				this.focus();
				return;
			}
			if (t2 > 59) {
				alert("잘못된 시간입니다 \n다시입력하세요");
				this.value = "";
				this.focus();
				return;
			}
			time = time.substr(0, 2) + ":" + time.substr(2, 2);
			this.value = time;
		}
	});
	
	$(document).on('click', ".selRow tbody tr", function() {
		if($(this).parent().parent().parent().attr("class")=='colTable'){
			//
		}else{
			$(this).addClass("on");
	        $(this).siblings().removeClass("on");	
		}
		
	});
	
});


/**
 * 필수값 체크 함수
 * gfnValidate(document.editForm);
 * @param frm
 * @returns {Boolean}
 */
function gfnValidate(frm) {
	var returnVal = true;
	$(".errInpt").removeClass("errInpt");
	var cnObj = $(frm).find(".checkNull");
	for(var i = 0; i<cnObj.length; i++){
		
		if($(cnObj[i]).prop("disabled") || $(cnObj[i]).attr("type") == "hidden" || $(cnObj[i]).css("display") == "none"){
			continue;
		}
		
		returnVal = nullCheck01(cnObj[i]);
		if(returnVal == false){
			if ($(cnObj[i]).prop("tagName").toLowerCase() == "select" || $(cnObj[i]).attr("type") == "radio" || $(cnObj[i]).attr("type") == "checkbox" || $(cnObj[i]).attr("type") == "file"){
				alert($(cnObj[i]).attr("title") + "은(는) 값이 선택되지 않았습니다.");
				if($(cnObj[i]).attr("onchange") != undefined){
					$(cnObj[i]).attr("onchange",$(cnObj[i]).attr("onchange").replace("return false","")+";$(this).removeClass('errInpt');return false;");
				}else{
					$(cnObj[i]).attr("onchange","$(this).removeClass('errInpt');return false;");
				}
			}else{
				alert($(cnObj[i]).attr("title") + "은(는) 값이 입력되지 않았습니다.");
				if($(cnObj[i]).attr("onkeyup") != undefined){
					$(cnObj[i]).attr("onkeyup",$(cnObj[i]).attr("onkeyup").replace("return false","")+";$(this).removeClass('errInpt');return false;");
				}else{
					$(cnObj[i]).attr("onkeyup","$(this).removeClass('errInpt');return false;");
				}
			}
			
			//LCY - 미입력 값의 해당 div 로 이동 , Tab on
			var $div = $(cnObj[i]).parents('.dep2_content');                  //Find wrong tab
			
			var index = $(".dep2_content").index($div);						  //tab index	
			$("ul.dep2_tab li a").removeClass("on");                          //Remove any "active" class
			$("ul.dep2_tab li a:eq("+index+")").addClass("on");               //Add "active" class to selected tab
			
			$(".dep2_content").hide();                          			  //Hide all tab content
			var activeTab = $("ul.dep2_tab li a:eq("+index+")").attr("href"); //Find the rel attribute value to identify the active tab + content
			$(activeTab).fadeIn();											  //Fade in the active content
			
			//LCY - 미입력 값의 해당 div 로 이동, Tab on			
			
			$(cnObj[i]).addClass('errInpt');
			$(cnObj[i]).focus();

			
			return returnVal;
		}
	}
	
	var cnObj2 = $(frm).find(".emailck");
	for(var i = 0; i<cnObj2.length; i++){
		
		if($(cnObj2[i]).prop("disabled") || $(cnObj2[i]).attr("type") == "hidden" || $(cnObj2[i]).css("display") == "none"){
			continue;
		}
		
		returnVal = emailCheck(cnObj2[i]);
		if(returnVal == false){
			alert($(cnObj2[i]).attr("title") + "은(는) 이메일 입력값이 올바르지 않습니다.");
			if($(cnObj2[i]).attr("onkeyup") != undefined){
				$(cnObj2[i]).attr("onkeyup",$(cnObj2[i]).attr("onkeyup").replace("return false","")+";$(this).removeClass('errInpt');return false;");
			}else{
				$(cnObj2[i]).attr("onkeyup","$(this).removeClass('errInpt');return false;");
			}
			$(cnObj2[i]).addClass('errInpt');
			$(cnObj2[i]).focus();
			return returnVal;
		}
	}
	
	return returnVal;
}

function emailCheck(obj) {
	var pattern = /^[_a-zA-Z0-9-\.\_]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
	if ((pattern.test(obj.value)) == false) {
		obj.value = "";
	}
	return (pattern.test(obj.value)) ? true : false;
}

/**
 * nullCheck 검증 (빈값체크)
 * 
 * @param
 * @return boolean
 */
function nullCheck01(obj) {
	if (obj.style.display == "none") {
		return true;
	} else {
		if (obj.type == "select") {
			if (obj.selectedIndex > -1 && obj.value != ""
					&& obj.value != undefined)
				return true;
			else
				return false;
		} else if (obj.type == "checkbox" || obj.type == "radio") {
			if ($('input[name=' + obj.name + ']:checked').length > 0)
				return true;
			else
				return false;
		} else {
			// 추가 공백 체크 부분 2013.08.14
			if (frmTrim(obj.value).length == 0) {
				return false;
			} else {
				// input type file은 값을 삽입 할 수 없다. 더이상 지원하지 않는다고 합니다.
				if (obj.type != "file") {
					obj.value = frmTrim(obj.value);
				}
			}

			if (obj.style.display != "none" && obj.value == "") {
				return false;
			} else {
				return true;
			}
		}
	}
}

/**
 * trim 추가
 */
function frmTrim(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}   


$.fn.rowspan = function(colIdx, isStats) {       
    return this.each(function(){      
        var that;     
        $('tr', this).each(function(row) {      
            $('td:eq('+colIdx+')', this).filter(':visible').each(function(col) {
                 
                if ($(this).html() == $(that).html()
                    && (!isStats 
                            || isStats && $(this).prev().html() == $(that).prev().html()
                            )
                    ) {            
                    rowspan = $(that).attr("rowspan") || 1;
                    rowspan = Number(rowspan)+1;
 
                    $(that).attr("rowspan",rowspan);
                     
                    // do your action for the colspan cell here            
                    $(this).hide();
                     
                    //$(this).remove(); 
                    // do your action for the old cell here
                     
                } else {            
                    that = this;         
                }          
                 
                // set the that if not already set
                that = (that == null) ? this : that;      
            });     
        });    
    })
};
