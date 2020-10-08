

/*************************Chart Start*************************/
/*
차트 초기 설정
*/
function initChart(){
	google.charts.load('current', {'packages':['corechart']});
	google.charts.load('current', {'packages':['bar']});
	
	
    for (let i = 0; i < arguments.length; i++) {
        google.charts.setOnLoadCallback( arguments[i] );
    }
	
	//가변인자 함수
	
};


/*
p_chartType : 차트 종류 (AreaChart,BarChart,ComboChart,PieChart,LineChart)
P_datas ,   : 차트 데이터
p_options , : 차트 옵션
p_chartArea : 차트 DIV Id
*/
function setArrayChart(p_chartType , P_datas , p_options , p_chartArea ){
	
	var data = google.visualization.arrayToDataTable(P_datas);
	
	var options = p_options;
	
	var chart ;
	if( p_chartType == 'AreaChart'){
		chart = new google.visualization.AreaChart(document.getElementById(p_chartArea));
	}else if( p_chartType == 'BarChart'){
		chart = new google.charts.Bar(document.getElementById(p_chartArea));
	}else if( p_chartType =='ComboChart'){
		chart = new google.visualization.ComboChart(document.getElementById(p_chartArea));
	}else if( p_chartType =='PieChart'){
		chart = new google.visualization.PieChart(document.getElementById(p_chartArea));
	}else if( p_chartType =='LineChart'){
		chart = new google.visualization.LineChart(document.getElementById(p_chartArea));
	}
	chart.draw(data, options);
};
/*
p_chartType : 차트 종류 (InterChart)
P_datas ,   : 차트 데이터
p_options , : 차트 옵션
p_chartArea : 차트 DIV Id
*/
function setDataChart(p_chartType , P_datas , p_options , p_chartArea ){
	
		var data = new google.visualization.DataTable();
        data.addColumn('number', 'x');
        data.addColumn('number', 'values');
        data.addColumn({id:'i0', type:'number', role:'interval'});
        data.addColumn({id:'i1', type:'number', role:'interval'});
		data.addRows(P_datas);

		var chart;
		if( p_chartType = 'InterChart'){
			chart = new google.visualization.LineChart(document.getElementById(p_chartArea));
		}
        chart.draw(data, p_options);
};
/*************************Chart End*************************/




/**
 * 함수 설명 : 코드성 콤보박스 생성
 * @param type  :  S:선택, A:전체,null:없음, 그외에는 표시값을 표시
 * @param id  :  id
 * @param params  :  파라미터
 * @param async  :  동기/비동기 여부
 * @param selVal  :  초기값 세팅 -  필요할 경우 사용
 */
function setComboBoxList(type, id, params, async, selVal) {
	var obj  = $("#"+id);
	obj.html("");
	  var url = "/web/codeUtil/codeListAjax";
	  var params = params;
	  var sucessFunc = function(data) {
	    var list = data.list;
	    if(type == "S"){
	    	AddOptionSelectBox(obj, '', false, '-선택-');	
	    }else if(type == "A"){
	    	AddOptionSelectBox(obj, '', false, '-전체-');
	    }else if(type != "" && type != undefined && type != null ){
	    	AddOptionSelectBox(obj, '', false, type);
	    }
	    
	    for (var i = 0; i < list.length; i++) {
	      var ck = false;
	      if(list[i].CODE == selVal) ck = true;
	      var codeNm = list[i].CODE_NM; 
	      if(codeNm == undefined) codeNm = list[i].CODE;
	      AddOptionSelectBox(obj, list[i].CODE, ck, codeNm);
	    }
	  };
	  ajaxCall(url, params, sucessFunc, "", async);
}


/**
 * selectBox 생성
 * @param $element
 * @param strValue
 * @param bSelected
 * @param strText
 */
function AddOptionSelectBox($element, strValue, bSelected, strText){
  if( bSelected )
    $element.append('<option value="'+strValue+'" selected>'+strText+'</option>');
  else
    $element.append('<option value="'+strValue+'">'+strText+'</option>');
}	


/**
 * 함수 설명 : 엑셀 다운로드 시 사용 - 다운로드 시간이 오래걸리는 경우 사용 (화면에 다운로드 중이라고 표시해줌)
 * @param formId  :  form id
 */
