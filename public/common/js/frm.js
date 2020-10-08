/**
 * Title : frm.js
 * Description : 입력값의 검증
 *
 * @Author gggl.ko / kojaepil@easymedia.net
 * @Create 2008-04-04 /  거친마루 폼체크 모듈 마이그레이션, 확장 add on
 * @Update
 * /

- 기존구조 분리, 클래스 구조화
- 검증완료 후, 컨펌메시지 띄우기

1. 메시지를 검수항목별로 지정가능	 ex) checkNull="aaa" number="bbb"
2. 메시지 대신 함수실행가능함. ex)checkNull="window.close();"
3. 개별개체 검사가능 ex)<input type="text" name="" value="" checkNull="aaa" number="bbb" onchange="validate(this)">
4. fail = 검증실패시 실행
5. exec = 검증시마다 실행
6. success = 성공시에 실행
7. delete 검증실패시 값지움
8. focus="개체" 검증실패후 해당개체에 포커스
9. nofocus 검증실패후 포커스 이동없음
10. diplaySkip 있고, 해당개체 display 가 none 인경우, 해당개체검증 스킵
11. requiredSkip 빈값인경우는 검증하지 않고 넘어감
12. glue addon - 2009-03-23 execute / ex) glue="@:a,b" 설정인 경우,  this.form.a.value + '@' + this.form.b.value + '@' + this.value 가 검증값이 된다.
13. 2009-11-09 - 각 element confirm 기능 추가
14. 에러인 입력박스 강조처리
15. 2010-05-06 - 파일폼 비동기로 연동
17. 2010-08-23 - customer , 개별적으로 함수 실행하여, 실패처리함
18. 2010-09-20 - trueSkip , 조건의 함수가 맞다면, 검증하지 않음
*/

var alertMode = true;//alert모드와 그냥 메시지 박스 모드

/**
*
* @param Form Object
* @return boolean
*/
function validate(frm,cfrmMsg) {
	alertMode = true;
	var rtn = validateParam(frm,cfrmMsg);

    if (rtn == false) {
        return false;
    } else {
        return true;
    }
}

/**
 * alert 대신 옆에 메시지 보이기
 * @param frm
 * @param cfrmMsg
 * @returns {Boolean}
 */
function validateEx(frm,cfrmMsg) {
	alertMode = false;
	var rtn = validateParam(frm,cfrmMsg);

    if (rtn == false) {
        return false;
    } else {
        return true;
    }
}


/**
 * @param : 폼, confirm 문구
 * @return : true 일때는, querystring 로 셋팅된 문자열을 건내준다.
 */
var checker;

var checkerFlag = false;
function validateParam(frm,cfrmMsg,evalR) {

   
        if (checkerFlag == false) {
            checker = new FrmChk(frm);
            checkerFlag = true;
        } else {
            checker.form = frm;
        }

        if (cfrmMsg != undefined && cfrmMsg != "") {
            if (checker.go() == true) {
                if (confirm(cfrmMsg) == false) {
                    return false;
                }
            } else {
                return false;
            }
		} else {
            if (checker.go() == false) {
                return false;
            } else {
                return checker.param;
            }
        }


}

// ------------------------------------------- // 입력값 검증 prototype --------------------------------------------


