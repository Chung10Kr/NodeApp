/**수치맺음메세지*/
var changeAlert = function(data,replaceVal){
	//console.log("data : " + data + ", replaceVal : " +  replaceVal);
    alert("수치맺음법이 적용되었습니다.\n"+"[변경전 : "+data+"변경후 : "+replaceVal+" ]");
};
/**수치맺음*/
var autoCompleteValue = function(obj){
    var v_index = $(obj).attr("orderIndex");
    var v_title = $(obj).attr("title");
    var v_data = $(obj).val();
    //var replaceVal = gfnGwReplaceValue(v_data,v_index);
    var replaceVal = gfnGwReplaceValueNew(v_data,v_index, v_title);
    if(replaceVal != v_data && replaceVal){
    	$(obj).val(replaceVal);
    }
    return replaceVal;
};
/**검증*/
var fnValidationData = function(targetObject) {
	fnValidationDataCheck(targetObject, false);
};
/**검증 */
var fnValidationData = function(targetObject, p_excel) {
    var v_maxVal = parseFloat($(targetObject).attr("max"));
    var v_minVal = parseFloat($(targetObject).attr("min"));
    var v_minLimit = parseFloat($(targetObject).attr("minLimit"));
    var v_maxLimit = parseFloat($(targetObject).attr("maxLimit"));
    var v_iccode = $.trim($(targetObject).attr("iccode"));
    
    var v_causeYn = $.trim($(targetObject).attr("causeYn")); //미검사사유 입력 = N , 미검사사유 미입력 = Y

    //var v_dkyn = $.trim($(targetObject).attr("dkyn"));
    var v_selVal = $(targetObject).val();//2018.12.18 스페이스 등록 가능
    //var v_selVal = (isNaN($(targetObject).val())||$(targetObject).val()=="")?$(targetObject).val():parseFloat($(targetObject).val());//2018.12.13 공백은 등록불가
    $(targetObject).css("background-color", "#ffffff");
    $(targetObject).attr("result", "0");
    
    if( v_causeYn == "N"){
    	//미검사 사유 입력됨 
    	if(v_selVal != ''){
    		//항목이 존재할경우 오류행
    		$(targetObject).css("background-color", "#ffc9c0");
            $(targetObject).attr("result", "1");//오류행
    	}
    }else{
	    if(v_iccode == "00001" && (v_selVal == "0" || v_selVal == "불검출" || v_selVal == "ND")) {//수소이온
	        $(targetObject).css("background-color", "#ffc9c0");
	        $(targetObject).attr("result", "1");
	    } else if(v_iccode == "00027" && (v_selVal == "0" || v_selVal == "불검출" || v_selVal == "ND")) {//전기전도도
	        $(targetObject).css("background-color", "#ffc9c0");
	        $(targetObject).attr("result", "1");
	    } else {
	        if(v_selVal.length == 0 && v_selVal == "") {//값이 없을 경우
	        	if(p_excel == true) {
	                $(targetObject).css("background-color", "#ffc9c0");
	                $(targetObject).attr("result", "1");//일괄등록에서 등록하는 경우, 오류로 설정
	        	} else {
	                $(targetObject).css("background-color", "#ffffff");
	                $(targetObject).attr("result", "0");//개별입력에서 등록하는 경우 정상으로 표시
	        	}
	        }else if(isNaN(v_selVal)){//숫자여부 체크
	            //var v_ckList = ["미검사", "ND", "적합", "검출", "부적합", "폐공", "음성", "검출", "2미만", "<2", "<1.8", "-", "<1.9", "2이하",  " "];
	            var v_ckList = ["미검사", "ND", "불검출","적합", "검출", "부적합", "폐공", "음성", "2미만", "<2", "<1.8", "<1.9", "2이하",  " "];
	            if($.inArray( v_selVal, v_ckList ) < 0) {
	                $(targetObject).css("background-color", "#ffc9c0");//입력값오류
	                $(targetObject).attr("result", "1");
	            }
	        } else if(parseFloat(v_selVal) > 999999 || parseFloat(v_selVal) < 0) {
	            $(targetObject).css("background-color", "#ffc9c0");//입력값오류
	            $(targetObject).attr("result", "1");
	        } else {
	            //최대값,최소값 범위초과시에는 기준값범위초과 사용 :2
	            //사용자정의 최소값,최대값 초과시에는 특이치 사용 : 3
	            if(v_maxVal != undefined){//최대값 체크
	                if(parseFloat(v_selVal) > v_maxVal){
	                    $(targetObject).css("background-color", "#c9ffc9");//기준값범위초과
	                    $(targetObject).attr("result", "2");
	                }
	            }
	            if(v_maxLimit != undefined) {
	                if(parseFloat(v_selVal) > v_maxLimit){
	                    $(targetObject).css("background-color", "#c9d7ff");//특이치
	                    $(targetObject).attr("result", "3");
	                }
	            }
	            if(v_minVal != undefined){//최소값 체크
	                if(parseFloat(v_selVal) < v_minVal){
	                    $(targetObject).css("background-color", "#c9ffc9");//기준값범위초과
	                    $(targetObject).attr("result", "2");
	                }
	            }
	            if(v_minLimit != undefined){
	                if(parseFloat(v_selVal) < v_minLimit){
	                    $(targetObject).css("background-color", "#c9d7ff");//특이치
	                    $(targetObject).attr("result", "3");
	                }
	            }
	        }
	    }
    
    }
};
/**
 * 함수 설명 : 값 치환
 * 사용법 : 
 * @param value :  입력값, 순번
 */