function excelDownLoad(url ,formId){
	startDownBlockUi();
	var formObj = $("#"+formId);
	$.fileDownload(url,{
        httpMethod:'POST', 
        data: formObj.serialize()
       })
       .done(function (url) {
    	   stopBluckUi();
       })
       .fail(function (responseHtml, url) {
    	   stopBluckUi();
    	   alert("시스템 오류가 발생하였습니다.\n잠시후에 사용하시기 바랍니다.")
       });
}

/**
 * 함수 설명 : 엑셀 다운로드 시 사용 - 다운로드 시간이 오래걸리는 경우 사용 (화면에 다운로드 중이라고 표시해줌)
 * @param url  :  요청 URL
 * @param paramData  :  요청 데이타
 */
function excelDownLoadParamData(url , paramData){
	startDownBlockUi();
	$.fileDownload(url,{
		httpMethod:'POST', 
		data: paramData
	})
	.done(function (url) {
		stopBluckUi();
	})
	.fail(function (responseHtml, url) {
		stopBluckUi();
		alert("시스템 오류가 발생하였습니다.\n잠시후에 사용하시기 바랍니다.")
	});
}

/**
 * 함수 설명 : blockUi - 엑셀 다운로드용
 */
function startDownBlockUi(){
	startBlockUi("엑셀 다운로드 중입니다.....<br/>잠시만 기다려 주시기 바랍니다.");
}

/**
 * 함수 설명 : blockUi - Ajax 조회용
 * @param msg  :  보여지는 메시지 글
 */
function startBlockUi(msg){
	if(msg == undefined) msg = '데이터 로딩중입니다.....<br/>잠시만 기다려 주시기 바랍니다.';
	$.blockUI({ message: msg,css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff'
    } });
	/*$.blockUI({ message: null, overlayCSS: { backgroundColor: '#f5f5f5' ,opacity : 0.6}});*/
}
/**
 * 함수 설명 : blockUi 종료
 */
function stopBluckUi(){
	$.unblockUI();
}

var ajaxCallHtmlCnt = 0;
function ajaxCallHtml(url,params,sucessFun,errorFun, async){
	ajaxCallHtmlCnt += 1;
	//console.log(ajaxCallHtmlCnt)
  if(async == undefined) async = true;
  $.ajax({
	  	cache : false,
        type: "POST",
        url: url,
        data: params,
        async: async,
        dataType: 'html',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
        success: function(data){
        	var result = data;
        	try{
        		result = JSON.parse(data);
        	}catch(e){
        		result = data;
        	}
        	
          if(result.errorCode != undefined && result.errorCode == '401'){
                alert(result.message);
                location.href= "/web";
                if(typeof(errorFun) == 'function') errorFun(result);
                return;
            }
          if(result.message != undefined && result.message != ''){
            alert(result.message);
          }
          if(typeof(sucessFun) == 'function') sucessFun(result);
        }, 
        error : function(xhr, status, error){
            
            return;
        },
        beforeSend : function(){
        	startBlockUi();
		},
		complete : function(){
			ajaxCallHtmlCnt -= 1;
			//console.log("ajaxCallHtmlCnt : " + ajaxCallHtmlCnt);
			if(ajaxCallHtmlCnt == 0) stopBluckUi();
			//
		}
    });
}


function ajaxfileUpload(url,formId,sucessFun,errorFun){
	var formData = new FormData($("#"+formId)[0]);
	$.ajax({
			cache : false,
			async : true, //동기통신 false, 비동기통신 true
			processData : false,
			dataType : "json",
			url : url,
			type : 'post',
			enctype : "multipart/form-data",
			data : formData,
			contentType : false,
			//submit이후의 처리
			success : function(data) {
		          if(data.errorCode != undefined && data.errorCode == '401'){
		                alert(data.message);
		                if(typeof(errorFun) == 'function') errorFun(data);
		                return;
		            }
		          if(data.message != undefined && data.message != ''){
		            alert(data.message);
		          }
		          if(typeof(sucessFun) == 'function') sucessFun(data);
			},
			error : function(e) {
				alert("시스템 오류가 발생하였습니다.\n엑설 서식에 문제가 있습니다.");
	            if(typeof(errorFun) == 'function') errorFun();
	            return;
			},
			beforeSend : function(){
				startBlockUi("엑셀 업로드 중입니다.....<br/>잠시만 기다려 주시기 바랍니다.");
			},
			complete : function(){
				stopBluckUi();
			}
		});
}

