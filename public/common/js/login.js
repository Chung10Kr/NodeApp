$(function() {
	$("#btnLogin").click(function (){
		if($("#userId").val() == '') {
			alert('아이디를 넣어주세요!!');
			return false;
		}
		if($("#passwd").val() == '') {
			alert('비밀번호를 넣어주세요!');
			return false;
		}
		if($("#userId").val().indexOf(" ")>-1){
				alert("아이디에 공백은 허용되지않습니다.");
				return false;
		}
		return true;
	});
	
	
});

function fnPwChk(userId, pwdID){
	
	var uid = document.getElementById(userId); 
	var pwd1 = document.getElementById(pwdID); 
    var inNum = false;
    var inEng = false;
    var inSChar = false;
    var inRange=  false;
    
    if(!pwd1.value){
        alert("비밀번호를 입력해주세요.");
        pwd1.focus();
        return false;
    } else {
        //비밀번호 8자 이상인지 확인
        if(pwd1.value.length<8){
            alert("비밀번호는 8자 이상 입력해주세요.");
            pwd1.focus();
            return false;
        }
        
        if(pwd1.value.indexOf(uid.value) > -1) {
          alert("비밀번호는 ID를 포함할 수 없습니다.");
          return false;
       }

        //숫자포함여부 확인
        for(i=0; i<pwd1.value.length; i++){
            if((pwd1.value.charCodeAt(i)>=48) && (pwd1.value.charCodeAt(i)<=57) ){
                inNum = true;
                break;
            }
        }
        //영문자 포함여부 확인
        for(i=0; i<pwd1.value.length; i++){
            if( ((pwd1.value.charCodeAt(i)>=65) && (pwd1.value.charCodeAt(i)<=90)) || ((pwd1.value.charCodeAt(i)>=97) && (pwd1.value.charCodeAt(i)<=122)) ){
                inEng = true;
                break;
            }
        }

        //특수문자 포함여부 확인
        for(i=0; i<pwd1.value.length; i++){
            if( ((pwd1.value.charCodeAt(i)>=33) && (pwd1.value.charCodeAt(i)<=47)) || ((pwd1.value.charCodeAt(i)>=58) && (pwd1.value.charCodeAt(i)<=64)) || ((pwd1.value.charCodeAt(i)>=91) && (pwd1.value.charCodeAt(i)<=96)) ){
                inSChar = true;
                break;
            }
        }

        if(pwd1.value.length<10){    //비밀번호가 10자리 미만이라면
            if(!(inNum&&inEng&&inSChar)){
                alert("비밀번호는 영문 대·소문자와 숫자와 특수문자도 함께 사용해 주세요.");
                return false;
            }
        } else { 
            if((inNum&&inEng) || (inEng&&inSChar) || (inNum&&inSChar)){
                return true;
            } else {
                alert("비밀번호는 영문 대·소문자, 숫자, 특수문자중 2종을 섞어서 사용해 주세요.");
                return false;
            }
        }
    }
}