FrmChk = function(frmObj,cfrmMsg) {

	// validate 타입
	this.validate = Array("koreanenglishen", "koreanenglishkr","checkNull", "number","equal","notEqual","equalbyte","minbyte","maxbyte",
	                      "idChk","passChk","korean","english","ext","emailkr", "emailen","phone", "tel", "bizNo","specialEn","specialKr"
	                      ,"phoneEn","phoneKr","faxEn","faxKr","numberEn","numberKr","numberlanguageKr","numberlanguageEn", "requiredfile",
	                      "reportPassChk"); //, "customer"

	//영문용
	if(document.URL.indexOf("/en/") > 0)
	{
		this.DE_errMsg = {
			common		:   "입력하신 내용이 규칙에 어긋납니다.\n규칙에 어긋나는 내용을 바로잡아주세요."
		   ,checkNull	:   "값이 입력 또는 선택되지 않았습니다."
		   ,requiredfile	:   "값이 입력되지 않았습니다."
		  , equal		:   "입력값이 일치하지 않습니다."
		  , invalid		:   "입력값이 형식에 벗어납니다."
		  , equalbyte	:   "입력값의 길이가 {equalbyte}자(영문기준) 이어야 합니다."
		  , minbyte		:   "입력값의 길이가 {minbyte}자(영문기준) 이상이어야 합니다."
		  , emailkr		:   "이메일 입력값이 올바르지 않습니다."
		  , emailen		:   "Enter your email value is not correct."
		  , maxbyte		:   "입력값의 길이가 {maxbyte}자(영문기준)를 초과할 수 없습니다."
		  , ext			:   "wrong file name."
		  , idChk		:   "아이디 입력값이 올바르지 않습니다.\n(알파벳 대소문자 + 숫자 , 6~12자로 입력합니다.)"
		  , passChk		:   "패스워드 입력값이 올바르지 않습니다.\n(영문 + 숫자 4~8자리)"
		  , number		:   "숫자만 입력할 수 있습니다."
		  , notEqual	:   "입력값이 일치합니다."
		  , phone		:   "번호는 010-1234-5678 형식으로 입력되어야 합니다."
		  , tel 		:   "전화번호는 02-1234-5678 형식으로 입력되어야 합니다."
		  , bizNo 		:   "사업자 번호가 올바르지 않습니다."
		  , english		:   "영문 및 숫자만 입력가능합니다."
		  , korean		:   "한글만 입력가능합니다."
		  , koreanenglishkr		:   "영문 및 한글만 입력가능합니다."
		  , koreanenglishen		:   "You should enter in English and Hangul."
		  , specialKr           :   "잘못된 문자 및 특수문자는 입력 할 수 없습니다."
		  , specialEn           :   "Do not input wrong characters."
		  , phoneEn             :   "The telephone number of Only (0-9,+)"
		  , phoneKr             :   "전화번호는 (0-9,+)만 입력 할 수 있습니다."
		  , faxEn               :   "The fax of Only number(0-9)"
		  , faxKr               :   "팩스는 번호(0-9)만 입력 할 수 있습니다."
		  , numberEn            :   "Only numbers (0-9)"
		  , numberKr            :   "숫자만 입력 할 수 있습니다. (0-9)"		 
		  , numberlanguageKr    :   "문자 및 숫자만 입력 할 수 있습니다."
		  , numberlanguageEn    :   "Do not input wrong characters.(special Character)"
		  , reportPassChk       :   "비밀번호는 영문 숫자 포함 5자리 이상 입니다."			  
		}
	}
	else
	{
		this.DE_errMsg = {
			common		:   "입력하신 내용이 규칙에 어긋납니다.\n규칙에 어긋나는 내용을 바로잡아주세요."
		  ,checkNull	:   "값이 입력 또는 선택되지 않았습니다."
		  ,requiredfile	:   "값이 입력되지 않았습니다."
		  , equal		:   "입력값이 일치하지 않습니다."
		  , invalid		:   "입력값이 형식에 벗어납니다."
		  , equalbyte	:   "입력값의 길이가 {equalbyte}자(영문기준) 이어야 합니다."
		  , minbyte		:   "입력값의 길이가 {minbyte}자(영문기준) 이상이어야 합니다."
		  , emailkr		:   "이메일 입력값이 올바르지 않습니다."
		  , emailen		:   "Enter your email value is not correct."
		  , maxbyte		:   "입력값의 길이가 {maxbyte}자(영문기준)를 초과할 수 없습니다."
		  , ext			:   "첨부한 파일의 확장자가 올바르지 않습니다."
		  , idChk		:   "아이디 입력값이 올바르지 않습니다.\n(알파벳 대소문자 + 숫자 , 6~12자로 입력합니다.)"
		  , passChk		:   "패스워드 입력값이 올바르지 않습니다.\n(영문 + 숫자 4~8자리)"
		  , number		:   "숫자만 입력할 수 있습니다."
		  , notEqual	:   "입력값이 일치합니다."
		  , phone		:   "번호는 010-1234-5678 형식으로 입력되어야 합니다."
		  , tel 		:   "전화번호는 02-1234-5678 형식으로 입력되어야 합니다."
		  , bizNo 		:   "사업자 번호가 올바르지 않습니다."
		  , english		:   "영문 및 숫자만 입력가능합니다."
		  , korean		:   "한글만 입력가능합니다."
		  , koreanenglishkr		:   "영문 및 한글만 입력가능합니다."
		  , koreanenglishen		:   "You should enter in English and Hangul."
		  , specialKr           :   "잘못된 문자 및 특수문자는 입력 할 수 없습니다."
		  , specialEn           :   "Do not input wrong characters."
		  , phoneEn             :   "The telephone number of Only (0-9,+)"
		  , phoneKr             :   "전화번호는 (0-9,+)만 입력 할 수 있습니다."
		  , faxEn               :   "The fax of Only number(0-9)"
		  , faxKr               :   "팩스는 번호(0-9)만 입력 할 수 있습니다."
	      , numberEn            :   "Only numbers (0-9)"
	      , numberKr            :   "숫자만 입력 할 수 있습니다. (0-9)"
	      , numberlanguageKr    :   "문자 및 숫자만 입력 할 수 있습니다."
	      , numberlanguageEn    :   "Do not input wrong characters.(special Character)"
	      , reportPassChk       :   "비밀번호는 영문 숫자 포함 5자리 이상 입니다."	    	  
		}
	}

	this.chkPrototype;
	this.errMsg;
    this.enctype;

    // 생성할때 부여
	//this.form = frm;		//검증호출시 파라미터로 받은 검증개체를 셋팅 - naming 을 this.form 으로 가져감으로써, 내부,외부 싱크
	this.obj = {
		Rtype : ""		    // 검증개체 type
		,Rvalue : ""		// 검증개체 value
	};

	// 에러여부 플래그
	this.err = false;

	// 현재 검사 타입
	this.chkPrototype = "";

	// 현재 검사 타입 값
	this.chkAttVal = "";

	// 추가로 뿌려줄 메시지 기본 메시지 \n\n - 형식
	this.addErrMsg = "";
    this.id = "";

    // 쿼리 스트링 형태로 모아줌
    this.param = "";

    this.form = frmObj;

    if (this.form.getAttribute("onsubmit") == null) {
        if (typeof cfrmMsg == "undefined") {
            cfrmMsg = "";
        }
        if (alertMode) {
           this.form.onsubmit = function () {
              return validate(this,cfrmMsg);
           }
        } else {
            this.form.onsubmit = function () {
              return validateEx(this,cfrmMsg);
           }
        }
    }
}

FrmChk.prototype.form = null;
FrmChk.prototype.go = function() {

	// 폼이 아닐경우 개별개체설정
	if (this.form == null || this.form.tagName.toLowerCase() != "form") {
		var i2 = 1;
	} else {
		var i2 = this.form.elements.length;
	}

	for (var i = 0; i < i2; i++) {

		// 검사 개체 초기화
		if (this.init(i) != true) {
            alert("예기치 못한 오류");
            return false;
        }
		
		if(this.obj.tagName.toLowerCase() == "object"){
	    	return true;
	    	
	    }

        // confirm msg 개별 할당 추가
        if (this.obj.getAttribute("confirm") != null) {

            var Arr = this.obj.getAttribute("confirm").split(":",2);

            if (Arr.length > 1) {
                if (eval(Arr[0]) == true) {
                    if (confirm(Arr[1]) == false) {
                        return false;
                    }
                }
            } else {
                if (confirm(this.obj.getAttribute("confirm")) == false) {
                    return false;
                }
            }
        }

		// skip
		if ( this.obj.name == "" || this.obj == null || this.obj.tagName.toLowerCase() == "fieldset" || this.obj .tagName.toLowerCase() == "object") continue;

        // disabled 인경우와, diplaySkip이 있고, 해당개체  display=none 인경우, 스킵
		if (this.obj.disabled == true || (this.obj.getAttribute("diplaySkip") != null && this.obj.style.display == "none")) continue;

		// requiredSkip 속성 존재하고, 빈값인 경우는 검증 없이 넘어감
		if (this.obj.getAttribute("requiredSkip") != null && this.obj.value == "") continue;

		var sucessChk = false;



        /**
        * 사용자 지정 체크
        * @param
        * @return boolean
        */
        if (this.obj.getAttribute("customer") !=  null) {

            var rtnCustomer = this.obj.getAttribute("customer").split("this").join("this.obj").split("this.obj.form").join("this.form");
            var rtn = eval(rtnCustomer);

            if (rtn == false) {
                this.errExec();
                return false;
            }
        }


        /*
         * trueSkip 이 맞으면, 검증하지 않음.
         */
        if (this.obj.getAttribute("trueSkip") !=  null) {            
            var trueSkip = this.obj.getAttribute("trueSkip").split("this").join("this.obj").split("this.obj.form").join("this.form");
            
            if (eval(trueSkip) == true) {
                continue;
            }
        }

        
        //
		// validate
		//
		for (var j=0; j < this.validate.length; j++) {

            // init
            var chk = this.chk_init(this.validate[j]);

            // 파일인경우는 무조건 검사
            if (chk == false || (this.obj.Rtype == "file" && this.validate[j] == "ext")) {
                if (eval("this."+this.validate[j]+"()") == false) {
                    this.errExec();
                    return false;
                }
            }
		}

		//개별 오브젝트 true
		// success  어트리뷰트가 있는경우, 실행한다. - 파일인 경우는 값이 있는경우만
		if ((this.obj.Rtype == "file" && this.obj.Rvalue != "") || this.obj.Rtype != "file") {
			if (this.obj.getAttribute("success")) {
				try {
					eval(this.obj.getAttribute("success"));
				} catch (e) {
					alert(e.message);
				}
			}
		}


	}

	return true;		//운영모드
	//return false;	//개발모드
}