function ajaxfileUploadHtml(url,formId,sucessFun,errorFun){
	var formData = new FormData($("#"+formId)[0]);
	$.ajax({
			cache : false,
			async : true, //동기통신 false, 비동기통신 true
			processData : false,
			dataType : "html",
			url : url,
			type : 'post',
			enctype : "multipart/form-data",
			data : formData,
	        contentType: false,
	        success: function(data){
	        	var result = data;
	        	if(result.errorCode != undefined && result.errorCode == '401'){
	                alert(result.message);
	                location.href= "/web";
	                if(typeof(errorFun) == 'function') errorFun(result);
	                return;
	            }
	        	if(result.message != undefined && result.message != ''){
	        		alert(result.message);
	        	}
	        	if(typeof(sucessFun) == 'function') sucessFun(result);
	        }, 
	        error : function(xhr, status, error){
	            alert("시스템 오류가 발생하였습니다."+error);
	            if(typeof(errorFun) == 'function') errorFun();
	            return;
	        },
	        beforeSend : function(){
	        	startBlockUi();
			},
			complete : function(){
				stopBluckUi();
			}
	    });
}

function ajaxCall(url,params,sucessFun,errorFun, async){
  if(async == undefined) async = true;
  $("#viewLoading").show();
  $.ajax({
	  	cache : false,
        type: "POST",
        url: url,
        data: params,
        async: async,
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
        success: function(data){
          //$("#viewLoading").hide();
          if(data.errorCode != undefined && data.errorCode == '401'){
                alert(data.message);
                if(typeof(errorFun) == 'function') errorFun(data);
                return;
            }
          if(data.message != undefined && data.message != ''){
            alert(data.message);
          }
          if(typeof(sucessFun) == 'function') sucessFun(data);
        }, 
        error : function(xhr, status, error){
        	stopBluckUi();
            return;
        }
    });
}

/**
 * Array 파라미터 정보를 전송할경우 사용
 * (ajax option으로 traditional :true 설정)
 * @param url
 * @param params : Array 파라미터
 * @param sucessFun
 * @param errorFun
 * @param async
 */
function ajaxTraditionalCall(url,params,sucessFun,errorFun, async){
	  if(async == undefined) async = true;
	  $("#viewLoading").show();
	  $.ajax({
		  	cache : false,
	        type: "POST",
	        url: url,
	        traditional :true,
	        data: params,
	        async: async,
	        dataType: 'json',
	        contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
	        success: function(data){
	          //$("#viewLoading").hide();
	          if(data.errorCode != undefined && data.errorCode == '401'){
	                alert(data.message);
	                if(typeof(errorFun) == 'function') errorFun(data);
	                return;
	            }
	          if(data.message != undefined && data.message != ''){
	            alert(data.message);
	          }
	          if(typeof(sucessFun) == 'function') sucessFun(data);
	        }, 
	        error : function(xhr, status, error){
	          //$("#viewLoading").hide();
	        	stopBluckUi();
	            alert("시스템 오류가 발생하였습니다."+error);
	            if(typeof(errorFun) == 'function') errorFun();
	            return;
	        }
	    });
	}
/************************************************* 달력 하나에 사용 되는 공통 함수 Begin *************************************************/
/**
 * 함수 설명 : 달력(DatePicker)적용 - 개별 날짜 사용시 사용
 * @param obj  :  해당 객체
 * @param dateformat  :  날짜형식
 */