var gfnGwReplaceValueNew = function(value, index, title){
	var result=null;
    var pattern =/\s/g;
	try{
		 if(index=='1'||index=='19'){
		 //if(index=='1') {
			 if((value=='0'||value=='ND'||value=='불검출')){
				 //conPhEc();
				 conPhEcNew(title);
				 return value;
			 }
		 }
		 if(value.charAt(0)=='-'){
			 result=gfnGwReplaceChar(value); 
		 } else if(value.match(pattern)||value=='0'||isNaN(value)||value.toString().indexOf('.') == -1 ){
			 result=value;
		 } else{
	    	 //2018.12.13 소수점자리수 처리 막음
			 //result=getValidation(value,index);	
			 result=value;	
	     }
		 return result;
  	} finally{
  		result=null;
  	}
  	return result;
}; 
/**
 * 함수 설명 : 값 치환
 * 사용법 : 
 * @param value :  입력값, 순번
 */
var gfnGwReplaceValue = function(value, index){
	var result=null;
    var pattern =/\s/g;
	try{
		 if(index=='1'||index=='19'){
		 //if(index=='1') {
			 if((value=='0'||value=='ND'||value=='불검출')){
				 conPhEc();
				 return value;
			 }
		 }
		 if(value.charAt(0)=='-'){
			 result=gfnGwReplaceChar(value); 
		 } else if(value.match(pattern)||value=='0'||isNaN(value)||value.toString().indexOf('.') == -1 ){
			 result=value;
		 } else{
			 result=getValidation(value,index);	
	     }
		 return result;
  	} finally{
  		result=null;
  	}
  	return result;
}; 
var gfnGwReplaceChar = function(code){
	if ("-8888" == (code)) {
		return "미검사";
	} else if ("-9999" == (code)) {
		return "불검출";
	}  else if ("-9988" == (code)) {
		return "ND";
	} else if ("-9998" == (code)) {
		return "적합";
	} else if ("-9997" == (code)) {
		return "검출";
	} else if ("-9996" == (code)) {
		return "부적합";
	} else if ("-8811" == (code)) {
		return "폐공";
	} else if ("-7777" == (code)) {
		return "음성";
	} else if ("-6666" == (code)) {
		return "검출";
	} else if ("-5555" == (code)) {
		return "적합";
	} else if ("-5511" == (code)) {
		return "부적합";
	} else if ("-4444" == (code)) {
		return "2미만";
	} else if ("-4411" == (code)) {
		return "<2";
	} else if ("-4422" == (code)) {
		return "<1.8";
	} else if ("-3333" == (code)) {
		return "-";
	} else if ("-1111" == (code)) {
		return " ";
	} else if ("-4455" == (code)) {
		return "<1.9";
	} else if ("-4466" == (code)) {
		return "2이하";
	}else {
		return code;
	}
};