/**
* 개체별 초기화
*
*/
FrmChk.prototype.init = function(i) {

	// 변수초기화
	this.errMsg = "";
	this.addErrMsg = "";

	// 폼인지 단일개체인지 구분하여 할당
	if (this.form.tagName.toLowerCase() == "form") {
		this.obj = this.form.elements[i];
	} else {
		this.obj = this.form;
	}

    // 아이디 할당
    this.id = this.obj.id;

	// trim 어트리뷰트가 있는경우, 실행한다.
    //console.log("id는 "+this.id);
    //console.log("id는 "+this.obj.tagName);
    
    if(this.obj.tagName.toLowerCase() == "object"){
    	return true;
    	
    }
	if (this.obj.getAttribute("trim") != null) {
			this.obj.value = this.obj.value.replace(/(^[ \f\n\r\t]*)|([ \f\n\r\t]*$)/g, "");
	}

	// 기본설정

    if (this.obj.tagName.toLowerCase() == "select") {
			this.obj.Rtype  = "select";
    } else {
        if (this.obj.type == "radio" || this.obj.type == "checkbox") {
                this.obj.Rtype = "check";
        } else if (this.obj.type == "file") {
                this.obj.Rtype  = "file";
        } else {
                this.obj.Rtype  = "text";
        }
    }


	// 타입에 따른 값 할당
	this.obj.Rvalue = "";
    this.RvalueSet();

	// glue execute / ex) glue="a,b" = this.form.a.value + this.form.b.value + this.value 가 검증값이 된다.
	if (this.obj.getAttribute("glue") != null) {
		var glueE = this.obj.getAttribute("glue");
		var valE="";
		Arr2 = glueE.split(",");

		for (var i=0;i<Arr2.length ; i++) {
            try {
                valE = valE + eval("this.form."+Arr2[i]+".value");
            } catch (e) {
                valE = valE + Arr2[i];
            }

		}

		// 셋팅~
		this.obj.Rvalue = valE;
	}

    // exec 어트리뷰트가 있는경우, 실행한다.
	if (this.obj.getAttribute("exec")) {

		try {
			eval(this.obj.getAttribute("exec").split("this").join("this.obj").split("this.obj.form").join("this.form"));
			
            this.RvalueSet();
		} catch (e) {
			alert("frm chk#4 : " + e.message);
		}
	}

    /*
     * 폼객체를 쿼리스트링형태로 수정하여 리턴
     * AJAX 때 보낼라고 그래.
     */
    if (this.param != "") {
        this.param += "&";
    }
    this.param += this.obj.name+"="+encodeURIComponent(this.obj.Rvalue);

    return true;
}

/*
 * 값 셋팅
 */
FrmChk.prototype.RvalueSet = function(){

    switch (this.obj.Rtype) {
		case "file": case "text":
		
			this.obj.Rvalue = this.obj.value;
		break;
		case "select":
            // this.obj[this.obj.selectedIndex].value == 0 ||
			if(this.obj.selectedIndex >= 0)
			{
				if (this.obj[this.obj.selectedIndex].value == null || this.obj[this.obj.selectedIndex].value == "") {
					this.obj.Rvalue = "";
				} else {
					this.obj.Rvalue = this.obj[this.obj.selectedIndex].value;
				}
			}
		break;
		case "check":

			//개별단일개체가 아닌, 복수일수도 있으므로, 해당 이름으로 개체 재설정함
			var elCheck = this.form.elements[this.obj.name];

            if (typeof elCheck != "undefined") {
				if (isNaN(elCheck.length) == true) {
					if (elCheck.checked == true) {
						this.obj.Rvalue = this.obj.value;
					}
				} else {
                    this.obj.Rvalue = "";
					for (var j = 0; j < elCheck.length; j++) {

						try {
							if (elCheck[j].checked == true) {

								if (this.obj.Rvalue == "") {
									this.obj.Rvalue = elCheck[j].value;
								} else {
									this.obj.Rvalue = this.obj.Rvalue + "," + elCheck[j].value;
								}

							}
						}catch (e){
							alert("#6 : " + e.message);
						}
					}
				}
			}

		break;
	}
}


/**
* 에러모드 실행 - 외국사이트등의 구축시 메시지 alert 가 아닌 메시지 print 고려하여 별도의 prototype으로 생성함.
*
* @param
* @return private
*/
FrmChk.prototype.errExec = function () {

		// false 어트리뷰트가 있는경우, 실행한다.
		if (this.obj.getAttribute("fail")) {
            try {
                eval(this.obj.getAttribute("fail"));
            } catch (e) {
                alert("#5 : " + e.message);
            }
		}

		this.setErrMsg();

		if (this.errMsg != "") {
			
			if(this.obj.title != null){
				if(alertMode){
					alert(this.obj.title + "은(는) " + this.errMsg);
				}else{
					//input 옆에 메세지로 보이게 할경우 이거 사용하자
					$('#error_'+this.obj.id).remove();
					$(this.obj).after("<p class='errMsg' id='error_"+this.obj.id+"'> *"+this.errMsg+"</p>");
				}
				
				if (this.obj.tagName.toLowerCase() == "select" || this.obj.type == "radio" || this.obj.type == "checkbox" || this.obj.type == "file"){
					this.obj.setAttribute("onchange","$('#error_"+this.obj.id+"').remove();$(this).removeClass('errInpt');");
				}else{
					this.obj.setAttribute("onkeyup","$('#error_"+this.obj.id+"').remove();$(this).removeClass('errInpt');");
				}
				
			}else{
				if(alertMode){
					alert("* " + this.errMsg);
				}else{
					//input 옆에 메세지로 보이게 할경우 이거 사용하자
					$('#error_'+this.obj.id).remove();
					$(this.obj).after("<span class='errMsg' id='error_"+this.obj.id+"'> *"+this.errMsg+"</span>");
					
				}
				
				if (this.obj.tagName.toLowerCase() == "select" || this.obj.type == "radio" || this.obj.type == "checkbox" || this.obj.type == "file"){
					this.obj.setAttribute("onchange","$('#error_"+this.obj.id+"').remove();$(this).removeClass('errInpt');");
				}else{
					this.obj.setAttribute("onkeyup","$('#error_"+this.obj.id+"').remove();$(this).removeClass('errInpt');");
				}
			}
		}

		if (this.obj.getAttribute("delete") != null) {
			this.obj.value = "";
		}

		if (this.obj.getAttribute("select") != null) {
			this.obj.select();
		}

        //nofoucs 인경우, 포커스 없음. focus 있는경우 해당 지정
        if (this.obj.getAttribute("nofocus") == null) {
            if(this.obj.getAttribute("focus") != null) {
                try {
                    eval(this.obj.getAttribute("focus")+".focus();");
                } catch (e) {
                    try {
                        eval("this.form."+this.obj.getAttribute("focus")+".focus();");
                    } catch (e) {
                    }
                }
            } else if(this.obj.Rtype != "hidden") {
                try {
                    this.obj.focus();
                } catch(e) {
                }
            }
        }

        this.errBox();
}