function gfnSetDatePickerOne(obj, dateformat) {
	
	if(dateformat == "" || dateformat == undefined){
		dateformat = 'yy-mm-dd';
	}
    $( obj ).datepicker({
    	closeText: '닫기',
    	prevText: '이전달',
    	nextText: '다음달',
    	currentText: '오늘',
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월' ],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: dateformat,   // 날짜형식 = 20130329
		autoSize: false,    // 자동리사이즈 (false 이면 상위 정의에 따름)
		changeMonth: true,   // 월변경 가능
		changeYear: true,   // 연변경 가능
		showMonthAterYear: true,  // 년 위에 월 표시
		showOn: 'both',    // 엘리먼트와 이미지 동시사용 (both, button)
		buttonImageOnly: true,   // 이미지 표시
		buttonText: '달력',   // 버튼 텍스트 표시
		buttonImage: '/com/images/calendar.png',  // 이미지 주소
		showMonthAfterYear: true,
		showButtonPanel: true,
		onSelect: function(){ //날짜 선택시 호출되는 함수
			  $(this).removeClass("errInpt");
	        },
		//yearRange: 'c-99:c+99',  // 1990~2020년 까지
		//maxDate: '+6Y',    // 오늘 부터 6년 후까지만.  +0d 오늘 이전 날짜만 선택
		//minDate: '-30d'
	});
    
}
/************************************************* 달력 하나에 사용 되는 공통 함수 end *************************************************/

/************************************************* 달력 기간에 사용 되는 공통 함수 Begin *************************************************/
/**
 * 함수 설명 : 기간 날짜 설정 간단하게 세팅하는 함수 input id는 고정으로 사용 startDay,endDay 
 * @param obj  :  해당 객체
 * @param dateformat  :  날짜형식
 */
function gfnInitDatePickerTwo(){
	gfnSetDatePickerTwo($("#startDay"));
	gfnSetDatePickerTwo($("#endDay"));
}
/**
 * 함수 설명 : 달력(DatePicker)적용 - 시작날짜와 종료날짜 같이 사용할 경우 이함수사용
 * @param obj  :  해당 객체
 * @param dateformat  :  날짜형식
 */
function gfnSetDatePickerTwo(obj, dateformat) {
	
	if(dateformat == "" || dateformat == undefined){
		dateformat = 'yy-mm-dd';
	}
    $( obj ).datepicker({
    	closeText: '닫기',
    	prevText: '이전달',
    	nextText: '다음달',
    	currentText: '오늘',
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월' ],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: dateformat,   // 날짜형식 = 20130329
		autoSize: false,    // 자동리사이즈 (false 이면 상위 정의에 따름)
		changeMonth: true,   // 월변경 가능
		changeYear: true,   // 연변경 가능
		showMonthAterYear: true,  // 년 위에 월 표시
		showOn: 'both',    // 엘리먼트와 이미지 동시사용 (both, button)
		buttonImageOnly: true,   // 이미지 표시
		buttonText: '달력',   // 버튼 텍스트 표시
		buttonImage: '/com/images/calendar.png',  // 이미지 주소
		showMonthAfterYear: true,
		showButtonPanel: true,
		onSelect: function(){ //날짜 선택시 호출되는 함수
		  $(this).removeClass("errInpt");
		  if(typeof(gfnSelectDPEvent) == 'function') gfnSelectDPEvent(this);
        },
        minDate : (typeof(gfnSetDPMinDate) == 'function')?gfnSetDPMinDate($( obj )):'',
        maxDate : (typeof(gfnSetDPMaxDate) == 'function')?gfnSetDPMaxDate($( obj )):''
        
		//yearRange: 'c-99:c+99',  // 1990~2020년 까지
		//maxDate: '+6Y',    // 오늘 부터 6년 후까지만.  +0d 오늘 이전 날짜만 선택
		//minDate: '-30d'
	});
}

//달력 선택시 min,max 값 재설정
function gfnSelectDPEvent(obj) {
	var id = $(obj).attr("id");
	if (id == "startDay") {
		$('#endDay').datepicker("option", "minDate", $("#startDay").val());
	} else if (id == "endDay") {
		$('#startDay').datepicker("option", "maxDate", $("#endDay").val());
	}
}
//시작날짜의 min날짜 설정
function gfnSetDPMinDate(obj) {
	var retVal = "";
	var id = $(obj).attr("id");
	if (id == "endDay") {
		retVal = $("#startDay").val();
	}
	return retVal;
}
//시작날짜의 max날짜 설정
function gfnSetDPMaxDate(obj) {
	var retVal = "";
	var id = $(obj).attr("id");
	if (id == "startDay") {
		retVal = $("#endDay").val();
	}
	return retVal;
}
/************************************************* 달력 기간에 사용 되는 공통 함수 End *************************************************/