/**
  수소이온농도, 전기전도도에서
 0, 불검출, ND 로 입력한 경우 - 빨간색으로 표시되어야 하고
   팝업경고창에서는
 'pH,EC는 0,불검출(ND) 값이 나올 수 없습니다.'란 안내글 추가
 */
var conPhEc = function(){
	alert('pH,EC는 0,불검출(ND) 값이 나올 수 없습니다.');
};
/**
  수소이온농도, 전기전도도에서
 0, 불검출, ND 로 입력한 경우 - 빨간색으로 표시되어야 하고
   팝업경고창에서는
 'pH,EC는 0,불검출(ND) 값이 나올 수 없습니다.'란 안내글 추가
 */
var conPhEcNew = function(p_title){
	alert('['+p_title+'] 수소이온농도 또는 전기전도도는 0,불검출(ND) 값이 나올 수 없습니다.');
};

/*
    roundCn 시안 
    roundPhenol 페놀
    roundCd 카드뮴
    roundAs 비소
    roundHg 수은
    roundPb 납
    roundNo 3N질산성질소
    roundCi 염소이온
    roundCr6 6가 크롬
    roundOp 유기인
    roundTce 트리클로로에티렌
    roundPce 테트라클로로에틸렌
    roundTCE111 트리클로로에탄
    roundBenzene 벤젠
    roundToluene 톨루엔
    roundEthylBenzene 에틸벤젠
    roundXylene 크실렌
    roundChloroform 크로로포름
    roundChloroformMDL 클로로포름
    roundCarbontetrachloride 사염화탄소
    roundCarbontetrachlorideMDL 사염화탄소 MDL
    roundDichloroethane 디클로로에탄
    roundDichloroethaneMDL 디클로로에탄 MDL
    roundDichloroethaneMDL 디클로로에탄 MDL
    */

//분기처리
var getValidation = function(value,index){
	var ChemicalValue=parseFloat(value);
	var indexCol=parseInt(index);
	var result=null;
    switch(indexCol){
    					 case 1:
					    	//수소 이온농도
    						 	result=roundPh(ChemicalValue);
					    		break;
			               case 2:
			                     //질산성 질소
			            	    result=roundNo3N(ChemicalValue);
			                    break;
			               case 3:
			                      //염소이온
			            	   result=roundCi(ChemicalValue);
			                    break;
			               case 4:
			                      //카드뮴  
			            	   result=roundCd(ChemicalValue);
			            	   break;
			               case 5:
			                      //비소
			            	   result=roundAs(ChemicalValue);
			            	   break;     
			               case 6:
			                      //시안
			            	   result= roundCn(ChemicalValue);
			            	   break;
			               case 7:
			                      //수은
			            	   result=roundHg(ChemicalValue);
			            	   break;
			               case 8:
			                      //유기인
			            	   result= roundOp(ChemicalValue);
			            	   break; 
			               case 9:
			                      //페놀
			            	   result=roundPhenol(ChemicalValue);
			            	   break;    
			               case 10:
			                      //납
			            	   result= roundPb(ChemicalValue);
			            	   break;     
			               
			               case 11:
			                    // 6가크롬
			            	   result= roundCr6(ChemicalValue);
			            	   break;     
			               case 12:
			                    //트리클로로에틸렌
			            	   result= roundTce(ChemicalValue);
			            	   break;  
			               case 13:
			                    // 테트라클로로에틸렌
			            	   result= roundPce(ChemicalValue);
			            	   break;          
			               case 14:
			                    // 1.1.1-트리클로로에탄  
			            	   result= roundTCE111(ChemicalValue);
			            	   break;          
			               case 15:
			                    //벤젠
			            	   result=roundBenzene(ChemicalValue);
			            	  break;          
			               case 16:
			                    //톨루엔
			            	   result=roundToluene(ChemicalValue);
			            	   break;         
			               case 17:
			            	   //에틸벤젠
			            	   result=roundEthylBenzene(ChemicalValue);
			            	   break;        
			               case 18:
			            	   //크실렌
			            	   result=roundXylene(ChemicalValue);
		                       break;
				             default:
				            	 /* 정수부 반환, 총대장균 ,세균,전기전도도 */
				               result=parseInt(ChemicalValue);
				               break;
		}
	return result;
};