FrmChk.prototype.objBFlag = false;
FrmChk.prototype.objB;
FrmChk.prototype.objBStyle1;
FrmChk.prototype.objBStyle2;
FrmChk.prototype.objBStyle3;
FrmChk.prototype.errBox = function () {

        /*
         * 에러 폼값 강조 처리
         */
        if(this.objBFlag == true) {
        	
        	$(this.objB).removeClass('errInpt');
        }

        if (this.obj.Rtype != "check") {
        	this.objB = this.obj;
        	this.objBFlag = true;
        	$(this.obj).addClass('errInpt');

        }
}

/**
* 에러메시지 할당
*
* @param
* @return private
*/
FrmChk.prototype.setErrMsg = function () {

    if (this.obj.getAttribute("customer") != null) {
        this.errMsg = this.obj.getAttribute("customerMsg");
    } else {
        var pattern = /\{([a-zA-Z0-9_]+)\}/i;

        if (this.obj.getAttribute(this.chkPrototype) !=  null) {

            // 에러메시지 및 실제 속성값부여
            var Arr = this.obj.getAttribute(this.chkPrototype).split(":",2);

            if (Arr[1] != undefined) {
                this.errMsg  = Arr[1];
            } else {
            	this.errMsg = this.DE_errMsg[this.chkPrototype];
                this.errMsg = this.errMsg.replace(this.chkPrototype,this.obj.getAttribute(this.chkPrototype));
            }
        } else {
            this.errMsg = this.DE_errMsg[this.chkPrototype];
            this.errMsg = this.errMsg.replace(this.chkPrototype,this.obj.getAttribute(this.chkPrototype));
        }
        // 함수일 경우 해당 함수를 실행해준다.
        try {
            // eval 적용중 alert 인경우는 skip
            if (this.errMsg.substr(0,5) != "alert") {
                this.errMsg =eval(this.errMsg);
            }

        } catch (e) {
            this.errMsg = this.errMsg;
        }
    }

	// 추가 메시지가 있을경우
	if (this.addErrMsg != "") {
		this.errMsg = this.errMsg + "\n\n- "+ this.addErrMsg + "\n ";
	}
}

/**
* 검증기능 전 초기화 (검증 타입별로)
*
* @param
* @return private
*/
FrmChk.prototype.chk_init = function(t) {

	this.errMsg = "";
	this.chkAttVal = "";

	this.chkPrototype = t;

	if (this.obj.getAttribute(t) == null) {

        return true;

	} else {

        // 에러메시지 및 실제 속성값부여
        var Arr = this.obj.getAttribute(t).split(":",2);

        if (Arr[1] != undefined) {
            this.chkAttVal  = Arr[0];
        } else {
            this.chkAttVal  = this.obj.getAttribute(t);
        }

        // 함수일경우 실행하기 차후에, eval 에 대한 전체적인 기능 필요
        // eval 로 접근할 경우, 전역으로 접근해야함. 내부접근이 아님
        try {
            this.chkAttVal = eval(this.chkAttVal);
        } catch (e) {
            //alert("#chk_init = " + typeof eval(this.chkAttVal) + " * " + e.message)
        }

		return false;
	}
}

/**
 * 세부 input 등의 입력개체에 검증 attribute 를 셋팅함.
 * @Param : obj,att
 * @ex : <input type="text" name="a">
 * @ex : frm.valiSet("a","checkNull")
 * @ex : <input type="text" name="a" checkNull>
 *
 */
FrmChk.prototype.valiSetExec = function(objE,att,attV) {

    try {
        if(typeof attV == "undefined") {
            attV="";
        }
        var chk =  0;
        var obj = eval("this.form."+objE);
        
        if (typeof obj != "undefined") {
            
            if (obj.length != undefined) {
                
                var tagname = obj[0].tagName.toLowerCase();
                
                // select box 일 경우 객체 지정
                if (tagname != "select" && tagname != "option") {
                
                    var cnt = obj.length;                

                    if (att.toLowerCase() == "onkeyup") {
                         obj[cnt-1].onkeyup = function () {
                            return eval(attV);
                         }
                    } else {
                        obj[cnt-1].setAttribute(att,attV);
                    }
                } else {  
                    obj.setAttribute(att,attV);
                }

            } else {

                if (att.toLowerCase() == "onkeyup") {
                     obj.onkeyup = function () {
                        return eval(attV);
                     }
                } else {
                    obj.setAttribute(att,attV);
                }
            }
        }

    } catch(e) {
        alert(e.message+ " / "+objE+" # "+chk);
    }
}

/*
 * 파라미터를 분산해 처리
 */
FrmChk.prototype.valiSet = function() {
    var arr = arguments;
    var len = arr.length;
    for (var i=1;i<len ;i=i+2 ) {
        this.valiSetExec(arr[0],arr[i],arr[i+1]);
    }
}

// ------------------------------------------- // 입력값 검증 prototype ------------------------------------------------------------------------

/**
 * 특수 문자 체크
 */


FrmChk.prototype.numberlanguageKr = function(){
    var text    = /[^가-힣a-z0-9\s]/gi;
    var isBoo = false;
    //    var re = /[~!@\#$%^&*\()\=+_']/gi;    
    if(frmTrim(this.obj.Rvalue).length == 0){
        return true;
    }
   if(text.exec(this.obj.Rvalue)){
       return false;
   }else{
       return true;
   }
}


FrmChk.prototype.numberlanguageEn = function(){
    var text    = /[^가-힣a-z0-9\s]/gi;
    var isBoo = false;
    //    var re = /[~!@\#$%^&*\()\=+_']/gi;    
    if(frmTrim(this.obj.Rvalue).length == 0){
        return true;
    }
   if(text.exec(this.obj.Rvalue)){
       return false;
   }else{
       return true;
   }
}