/************************************************* Jquery를 좀더 쉽게 사용하기 위해 만든 공통 함수 Begin *************************************************/
/**
 * 함수 설명 : selectBox 값을 리턴함
 * @param ojbIdorNm  :  id 및 name값을 인자로 사용(필수)
 */
function gfnIdVal(ojbId){
	var retVal = "";
	if(ojbId != undefined) retVal = $("#"+ojbId).val(); 
	return gfnCheckNull(retVal);
}

/**
 * 함수 설명 : selectBox 값을 리턴함
 * @param ojbIdorNm  :  id 및 name값을 인자로 사용(필수)
 */
function gfnSelectBoxVal(ojbIdorNm){
	var retVal = "";
	if(ojbIdorNm != undefined) retVal = $("#"+ojbIdorNm+" option:selected").val(); 
	if(retVal == undefined) retVal = $("select[name="+getSelectBoxVal+"]").val();
	return gfnCheckNull(retVal);
}

/**
 * 함수 설명 : radio 값을 리턴함
 * @param ojbNm  :  name값을 인자로 사용(필수)
 */
function gfnRadioVal(ojbNm){
	var retVal = "";
	if(retVal == undefined) retVal = $("input:radio[name="+ojbNm+"]:checked").val();
	return gfnCheckNull(retVal);
}
/************************************************* Jquery를 좀더 쉽게 사용하기 위해 만든 공통 함수 End *************************************************/


/************************************************* 편리하기 사용하기 위해 만든 공통 유틸 javascript Begin *************************************************/
/**
 * 함수 설명 : null값을 다른 문자열로 대체, 대체문자열이 없을 경우 공백으로 리턴
 * @param data :  검사 데이터값(필수)
 * @param chr  :  대체문자 
 */
function gfnCheckNull(data , chr){
    if(chr == null || chr == undefined) chr ='';
    
    if(data == null || data == undefined || data== 'null'|| data === ''){
        return chr;
    }else{
        return data;
    }   
}

/**
 * 함수 설명 : null값을 '-' 바 형태의 문자열로 리턴
 * @param data :  검사 데이터값(필수)
 */
function gfnCheckNullToBar(data){
	return gfnCheckNull(data,'-');
}

/**
* 체크된 항목들 값을 취합해서 리턴
* @param itemName 체크박스명
* @param delim    구분자
*/
function gfnCheckBoxCheckedToString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="")
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
		}
	}
	return s;
}

/**
* 특정이름의 멀티체크박스를 체크 또는 체크해제한다.
* ex) <input type=checkbox name=IDS value='...'>
*     <script language='javascript'>
*		gfnToggleMultiChk(this.checked, 'IDS')
*	   </script>
*
* @param bCheck    true|false(체크할 상태)
* @param itemName  체크대상 체크박스이름
*/
function gfnToggleMultiChk(bCheck, itemName){
	var obj = document.getElementsByName(itemName);
	if(typeof(obj) == 'undefined'){
		return;
	}

	for(var i=0; i<obj.length; i++){
		obj[i].checked = bCheck;
	}
}

/**
* input 객체들 구분자로 문자열 반환
* @param obj 해당 객체들 
*/
function gfnObjToString(obj){
	var len = obj.length;
	var ele = obj;
	var str="";
	if(obj.length > 1){
		for(var i=0; i < len; i++){
			if (i > 0) {
				str += "|";
			}
			str += ele[i].value;
		}
	}else{
		str = obj.value;
	}
	return str;
}

/**
* 체크된 항목들 값을 취합해서 리턴
* @param itemName 체크박스명
* @param delim    구분자
*/
function gfnMultiCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="" || div == undefined)
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
		}
	}
	return s;
}

function gfntMultiNonCheckedString(itemName, delim){
	var obj = document.getElementsByName(itemName);
	var div = delim;
	if(div=="" || div == undefined)
		div="|";
	var chkCnt=0;
	if(typeof(obj) == 'undefined'){
		return "";
	}
	var s="";
	var n=0;
	for(var i=0; i<obj.length; i++){
		if(obj[i].checked){
			
		}else{
			if(n>0)
				s += div;
			s += obj[i].value;
			n++;
			
		}
	}
	return s;
}