/*
반올림법 특이사항:
	 1) 6부터 올림
	 2) 4부터 버림
	 3) 5일 경우 무조건 올림이 아니라!
	     5 바로 앞자리가 1, 3, 5, 7, 9 일때는 올리고
	     5 바로 앞자리가 0, 2, 4, 6, 8 일때는 버림
	     (ex) 질산성질소는 둘째자리에서 반올림하여 소수점 첫째자리까지 표현해야하는데 
	           수치가 82.75 일땐 5 바로 앞자리가 7이므로 올림하여 82.8이고
	           수치가 82.65 일땐 5 바로 앞자리가 6이므로 버림하여 82.6이다.)
*/

/*
 *변수
 * realpart 실수부 
 * splitNum[0] 정수부
 * splitNum[1] 소수부
 * 
 * resultNum 결과
 * */
var roundMethod = function(num,digit){
	var resultNum=0;
	var realpart=num;
	var stringNum=realpart.toString();
	var splitNum=stringNum.split(".");
	try{
		if(parseInt(splitNum[1])>0){
			//소수부전체길이
			var index=splitNum[1].length;
			//소수부
			var fractionM=splitNum[1];
			//소수부 마지막 수
			var precedingNumber=parseInt(fractionM.charAt(index-2));
			//소수부 마지막 수
			var lastNumber=parseInt(fractionM.charAt(index-1));
			resultNum=splitNum.length-1;
			if(lastNumber!=5){
				resultNum=Math.round(realpart*digit)/digit;
			}else{
				//홀수 부 계산
				if(precedingNumber%2!=0){
					resultNum=Math.ceil(realpart*digit)/digit;
					//0을 포함한 짝수 부 계산
				}else{
					resultNum=Math.floor(realpart*digit)/digit;
				}
			}
		}else{

			resultNum= splitNum[0];

		}
		return resultNum;
	}finally{
		resultNum=null;
	}
};

/*
 * 수소이온
 * 둘째자리에서 반올림하여 소수점점 첫째자리
 * */
var roundPh = function(num){
	//roundMethod(소수점 셋째자리 이하 버린뒤 실수,반올림자릿수);
	return roundMethod(Math.floor(num*100)/100,10);
};


/**
 * 시안
 * 셋째자리에서 반올림하여 소수점 둘째자리
 */
 var roundCn = function(num){
	 return  roundMethod(Math.floor(num*1000)/1000,100);
 };
 
 /*
  * 페놀
  * 넷째자리에서 반올림하여 
	소수점 셋째자리
  */
 var roundPhenol = function(num){
	 return  roundMethod(Math.floor(num*10000)/10000,1000);
 };

 /*
  * 카드뮴
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundCd = function(num){
	 return  roundMethod(Math.floor(num*10000)/10000,1000);
 };
 
 /*
  * 비소
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundAs = function(num){
	 return  roundMethod(Math.floor(num*10000)/10000,1000);
 };
 
 /*
  * 수은
  * 다섯째자리에서 반올림하여 
	소수점 넷째자리
  * */