FrmChk.prototype.specialEn = function(){
    var text    = /[^+-@?\/\(\)+_'"가-힣a-z0-9\s]/gi;
    var isBoo = false;
    //    var re = /[~!@\#$%^&*\()\=+_']/gi;   
 
    if(this.obj.Rvalue.indexOf("=")>-1){
        return false;
    }
    if(frmTrim(this.obj.Rvalue).length == 0){
        return true;
    }
   if(text.exec(this.obj.Rvalue)){
       return false;
   }else{
       return true;
   }
}

FrmChk.prototype.specialKr = function(){
    var text    = /[^+-@?\/\(\)+_'"가-힣a-z0-9\s]/gi;
    var isBoo = false;
    //    var re = /[~!@\#$%^&*\()\=+_']/gi;  
    if(this.obj.Rvalue.indexOf("=")>-1){
        return false;
    }
    if(frmTrim(this.obj.Rvalue).length == 0){
        return true;
    }
   if(text.exec(this.obj.Rvalue)){
       return false;
   }else{
       return true;
   }
}

/**
 * 전화 번호 팩스 검증 2013.08.21
 */
FrmChk.prototype.phoneEn = function(){
	var pattern = /[^-0-9+\s]/g;
	if (pattern.exec(this.obj.Rvalue)) {
			return false;
	} else {
			return true;
	}
}

FrmChk.prototype.phoneKr = function(){
	var pattern = /[^-0-9+\s]/g;
	if (pattern.exec(this.obj.Rvalue)) {
			return false;
	} else {
			return true;
	}
}

FrmChk.prototype.faxEn = function(){
	var pattern = /[^-0-9+\s]/g;
	if (pattern.exec(this.obj.Rvalue)) {
			return false;
	} else {
			return true;
	}
}

FrmChk.prototype.faxKr = function(){
	var pattern = /[^-0-9+\s]/g;
	if (pattern.exec(this.obj.Rvalue)) {
			return false;
	} else {
			return true;
	}
}
/**
* checkNull 검증 (빈값체크)
* @param
* @return boolean
*/
FrmChk.prototype.checkNull = function() {
	if (this.obj.style.display == "none")
	{
		return true;
	}
	else
	{
		if (this.obj.Rtype == "select") 
		{
			if (this.obj.selectedIndex > -1 && this.obj.value !="" && this.obj.value != undefined)
				return true;
			else
				return false;
		} 
		else 
		{
		    
		    //추가 공백 체크 부분 2013.08.14
		    if(frmTrim(this.obj.Rvalue).length==0){
		        return false;
		    }else{
				//input type file은 값을 삽입 할 수 없다. 더이상 지원하지 않는다고 합니다.
				if(this.obj.type != "file")
				{
					this.obj.value = frmTrim(this.obj.Rvalue);
				}
		    }
		    
			if (this.obj.style.display != "none" && this.obj.Rvalue == "") {
					return false;
			} else {
					return true ;
			}
		}
	}
}

/**
* required 검증 (빈값체크)
* @param
* @return boolean
*/
FrmChk.prototype.requiredfile = function() {
	if (this.obj.style.display == "none")
	{
		return true;
	}
	else
	{
		if (this.obj.Rtype == "select") {
			if (this.obj.selectedIndex > 0)
				return true;
			else
				return false;
		} else {
		    
		    //추가 공백 체크 부분 2013.08.14
		    if(frmTrim(this.obj.Rvalue).length==0){
		        return false;
		    }else{				
		        //this.obj.value = frmTrim(this.obj.Rvalue);
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

/**
* equal 검증 (같은지 안같은지)
* @param
* @return boolean
*/
FrmChk.prototype.equal = function() {
	if (this.obj.Rvalue != this.chkAttVal) {
			return false;
	} else {
			return true ;
	}
}


/**
* notEqual 검증 (같은지 안같은지)
* @param
* @return boolean
*/
FrmChk.prototype.notEqual = function() {
	if (this.obj.Rvalue == this.chkAttVal) {
			return false;
	} else {
			return true ;
	}
}


/**
* 고정값
* @param
* @return boolean
*/
FrmChk.prototype.equalbyte = function() {

	var len = this.chkAttVal;

	if (isNaN(len) ==  true) {
		return false;
	}

	if (this.obj.Rvalue.length != len) {
		return false;
	}
}

/**
* 최소값
* @param
* @return boolean
*/
FrmChk.prototype.minbyte = function() {
	var len = this.chkAttVal;
	if (isNaN(len) ==  true) {
		return false;
	}

	if (this.obj.Rvalue.length < len) {
		return false;
	}
}

/**
* 최대값
* @param
* @return boolean
*/
FrmChk.prototype.maxbyte = function() {

    var len = this.chkAttVal;

	if (isNaN(len) ==  true) {
		return false;
	}

	if (this.obj.Rvalue.length > len) {
		return false;
	}
}


/**
* 핸드폰
* @param
* @return boolean
*/
FrmChk.prototype.phone = function() {

	var pattern = /^([0]{1}[0-9]{1,2})-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;

	if (pattern.exec(this.obj.Rvalue)) {
		if(RegExp.$1 == "011" || RegExp.$1 == "016" || RegExp.$1 == "017" || RegExp.$1 == "018" || RegExp.$1 == "019" || RegExp.$1 == "010") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
* 전화번호
* @param
* @return boolean
*/
FrmChk.prototype.tel = function() {
	var pattern = /^[0-9]{2,4}-?[0-9]{3,4}-?[0-9]{4}$/;

	if (pattern.exec(this.obj.Rvalue)) {
				return true;
	} else {
			return false;
	}
}

/**
* 사업자 등록번호
* @param
* @return boolean
*/
FrmChk.prototype.bizNo = function() {
	var pattern = /^[0-9]{3}-?[0-9]{2}-?[0-9]{5}$/;
	if (pattern.exec(this.obj.Rvalue)) {
	    return true;
	} else {
        return false;
	}
}

/**
* 영어만 입력하게끔
* @param
* @return boolean
*/
FrmChk.prototype.english = function() {

	var pattern = /^[a-zA-Z\.\_]+$/;

	if (pattern.exec(this.obj.Rvalue)) {
			return true;
	} else {
			return false;
	}
}


/**
* 숫자만입력 체크
* @param
* @return boolean
*/
FrmChk.prototype.number = function() {

    // this.chkAttVal 가 숫자일 경우는 자리수 체크를 해준다.
    if (isNaN(this.chkAttVal) == false) {
        if (this.obj.Rvalue.length != this.chkAttVal) return false;
    }

	var pattern = /[^0-9-]/g;
	if (pattern.exec(this.obj.Rvalue)) {
			return false;
	} else {
			return true;
	}
}


/**
* 숫자만입력 체크 영문
* @param
* @return boolean
*/
FrmChk.prototype.numberEn = function() {

    // this.chkAttVal 가 숫자일 경우는 자리수 체크를 해준다.
    if (isNaN(this.chkAttVal) == false) {
        if (this.obj.Rvalue.length != this.chkAttVal) return false;
    }

    var pattern = /[^0-9-]/g;
    if (pattern.exec(this.obj.Rvalue)) {
            return false;
    } else {
            return true;
    }
}

/**
* 숫자만입력 체크 영문
* @param
* @return boolean
*/
FrmChk.prototype.numberKr = function() {

    // this.chkAttVal 가 숫자일 경우는 자리수 체크를 해준다.
    if (isNaN(this.chkAttVal) == false) {
        if (this.obj.Rvalue.length != this.chkAttVal) return false;
    }

    var pattern = /[^0-9-]/g;
    if (pattern.exec(this.obj.Rvalue)) {
            return false;
    } else {
            return true;
    }
}

/**
* 이메일 체크
* @param
* @return boolean
*/
FrmChk.prototype.emailkr = function() {
		var pattern = /^[_a-zA-Z0-9-\.\_]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
		
		if((pattern.test(this.obj.Rvalue)) == false)
	    {
	        this.obj.value = "";
	    }
		return (pattern.test(this.obj.Rvalue)) ? true : false;
}

FrmChk.prototype.emailen = function() {
	var pattern = /^[_a-zA-Z0-9-\.\_]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
	
	if((pattern.test(this.obj.Rvalue)) == false)
    {
	    this.obj.value = "";
    }
	
	return (pattern.test(this.obj.Rvalue)) ? true : false;
}

/**
* 주민번호 체크
* @param
* @return boolean
*/
/*
FrmChk.prototype.ssn = function() {
		var pattern = /^[_0-9-\.\_]+-[\.0-9-]+$/;
		return (pattern.test(this.obj.Rvalue)) ? true : false;
}
*/




/**
* 파일타입체크
* @param
* @return boolean
*/

FrmChk.prototype.ext = function() {

	/* ----------------------------------------------------------------- */
	
    if (this.form.encoding != "multipart/form-data") {
        alert("전송폼의 encode type이 잘못지정되어있습니다.");
        //return false;
    }
    
    this.obj.Rvalue = this.obj.Rvalue.toLowerCase();
    
    if(this.obj.Rvalue == ""){
    	return true;
    }
    else
	{
    	
    	var pattern = /^[a-zA-Z0-9가-힣@\.\\\:\s\_\(\)]+$/;
    	
    	if (pattern.test(this.obj.Rvalue) == false) {
    		 return false;
    	}
    	/*
    	var pattern = /\{([a-zA-Z0-9_-]+)\}/i;
    	e(pattern.test(this.obj.Rvalue))
    	if((pattern.test(this.obj.Rvalue)) == false)
	    {
    		//FrmChk.DE_errMsg["ext"] = "한글 및 특수문자가 들어 갈 수 없습니다";
	        return false;
	    }
	    */
	}
    
    //허용 파일
    var extfile = Array("jpg","jpeg","gif","bmp","doc","docx","pdf","xls","xlsx","zip","tif","ppt","pptx","hwp");
	
	var isExt = false;
	
	for (var i=0; i<extfile.length ;i++ ) {
		if (this.obj.Rvalue.toLowerCase().indexOf("."+extfile[i]) > -1) {
			isExt = true;
		}
	}
	
	if(!isExt){
		return false;
	}

	if (this.obj.Rvalue == "" || this.chkAttVal == "") {
		//규약조건을 벗어난 true 이므로
		return true;
	} else {

		/* ----------------------------------------------------------------- */

		var execExtArr = new Array();

		var exts = {
				"image" : "bmp,jpg,jpeg,gif,png"
				,"audio" : "wma,mp3,wav,mid,cda,asx,ogg"
				,"movie" : "avi,mpg,mpeg,asf,wmv,mov,m3u"
				,"document" : "txt,doc,hwp,pdf,ppt,gul,url"
				,"zip" : "zip,alz,rar,7z"
		}

		if (this.chkAttVal == "img") {
			execExtArr = exts['image'].split(",");
		} else if (this.chkAttVal == "aud") {
			execExtArr = exts['audio'].split(",");
		} else if (this.chkAttVal == "mov") {
			execExtArr = exts['movie'].split(",");
		} else if (this.chkAttVal == "doc") {
			execExtArr = exts['document'].split(",");
        } else if (this.chkAttVal == "zip") {
			execExtArr = exts['zip'].split(",");
		} else if(this.chkAttVal != undefined && this.chkAttVal != "") {
			execExtArr = this.chkAttVal.split(",");
		}

		try {
			for (var j=0;j < execExtArr.length; j++) {
				if (this.obj.Rvalue.indexOf("."+execExtArr[j]) != -1 ) {
					return true;
					break;
				}
			}
		} catch(e) {
			return false;
		}

		return true;
	}

	return true;
}

/**
* 아이디 체크
* @param
* @return boolean
*/
FrmChk.prototype.idChk = function() {

	var pattern = /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{6,12}$/;

	if (pattern.test(this.obj.Rvalue) == true) {
		return true;
	} else {
		return false;
	}
}

/**
* 한글 입력 체크
* @param
* @return boolean
*/
FrmChk.prototype.korean = function() {

	var pattern = /^[가-힣]+$/;

	if (pattern.test(this.obj.Rvalue) == true) {
		return true;
	} else {
		return false;
	}
}

/**
* 영문 및 한글 입력 체크
* @param
* @return boolean
*/
FrmChk.prototype.koreanenglishkr = function() {

	var pattern = /^[a-zA-Z가-힣\s]+$/;
	if(this.obj.Rvalue == ""){
		return true;
	}

	if (pattern.test(this.obj.Rvalue) == true) {
		return true;
	} else {
		return false;
	}
}

/**
* 영문 및 한글 입력 체크
* @param
* @return boolean
*/
FrmChk.prototype.koreanenglishen = function() {

	var pattern = /^[a-zA-Z가-힣\s]+$/;
	if(this.obj.Rvalue == ""){
		return true;
	}

	if (pattern.test(this.obj.Rvalue) == true) {
		return true;
	} else {
		return false;
	}
}

/**
* (신고센터) 패스워드 체크
* @param
* @return boolean
*/
FrmChk.prototype.reportPassChk = function() {

	var pws = this.obj.Rvalue;

	//공백은 사용할 수 없습니다.
	
	if (pws.indexOf(' ') > -1) {
				this.addErrMsg = "공백은 사용할 수 없습니다.";
				return false;
	}
	
	if(pws != "" || pws.length != 0){
		// 비밀번호는 영문자와 숫자의 혼합만 사용가능합니다.
		if (!this.isAlphaAndNumber(pws))	{
					this.addErrMsg = "비밀번호는 영문과 숫자의 혼합 문자만 사용 가능합니다.";
					return false;
		}

	   if (pws.length < 5) {
			this.addErrMsg = "5자 미만 문자열은 비밀번호로 사용하실 수 없습니다";
			return false;
		}
	   /*
		if (pws.length >= 20)	{
			this.addErrMsg = "20자 이상 문자열은 비밀번호로 사용하실 수 없습니다";
			return false;
		}
	    */
	}
	
	/*
	if(this.chkAttVal != undefined && this.chkAttVal != null && this.chkAttVal != "" && pws.indexOf(this.chkAttVal.substr(0, 4)) >= 0) {
		this.addErrMsg = "아이디와 유사한 비밀번호는 사용하실 수 없습니다.";
		return false;
	}
	*/
	return true;
}



/**
* 패스워드 체크
* @param
* @return boolean
*/
FrmChk.prototype.passChk = function() {

	var pws = this.obj.Rvalue;

	//공백은 사용할 수 없습니다.
	/*
	if (pws.indexOf(' ') > -1) {
				this.addErrMsg = "공백은 사용할 수 없습니다.";
				return false;
	}
	
	*/

	

	
	if(pws != "" || pws.length != 0){
		// 비밀번호는 영문자와 숫자의 혼합만 사용가능합니다.
		if (!this.isAlphaAndNumber(pws))	{
					this.addErrMsg = "비밀번호는 영문과 숫자의 혼합 문자만 사용 가능합니다.";
					return false;
		}

	   if (pws.length < 4) {
			this.addErrMsg = "4자 미만 문자열은 비밀번호로 사용하실 수 없습니다";
			return false;
		}

		if (pws.length >= 9)	{
			this.addErrMsg = "9자 이상 문자열은 비밀번호로 사용하실 수 없습니다";
			return false;
		}
	}
	
	/*
	if(this.chkAttVal != undefined && this.chkAttVal != null && this.chkAttVal != "" && pws.indexOf(this.chkAttVal.substr(0, 4)) >= 0) {
		this.addErrMsg = "아이디와 유사한 비밀번호는 사용하실 수 없습니다.";
		return false;
	}
	*/
	return true;
}

// ------------------------------------------------------------------------------------------------------------------------------

FrmChk.prototype.repeat_check = function(str, num) {
	var cnt = str.length;
	var repeat = "";
	var R=1;

	for(var i=0; i<cnt; i++) {
	tmp = str.substr(i, 1);
	key = tmp;
	if(key == repeat) { R++; }
	else { R=1; repeat = key; }
	if(R >= num) { return repeat; }
	}
	return "";
}


FrmChk.prototype.sequence_check = function(str, num) {
	var cnt = str.length;
	var repeat = 0;
	var R=1;

	for(var i=0; i<cnt; i++) {
	asc = str.charCodeAt(i);
	key = asc;
	if(key == repeat + 1) { R++; repeat = key; }
	else { R=1; repeat = key; }
	if(R >= num) { return repeat; }
	}
	return 0;
}

FrmChk.prototype.isAlphaAndNumber = function(val) {
	var isAlpha = false;
	var isNumber = false;
	var arr = val.split("");
	val = val.toLowerCase();

	for(var i=0; i < val.length; i++) {
		if ('a' <= val.charAt(i) &&val.charAt(i) <= 'z' ) {
			isAlpha = true;
		}

		if ('0' <= val.charAt(i) && val.charAt(i) <= '9' ) {
			isNumber = true;
		}
	}

	if (isAlpha && isNumber) {
		return true;
	} else {
		return false;
	}
}


// ----------------- 폼 부가 기능 설정 ----------------------

/**
 * Form 핸들링 부가 기능
 */
$frm = {

	/*
	 * 체크박스 모두 선택
	 * @param : 체크하려는 객체, 체크하려는 체크박스 얘
	 */
	allChk : function(Obj,Flag) {

        if (Flag.checked == true) {
			var Tmpchecked = true;
		} else {
			var Tmpchecked = false;
		}

		if (typeof Obj == "object") {
            if (isNaN(Obj.length) == true) {
                Obj.checked = Tmpchecked;
            } else {
                for (var i = 0 ; i < Obj.length; i++) {
                    Obj[i].checked = Tmpchecked;
                }
            }
		} else {
			Obj.checked = Tmpchecked;
		}
	}

	// yearList (Year)
	,yearList : function(y,type) {

		var type;
		var startYear;
		var lastYear;
		var todayDate;

		todayDate = new Date();

			if (type == null) {
					type = "";
			}

		startYear		= 1997;
		lastYear		= todayDate.getFullYear() + 3;

		//past date output
		if (type == "past") {
				lastYear = todayDate.getFullYear();
		} else if (type == "future") {
				startYear = todayDate.getFullYear();
				lastYear = todayDate.getFullYear()+10;
		}

			if (y == null) {
				var nowYear = todayDate.getFullYear();
			} else {
				var nowYear = y;
			}

			for (var i = lastYear; i >= startYear; i--) {
				document.write("<option value='" + i + "'");
				if (i == nowYear) {
					document.write(" selected");
				}
				document.write(">" + i + "</option>");
			}
		}

	// momthlist(month)
	,monthList : function (m) {

		day = new Date();

		if (typeof m == "undefined") {
			var mm = day.getMonth() + 1;

		} else if (m == "") {
			var mm = 0;

		} else {
			var m = m.toString();

			if (m.substring(0,1) == "0") {
				var mm = parseInt(m.substr(1, m.length));
			} else {
				var mm = parseInt(m);
			}
		}

		for (var i = 1; i <= 12; i++) {
			var n = (i < 10 ? "0" : "") + i;
			document.write("<option value='" + n + "'" + (i == mm ? " selected" : "") + ">" + n + "</option>");
		}
	}

	// DayList (Day)
	,dayList : function (y, m, d) {
		day = new Date();

		if (typeof y == "undefined") {
			var yy = day.getFullYear();
		} else if (y == "") {
			var yy = 0;
		} else {
			var yy = parseInt(y);
		}

		if (typeof m == "undefined") {
			var mm = day.getMonth() + 1;
		} else if (m == "") {
			var mm = 0;
		} else {
			var mm = (m.substr(0, 1) == "0") ? parseInt(m.substr(1, m.length)) : parseInt(m);
		}

		if (typeof d == "undefined") {
			var dd = day.getDate();
		} else if (d == "") {
			var dd = 0;
		} else {
			var dd = (d.substr(0, 1) == "0") ? parseInt(d.substr(1, d.length)) : parseInt(d);
		}

		for (var i = 1; i <= this.endDate(yy, mm); i++) {
			var n = (i < 10 ? "0" : "") + i;
			document.write("<option value='" + n + "'" + (i == dd ? " selected" : "") + "> " + n + " </option>");
		}

	}



	// LeapYear Check
	,leapYear : function (y) {
		if ((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0 && y % 4000 != 0)) {
			return true;
		} else {
			return false;
		}
	}

	// End Date
	,endDate : function (y, m) {
		var edate = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		if (m == 2) {
			//if ($frm.leapYear(y) == true) {
			if (this.leapYear(y) == true) {
				return 29;
			} else {
				return 28;
			}
		} else {
			return edate[m];
		}

	}

	// Change Date
	,chgDate : function (sel, y, m) {
		if (typeof y == "undefined" && typeof m == "undefined") {
			for (var i = 1; i <= 12; i++) {
				var n = (i < 10 ? "0" : "") + i;
				sel.options[i] = new Option(n, n);
			}
		} else {
			var mm = (m.substr(0, 1) == "0") ? parseInt(m.substr(1, m.length)) : parseInt(m);
			var ed = $frm.EndDate(y, mm);

			for (var i = sel.length - 1; i > 0; i--) {
				sel.options[i] = null;
			}

			for (var i = 1; i <= ed; i++) {
				var n = (i < 10 ? "0" : "") + i;
				sel.options[i] = new Option(n, n);
			}
		}
	}

	// 시
	,hourList : function (Sel) {

			if (isNaN(Sel) == false) {
				var requirement = Sel;

			} else {
				var requirement = 9;
			}


			for (var i = 0; i < 100; i++) {
				if (i < 10) {
					var n = "0" + i;
				} else {
					var n = i;
				}

				document.write("<option value='" + i + "'");
				if (i == requirement) {
					document.write(" selected");
				}
				document.write(">" + n + "H</option>");
			}
	}

	// Set 분
	,minList : function (Sel) {

			if (isNaN(Sel) == false) {
				var requirement = Sel;

			} else {
				var requirement = 0;
			}

			var Rtn = "";

			for (var i = 0; i < 60; i++) {

				if (i % 5 != 0) {
					continue;
				}

				if (i < 10) {
					var n = "0" + i;
				} else {
					var n = i;
				}

				Rtn = Rtn + "<option value='" + i + "'";

				if (i == requirement) {
					Rtn = Rtn + " selected";
				}
					Rtn = Rtn + ">" + n + "M</option>";
			}

		document.write(Rtn);

	}

    //
	// 문자열 길이 체크 후 알럿
    //
	,pressLength : function (messageContent,maxLengthNum) {
		var msgtext, msglen,maxLengthNum

		msgtext = document.getElementById(messageContent).value ;

		var i=0,l=0;
		var temp,lastl,maxLengthNumPrint;
		maxLengthNumPrint = maxLengthNum / 2


		//길이를 구한다.
		while(i < msgtext.length)
		{
			temp = msgtext.charAt(i);

			if (escape(temp).length > 4) {
				l+=2;
			} else if (temp!='\r') {
				l++;
			}

			if(l > maxLengthNum) {
				alert("메시지란에 허용 길이 이상의 글을 쓰셨습니다.\n메시지란에는 한글"+maxLengthNumPrint+"자, 영문"+maxLengthNum+"자까지만 쓰실 수 있습니다.");
				temp = document.getElementById(messageContent).value.substr(0,i);
				document.getElementById(messageContent).value = temp ;
				l = lastl;
				break;
			}

			lastl = l;
			i++;
		}
	}


    ,focusInit : function() {
        var sInput = document.getElementsByTagName("input");
        for (var i=0;i < sInput.length;i++) {
            if(sInput[i].type=="text") {
                sInput[i].focus();
                break;
            }
        }
    }
}




/**
 * @포커스 자동이동
 * nextFocus(cnt이상이면 이동, 이벤트 걸 인풋타임,다음께 아니라 지정객체로 바로 이동할경우)
 */
function nextFocus(cnt, obj,jumpFocus) {

    var nObj = obj;
    //if (obj.value.length < cnt) {
    //    return obj;
    //}

    if (typeof document.getElementById(jumpFocus) == "object" && document.getElementById(jumpFocus) != null) {
        nObj = document.getElementById(jumpFocus);
    } else {

        var moveChk = false;
        var sInputE = document.getElementsByTagName("input");

        for (var i=0;i < sInputE.length;i++) {
            if(moveChk == true && sInputE[i].type!="hidden" && sInputE[i].style.display!="none") {

                if (sInputE[i].value.length < cnt ) {
                    sInputE[i].select();
                } else {
                    //sInputE[i].value="";
                }
                sInputE[i].focus();
                nObj = sInputE[i];
                break;
            }

            if (sInputE[i] == obj) {

                if (sInputE[i].value.length < cnt) {
                    break;
                }
                if (jumpFocus == undefined) {
                    jumpFocus = 0;
                }
                moveChk = true;
                i = i + jumpFocus;
            }
        }
    }
    return nObj;
}

function IdValidateChk(str)
{
	var pattern = /^[a-zA-Z0-9]{1}[a-zA-Z0-9_]{6,12}$/;
	if (pattern.test(str) == true) {
	   return true;
	} else {
	   return false;
	}
}

/**
 * @Title :
 * @Description : 폼 입력이 긴 경우를 대비해 ajax 서버를 건드려 , 단 시간 limit 은 45분으로 한정
 * @Create : 2010-07-13 / gggl.ko
 *
 */

function fncChkJuminNo(jumin1, jumin2)
 
{
 

    var jno1= jumin1; //첫 번째 필드
 
    var jno2= jumin2; //두번째 필드
 



    if(jno1.length != 0)
 
    {
 
        var chk = 0;
 
        var yy  = jno1.substring(0, 2);
 
        var mm  = jno1.substring(2, 4);
 
        var dd  = jno2.substring(4, 6);
 
        var sex = jno2.substring(0, 1);
 



        if((jno1.length!=6) || (mm<1 || mm>12 || dd<1 || dd>31))
 
        {
 
            alert('본인 주민번호 첫번째자리 형식이 잘못 되었습니다.');
 
            return false;
 
        }
 



        if((jno2.length!=7) || (sex!=1 && sex!=2 && sex!=3 && sex!=4 ))
 
        {
 
            alert('본인 주민번호 두번째자리 형식이 잘못 되었습니다.');
 
            return false;
 
        }
 



        for(i=0; i<=5; i++) chk = chk+((i%8+2)*parseInt(jno1.substring(i, i+1)));
 



        for(i=6; i<=11; i++) chk = chk+((i%8+2)*parseInt(jno2.substring(i-6, i-5)));
 
        chk = (11-(chk%11))%10;
 
        if(chk!=jno2.substring(6, 7))
 
        {
 
            alert('주민번호 형식이 잘못 되었습니다.');
 
            return false;
 
        }
 
    } 
}

//추가 2013.08.21


// 추가추가 2013.08.20
function text_maxlength(obj) {
	 
	  var message;
	   var tempMessage = "";
	   var totalString= obj.value;
	   var maxlengthAttr = obj.getAttribute? parseInt(obj.getAttribute("maxlength")) : "";
	   //maxlength = maxlengthAttr * 2; 
	   maxlength = maxlengthAttr;
	        var textareaLength = obj.value.length;
	 
	        if (textareaLength == 0) {
	          //totalString = maxlengthAttr * 2;
	        	totalString = maxlengthAttr;
	         } 
	        else {
	              for (var i=0; i<textareaLength; i++) {
	                   message = totalString.charAt(i);
	                    if (escape(message).length > 4) {
	                    maxlength -= 2;
	                    }
	                    else {
	                   maxlength--;
	                   }
	   
	                   if (maxlength < 0) {
	                   alert("총 영문 "+maxlengthAttr+"글자, 총 한글 "+(maxlengthAttr/2)+"자까지 작성할 수 있습니다.\n" +
	                   		"A total of "+maxlengthAttr+" characters in English, a total of "+(maxlengthAttr/2)+" Hangul letters you can write to.");
	                   obj.value= tempMessage;
	                   break;
	                  } 
	                else {
	                    tempMessage += message;
	                 }
	              }//end for
	         }
}