/**
* 팝업 오픈
* @param url URL 
* @param w 폭 
* @param h 너비
* @param s 스크롤바 여부 1, 'Y'이면 보여줌, 0, '', 'N'이면 숨김 
*/
function gfnPopup(url,w,h,s,target){

	var l, t, objPopup
	if(target == 'undefined' || target=='' || target==null) {
		var target='win1';
	}
	l = (screen.width-w)/2;
	t = (screen.height-h)/2;
	if(s==1 || s=="Y")
		objPopup  = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=1');
	else if (s=="" || s==0 || s=="N" || !s || s=="0" )
		objPopup = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=0,scrollbars=0,status=0');
	else
		objPopup = window.open(url,target,'width='+w+',height='+h+',left='+l+',top='+t+',resizable=1,menubar=1,toolbar=1,scrollbars=1,status=1');
	if (objPopup == null) {
		alert("차단된 팝업창을 허용해 주십시오.");
	}
	return objPopup;
}


/**
* 쿠키값 세팅
* @param cookieName 쿠키이릅 
* @param value 쿠키값
* @param exdays 만료일
*/
function gfnSetCookie(cookieName, value, exdays){
  if(value == undefined) value = "on";
  if(exdays == undefined) exdays = 1;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; path=/; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

/**
* 쿠키값 삭제
* @param cookieName 쿠키이릅 
*/
function gfnDeleteCookie(cookieName){
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; path=/; expires=" + expireDate.toGMTString();
}

/**
* 쿠키값 가져오기
* @param cookieName 쿠키이릅 
*/
function gfnGetCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

/* 쿠키 사용 팝업 닫기 */
function gfnCloseWin(cookieName){
	gfnSetCookie(cookieName);
	self.close();
}

/* 쿠키 사용 레이어 팝업 닫기 */
function gfnCloseLayer(cookieName){
	gfnSetCookie(cookieName);
	$("#"+cookieName).hide();
	return false;
}

//현재 메시지 바이트 수 계산
function gfnLengthMsg(objMsg) {
	var nbytes = 0;
	for (i = 0; i < objMsg.length; i++) {
		var ch = objMsg.charAt(i);
		if (escape(ch).length > 4) {
			nbytes += 2;
		} else if (ch == '\n') {
			if (objMsg.charAt(i - 1) != '\r') {
				nbytes += 1;
			}
		} else if (ch == '<' || ch == '>') {
			nbytes += 4;
		} else {
			nbytes += 1;
		}
	}
	return nbytes;
}
/*
 * 검색기간 체크
 * */
function gfnDayDifCheck(obj, obj2){
	var d1 = Number(obj.val().replace(/-/g, ''));
	var d2 = Number(obj2.val().replace(/-/g, ''));
	if (d2 - d1 < 0) {
		alert("기간설정이 잘못되었습니다.");
		obj.focus();
		return false;
	}
	return true
}


function gfnLeadingZeros(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (i = 0; i < digits - n.length; i++)
			zero += '0';
	
	}
	return zero + n;
}

function gfnCurYYYY(){
	var d = new Date();
	
	return gfnLeadingZeros(d.getFullYear(), 4);
}

function gfnCurMM(){
	var d = new Date();
	
	return gfnLeadingZeros(d.getMonth() + 1, 2);
}

function gfnCurDD(){
	var d = new Date();
	
	return gfnLeadingZeros(d.getDate(), 2);
}

function gfnCurDate(){
	var d = new Date();
	
	var date = '';
	
	date += gfnLeadingZeros(d.getFullYear(), 4) + '-';
	date += gfnLeadingZeros(d.getMonth() + 1, 2) + '-';
	date += gfnLeadingZeros(d.getDate(), 2) + ' ';
	date += gfnLeadingZeros(d.getHours(), 2) + ':';
	date += gfnLeadingZeros(d.getMinutes(), 2) + ':';
	date += gfnLeadingZeros(d.getSeconds(), 2);

	return date;
}