var roundHg = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };
 
 /*
  * 납
  * 셋째자리 반올림하여 
소수점 둘째자리
  */
 var roundPb = function(num){
	 return  roundMethod(Math.floor(num*1000)/1000,100);
 };

 /*
  * 질산성질소
  * 둘째자리에서 반올림하여 
소수점 첫째자리
(but 수치값이 1mg/L 미만인 경우
소수점 둘째자리까지)
  */
 var roundNo3N = function(num){
	 try{
	    var r=null;
		 if(num>1){
			 r=roundMethod(Math.floor(num*100)/100,10);
		 }else{
			 r=roundMethod(Math.floor(num*1000)/1000,100);
		 }
	 return  r;
	 }finally{
		 r=null;
	 }
 };

 /*
  * 염소이온
  * 둘째자리에서 반올림하여 
소수점 첫째자리
(but 수치값이 1mg/L 미만인 경우
소수점 둘째자리까지)
  */
 var roundCi = function(num){
	 try{
	 var r=null;
		 if(num>1){
			 r=roundMethod(Math.floor(num*100)/100,10);
		 }else{
			 r=roundMethod(Math.floor(num*1000)/1000,100);
		 }
		 return  r;
	 }finally{
		 r=null;
	 }
 };
 

 /*
  * 6가 크롬
  * 셋째자리에서 반올림하여 
	소수점 둘째자리
  */
 var roundCr6 = function(num){
	 return  roundMethod(Math.floor(num*1000)/1000,100);
 };
 

 /*
  * 유기인
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 function roundOp(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };
 

 /*
  * 트리클로로에티렌
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundTce = function(num){
	 return roundMethod(Math.floor(num*10000)/10000,1000);
 };
 

 /*
  * 테트라클로로에틸렌
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundPce = function(num){
	 return  roundMethod(Math.floor(num*10000)/10000,1000);
 };
 
 /*
  * 1.1.1 트리클로로에탄
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundTCE111 = function(num){
	 return  roundMethod(Math.floor(num*10000)/10000,1000);
 };

 /*
  * 벤젠
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundBenzene = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };
 
 /*
  * 톨루엔
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundToluene = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };
 
 /*
  * 에틸벤젠
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundEthylBenzene = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };
 
 
 /*
  * 크실렌
  * 넷째자리에서 반올림하여 
소수점 셋째자리
  */
 var roundXylene = function(num){
	 return roundMethod(Math.floor(num*100000)/100000,10000);
 };
 
 /*
  * 크로로포름
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 var roundChloroform = function(num){
	 return  roundMethod(Math.floor(num*10000)/10000,1000);
 };
 
 /*
  * 클로로포름 MDL
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 var roundChloroformMDL = function(num){
	 return roundMethod(Math.floor(num*10000)/10000,1000);
};

 /*
  * 사염화탄소
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 var roundCarbontetrachloride = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };

 /*
  * 사염화탄소 MDL
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 var roundCarbontetrachlorideMDL = function(num){
	 return  MroundMethod(Math.floor(num*100000)/100000,10000);
 };

 /*
  * 1,2-디클로로에탄
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 var roundDichloroethane = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };

 /*
  * 1,2-디클로로에탄 MDL
  * 다섯째자리에서 반올림하여 
소수점 넷째자리
  */
 var roundDichloroethaneMDL = function(num){
	 return  roundMethod(Math.floor(num*100000)/100000,10000);
 };
 
 /**
  * [지하수측정망 사용 스크립트]
  * 이상치, 기준치, 검사
  * unExpectedUpVl - 이상치 UP
  * unExpectedBtVl - 이상치 DOWN
  * upVl           - 기준치 UP
  * btVl           - 기준치 DOWN
 */
 var gwValidationCheck_ic00002 = function(unExpectedBtVl, unExpectedUpVl, btVl, upVl, val, drink ){
 	trimVal = val.trim();
 	//음용
 	if(drink=="02"){
 		if("검출"==trimVal || "불검출"==trimVal)	return 0;
 		
 	}else{
 		if("불검출"==trimVal) return 0;
 		else if("검출"==trimVal) return 1;
 	}
 	   
 	if("부적합" == trimVal || "-9996" == trimVal) return 3;
 	//수치검사
 	if("-7777" == trimVal || isNaN(Number(val))) return 1;
 	if(Number(val) > 999999){
 		alert("1 너무 큽니다.");
 		return 1;
 	}
 	
 	//이상치 검사
 	floatVal = parseFloat(val);
 	unExpectedUpVlTrim = unExpectedUpVl.trim();
 	unExpectedBtVlTrim = unExpectedBtVl.trim();
 	floatUnExpectedUpVl = parseFloat(unExpectedUpVl);
 	floatUnExpectedBtVl = parseFloat(unExpectedBtVl);
 	if("" == unExpectedUpVlTrim && "" == unExpectedBtVlTrim){
 	
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim == "") {
 		if(floatVal > floatUnExpectedUpVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim != "") {
 		if(floatVal > floatUnExpectedUpVl || floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim == "" && unExpectedBtVlTrim != "") {
 		if(floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}

 	//기준치 검사
 	upvlTrim = upVl.trim();
 	btvlTrim = btVl.trim();
 	floatUpvl = parseFloat(upVl);
 	if(upvlTrim == "" && btvlTrim == "") {
 		return 0;
 	}else if(upvlTrim != "" && btvlTrim == "") {
 		if(floatVal > floatUpvl) {
 			return 3;
 		} else {
 			return 0;
 		}
 	} else if(upvlTrim != "" && btvlTrim != "") {
 		if(floatVal > floatUpvl || floatVal < parseFloat(btVl)) {
 			return 3;
 		} else {
 			return 0;
 		}
 	}
 };

 var gwValidationCheck = function(unExpectedBtVl, unExpectedUpVl, btVl, upVl, val ){

 	trimVal = val.trim();
 	if("불검출" == trimVal || "미검사" == trimVal ||
 	   "-9999" == trimVal || "-8888" == trimVal || "적합" == trimVal || "-9998" == trimVal ||
 	   "검출" == trimVal || "-9997" == trimVal || "ND" == trimVal) return 0; //20130617 CSH 엑셀일괄자료 입력시 ND 입력 가능 및 공백,'-' 입력불가
 	   
 	if("부적합" == trimVal || "-9996" == trimVal) return 3;
 	//수치검사
 	if("-7777" == trimVal || isNaN(Number(val)) || "-" == trimVal) return 1;
 	
 	//CSH20130730 null값 검사
 	if("" == trimVal) return 5;
 	
 	if(Number(val) > 999999){
 		alert("2 너무 큽니다.");
 		return 1;
 	}
 	
 	//이상치 검사
 	floatVal = parseFloat(val);
 	unExpectedUpVlTrim = unExpectedUpVl.trim();
 	unExpectedBtVlTrim = unExpectedBtVl.trim();
 	floatUnExpectedUpVl = parseFloat(unExpectedUpVl);
 	floatUnExpectedBtVl = parseFloat(unExpectedBtVl);
 	if("" == unExpectedUpVlTrim && "" == unExpectedBtVlTrim){
 	
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim == "") {
 		if(floatVal > floatUnExpectedUpVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim != "") {
 		if(floatVal > floatUnExpectedUpVl || floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim == "" && unExpectedBtVlTrim != "") {
 		if(floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}
 	
 	//기준치 검사
 	upvlTrim = upVl.trim();
 	btvlTrim = btVl.trim();
 	floatUpvl = parseFloat(upVl);
 	if(upvlTrim == "" && btvlTrim == "") {
 		return 0;
 	}else if(upvlTrim != "" && btvlTrim == "") {
 		if(floatVal > floatUpvl) {
 			return 3;
 		} else {
 			return 0;
 		}
 	} else if(upvlTrim != "" && btvlTrim != "") {
 		if(floatVal > floatUpvl || floatVal < parseFloat(btVl)) {
 			return 3;
 		} else {
 			return 0;
 		}
 	}
 };

 //음용시 입력값 체크(총대장균수 입력하기 위해)
 var gwValidationCheck_dk = function(unExpectedBtVl, unExpectedUpVl, btVl, upVl, val ){
 	var	trimVal = val.trim(); //0도 불검출로 본다??!!
 	
 	if("불검출" == trimVal || "검출" ==trimVal || "미검사" == trimVal || 
 	   "-9999" == trimVal || "-8888" == trimVal || "적합" == trimVal || "-9998" == trimVal ||
 	    "-9997" == trimVal || "ND" == trimVal || "-7777" == trimVal 
 		|| "<1.8" == trimVal || "<2" == trimVal || "2미만" == trimVal || "2이하" == trimVal || "<1.9" == trimVal
 	) return 0;
 	   
 	if("부적합" == trimVal || "-9996" == trimVal) return 3;
 	//수치검사
 	if(isNaN(Number(val)) || "-" == trimVal || "0" == trimVal) return 1;
 	
 	if(Number(val) > 999999){
 		alert("4 너무 큽니다.");
 		return 1;
 	}
 	//이상치 검사
 	floatVal = parseFloat(val);
 	unExpectedUpVlTrim = unExpectedUpVl.trim();
 	unExpectedBtVlTrim = unExpectedBtVl.trim();
 	floatUnExpectedUpVl = parseFloat(unExpectedUpVl);
 	floatUnExpectedBtVl = parseFloat(unExpectedBtVl);
 	if("" == unExpectedUpVlTrim && "" == unExpectedBtVlTrim){
 	
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim == "") {
 		if(floatVal > floatUnExpectedUpVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim != "") {
 		if(floatVal > floatUnExpectedUpVl || floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim == "" && unExpectedBtVlTrim != "") {
 		if(floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}
 	//기준치 검사
 	upvlTrim = upVl.trim();
 	btvlTrim = btVl.trim();
 	floatUpvl = parseFloat(upVl);
 	if(upvlTrim == "" && btvlTrim == "") {
 		return 0;
 	}else if(upvlTrim != "" && btvlTrim == "") {
 		if(floatVal > floatUpvl) {
 			return 3;
 		} else {
 			return 0;
 		}
 	} else if(upvlTrim != "" && btvlTrim != "") {
 		if(floatVal > floatUpvl || floatVal < parseFloat(btVl)) {
 			return 3;
 		} else {
 			return 0;
 		}
 	}
 };

 //비음용시 입력값 체크
 var gwValidationCheck_udk = function(unExpectedBtVl, unExpectedUpVl, btVl, upVl, val ){
 	var	trimVal = val.trim(); //0도 불검출로 본다??!!
 	if("불검출" == trimVal || "0" == trimVal  || "미검사" == trimVal || 
 	   "-9999" == trimVal || "-8888" == trimVal || "적합" == trimVal || "-9998" == trimVal ||
 	    "-9997" == trimVal || "ND" == trimVal || "-7777" == trimVal
 		|| "<1.8" == trimVal || "<2" == trimVal || "2미만" == trimVal || "2이하" == trimVal || "<1.9" == trimVal
 	) return 0;
 	   
 	if("부적합" == trimVal || "-9996" == trimVal) return 3;
 	//수치검사
 	if(isNaN(Number(val)) || "-" == trimVal) return 1;
 	
 	if(Number(val) > 999999){
 		alert("5 너무 큽니다.");
 		return 1;
 	}
 	
 	//이상치 검사
 	floatVal = parseFloat(val);
 	unExpectedUpVlTrim = unExpectedUpVl.trim();
 	unExpectedBtVlTrim = unExpectedBtVl.trim();
 	floatUnExpectedUpVl = parseFloat(unExpectedUpVl);
 	floatUnExpectedBtVl = parseFloat(unExpectedBtVl);
 	if("" == unExpectedUpVlTrim && "" == unExpectedBtVlTrim){
 	
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim == "") {
 		if(floatVal > floatUnExpectedUpVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim != "") {
 		if(floatVal > floatUnExpectedUpVl || floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim == "" && unExpectedBtVlTrim != "") {
 		if(floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}
 	//기준치 검사
 	upvlTrim = upVl.trim();
 	btvlTrim = btVl.trim();
 	floatUpvl = parseFloat(upVl);
 	if(upvlTrim == "" && btvlTrim == "") {
 		return 0;
 	}else if(upvlTrim != "" && btvlTrim == "") {
 		if(floatVal > floatUpvl) {
 			return 3;
 		} else {
 			return 0;
 		}
 	} else if(upvlTrim != "" && btvlTrim != "") {
 		if(floatVal > floatUpvl || floatVal < parseFloat(btVl)) {
 			return 3;
 		} else {
 			return 0;
 		}
 	}
 };

 //CSH ph ec  입력값 체크
 var gwValidationCheck_ic0001 = function(unExpectedBtVl, unExpectedUpVl, btVl, upVl, val ){
 	//console.log("gwValidationCheck_ic0001 : " + unExpectedBtVl +", "+unExpectedUpVl +", "+btVl +", "+ upVl +", "+val);
 	var	trimVal = val.trim(); //0도 불검출로 본다??!!
 	if( "미검사" == trimVal || 
 	   "-9999" == trimVal || "-8888" == trimVal || "적합" == trimVal || "-9998" == trimVal ||
 	    "-9997" == trimVal || "-7777" == trimVal
 		|| "<1.8" == trimVal || "<2" == trimVal || "2미만" == trimVal || "2이하" == trimVal || "<1.9" == trimVal
 	) return 0;
 	
 	if("부적합" == trimVal || "-9996" == trimVal) return 3;
 	//수치검사
 	if(isNaN(Number(val)) || "-" == trimVal) return 1;
 	
 	//ph/ec  0,불검출 입력 안되게 처리
 	if("불검출" == trimVal || "0" == trimVal || "ND" == trimVal){
 		return 4;
 	}
 	if(Number(val) > 999999){
 		alert("6 너무 큽니다.");
 		return 1;
 	}
 	//이상치 검사
 	floatVal = parseFloat(val);
 	unExpectedUpVlTrim = unExpectedUpVl.trim();
 	unExpectedBtVlTrim = unExpectedBtVl.trim();
 	floatUnExpectedUpVl = parseFloat(unExpectedUpVl);
 	floatUnExpectedBtVl = parseFloat(unExpectedBtVl);
 	if("" == unExpectedUpVlTrim && "" == unExpectedBtVlTrim){
 	
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim == "") {
 		if(floatVal > floatUnExpectedUpVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim != "" && unExpectedBtVlTrim != "") {
 		if(floatVal > floatUnExpectedUpVl || floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}else if(unExpectedUpVlTrim == "" && unExpectedBtVlTrim != "") {
 		if(floatVal < floatUnExpectedBtVl) {
 			return 2;
 		}
 	}
 	//기준치 검사
 	upvlTrim = upVl.trim();
 	btvlTrim = btVl.trim();
 	floatUpvl = parseFloat(upVl);
 	if(upvlTrim == "" && btvlTrim == "") {
 		return 0;
 	}else if(upvlTrim != "" && btvlTrim == "") {
 		if(floatVal > floatUpvl) {
 			return 3;
 		} else {
 			return 0;
 		}
 	} else if(upvlTrim != "" && btvlTrim != "") {
 		if(floatVal > floatUpvl || floatVal < parseFloat(btVl)) {
 			return 3;
 		} else {
 			return 0;
 		}
 	}
 };
 