function gfnIsDateCheck(str) {
	if  ( !/([0-9]{4})([0-9]{2})([0-9]{2})/.test(str) )  {
		//alert("날짜의 형식이 잘못 입력되었습니다.\n예) 1996-04-05");
		return false;
	}
	// 현재 날짜
	var toDay = new Date();
	
	var arrDate0 = str.substr(0,4);
	var arrDate1 = str.substr(4,2);
	var arrDate2 = str.substr(6,2);
	
	var maxDay = new Date(new Date(arrDate0, arrDate1, 1) - 86400000).getDate();
	
	if  ( arrDate0 == 0000 || arrDate0 > toDay.getFullYear() )  {
		//alert("잘못된 년도를 입력하였습니다.");
		return false;
	}
	if  ( arrDate1 == 00 || arrDate1 > 12  )  {
		//alert("잘못된 월을 입력하였습니다.");
		return false;
	}
	if  ( arrDate2 == 00 || arrDate2 > maxDay )  {
		//alert("잘못된 일을 입력하였습니다.");
		return false;
	}
	return true;
}


/************************************************* 편리하기 사용하기 위해 만든 공통 유틸 javascript End *************************************************/




/**
 * 함수 설명 : 각 메뉴별 접근 로그 저장
 * @param menuNo :  메뉴번호
 */
function gfnInsertMenuLog(menuNo){
	if(menuNo == undefined || menuNo == '') return;
	var url = window.location.pathname;
	$.ajax({
		type : "POST",
		url : "/cms/insertMenuLogAjax",
		data : {
			menuNo : menuNo,
			url : url
		},
		async : true,
		dataType : 'json',
		contentType : "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
		success : function(data) {
		},
		error : function(xhr, status, error) {
			console.log("시스템 오류가 발생하였습니다." + error);
			return;
		}
	});
}

/**
 * 변수 설명 : 년도별 월 , 분기 설정
 */
var gfnQuterYearMnArray = {
    "2016": [["1월","1월"], ["2월","2월"],["3월","3월"],["4월","4월"],["5월","5월"],["6월","6월"],["7월","7월"],["8월","8월"],["9월","9월"],["10월","10월"],["11월","11월"],["12월","12월"]],
    "2017": [["1월","1월"], ["2월","2월"],["3월","3월"],["4월","4월"],["5월","5월"],["6월","6월"],["7월","7월"],["8월","8월"],["9월","9월"],["4/4","4/4분기"]],
    "2018": [["1/4","1/4분기"], ["2/4","2/4분기"],["7월","7월"],["8월","8월"],["9월","9월"],["4/4","4/4분기"]]
};
/**
 * 변수 설명 : 년도별 월 , 분기 검증 설정 
 */
var gfnQuterYearMnValidArray = {
		"2016": ["1월", "2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
		"2017": ["1월", "2월","3월","4월","5월","6월","7월","8월","9월","4/4"],
		"2018": ["1/4", "2/4","7월","8월","9월","4/4"]
};
/**
 * 함수 설명 : 년도별 월 , 분기 설정
 * @param data :  Year
 */
function gfnQuterYearMn(s,data){
	$("#half").empty();
	var str  =null; 
	if(s == 'S'){
		str = "<option value='' >-선택-</option>";	
	}else if(s=='A'){
		str = "<option value='' >-전체-</option>";
	}
	if(data != ''){
		var arrYearMnData = null;
		if(data <= 2016){
			arrYearMnData  = gfnQuterYearMnArray["2016"];
		}else if(data == 2017){
			arrYearMnData  = gfnQuterYearMnArray["2017"];
		}else if(data >= 2018){
			arrYearMnData  = gfnQuterYearMnArray["2018"];
		};
		for(var startIdx = 0; startIdx < arrYearMnData.length; startIdx++) {
			str += "<option value='"+arrYearMnData[startIdx][0]+"' >"+arrYearMnData[startIdx][1]+"</option>";
		}
	};
	$("#half").append(str);
}

/**
 * 함수 설명 : 시도, 시군구 담당자 들어올경우 관리기관 처리
 * @param p_sidoCode :  년도(필수)
 * @param p_sidoId :  분기(필수)
 * @param p_inputId :  선택된 값이 들어갈 ID()
 */
function gfnSidoSelcted(p_sidoCode , p_sidoId , p_inputId){
	if(p_inputId == undefined) p_inputId = "tdSido";
	//시도, 시군가 담당자가 들어올 경우 처리
	if( p_sidoCode != ""){
		if($("#"+p_sidoId).val() != ""){
			$("#"+p_sidoId).hide();
			$("#"+p_inputId).html( $("#"+p_inputId).html()+" "+$("#"+p_sidoId+" option:selected").text()  );
		}
	}
}
/**
 * 함수 설명 : 년도별 월 , 분기 검증
 * @param p_year :  년도(필수)
 * @param p_period :  분기(필수)
 */
var gfnQuterYearMnValid = function(p_year, p_period) {
    if(p_year == "" || p_period == "") {
        return false;
    }
    if(isNaN(p_year)) {
        return false;
    }
    var v_check = true;
    var arrYearMnValidData = null;
    if(p_year <= 2016){
    	arrYearMnValidData  = gfnQuterYearMnValidArray["2016"];
	}else if(p_year == 2017){
		arrYearMnValidData  = gfnQuterYearMnValidArray["2017"];
	}else if(p_year >= 2018){
		arrYearMnValidData  = gfnQuterYearMnValidArray["2018"];
	};
	 if( $.inArray( p_period, arrYearMnValidData ) < 0 ) {
         v_check = false;
     }
	 return v_check;
};
/**
 * 함수 설명 : 정규식으로 클래스 삭제
 * 사용법 : $(selector).removeClassRegex("정규식");
 *             // $("#inputForm [class*='indexRow_']").removeClassRegex(/^indexRow_/);
 * @param regex :  표현식
 */
$.fn.removeClassRegex = function(regex) {
    return $(this).removeClass(function(index, classes) {
        return classes.split(/\s+/).filter(function(c) {
            return regex.test(c);
        }).join(' ');
    });
};

//날자 기간 체크
function dateCheck(startId , endId){
	
	 var startDate =gfnIdVal(startId);
     var startDateArr = startDate.split('.');
      
     var endDate = gfnIdVal(endId);
     
     if( endDate != ''){
		 var endDateArr = endDate.split('.');
	     
	     var startDateCompare = new Date(startDateArr[0], parseInt(startDateArr[1])-1, startDateArr[2]);
	     var endDateCompare = new Date(endDateArr[0], parseInt(endDateArr[1])-1, endDateArr[2]);
	      
	     if(startDateCompare.getTime() > endDateCompare.getTime()) {
	         alert( $("#"+startId).attr("title")+", "+$("#"+endId).attr("title") +"를 확인해 주세요.");
	         return false;
	     }
     }
     return true; 
     
}


/**
 * 변수 설명 : 년도별 월 , 분기 검증 설정 
 */
var gfnQuterHaflMnValidArray = {
		"half_01": ["01", "02","03","04","05","06"],
		"half_02": ["07", "08","09","10","11","12"],
		"quter_01": ["01", "02","03"],
		"quter_02": ["04", "05","06"],
		"quter_03": ["07", "08","09"],
		"quter_04": ["10", "11","12"]
};
/*
 * 검사시기와 검사일자의 매칭 여부
 * ex) 검사시기 2018년 상반기 -> 검사일자는 2018년 상반기(1~6월만 가능)
 * */
function dateMatching(yearId ,htNm ,  htId , dateId){
	var year = gfnIdVal(yearId);
	var ht = gfnIdVal(htId);
	var dateDt = gfnIdVal(dateId);

	if(dateDt != ""){
		var dateDtArr = dateDt.split('.');
		 if(year != dateDtArr[0]){
			 alert( $("#"+yearId).attr("title")+"와 "+$("#"+dateId).attr("title") +"가 일치하지 않습니다.");
			return false;
	 	 }
		 if( $.inArray( dateDtArr[1], gfnQuterHaflMnValidArray[htNm+"_"+ht] ) < 0 ) {
			 alert( $("#"+htId).attr("title")+"와 "+$("#"+dateId).attr("title") +"가 일치하지 않습니다.");
			 return false;
	     };
	}
	return true;
}

function getCurTime(){
	curDate = new Date();
	return curDate.getFullYear()+"년"+(curDate.getMonth()+1)+"월"+curDate.getDate()+"일"+curDate.getHours()+":"+ curDate.getMinutes()+":"+curDate.getSeconds();
}

