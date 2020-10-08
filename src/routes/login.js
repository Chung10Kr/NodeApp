/*
 * login
 * @date 2019-05-07
 * @author LCY
 */


  


var requestIp = require('request-ip');

var login = async function(req, res) {
  if( typeof( req.session.user ) != 'undefined' ){
    res.redirect('/main');
  }else{
    res.render('login/login.ejs', {param:req ,  message:"none"});
  };
};


var loginChk = async function(req, res) {

  var p_user_id = (req.body.user_id || req.query.user_id);
  var p_user_pwd = (req.body.user_pwd || req.query.user_pwd);
  
  var database = req.app.get('database');
  
  var mapperNm = 'loginMapper'
	var queryId='getLogin'
  var param = { 
      p_user_pwd: p_user_pwd ,
      p_user_id:p_user_id 
  };
  
  var result = await database( mapperNm , queryId , param );

  var result_date = result.recordset[0];
  var msg = 'none';
  var login_chk = true;
  if(result.rowsAffected == 0 ){
    msg="등록되지 않는 아이디입니다.";
    login_chk=false;
  }else if(result_date.END_DATE_CHECK == 1){
    msg="만기일자가 지나 로그인을 할 수 없습니다.";
    login_chk=false;
  }else if(result_date.CHECK_PWD == 1){
    if(result_date.CHANGE_PWD > 0){
      msg="비밀번호가 설정 또는 변경된지 50일이 지났습니다. 설정 및 변경 후 다시 로그인 하세요";
      login_chk=false;
    }
  }else{
    msg="비밀번호가 틀렸습니다";
    login_chk=false;
  }

  if( login_chk ){
    //로그인 성공후 session 담기
    req.session.user = result_date;

    res.redirect('/main');

  }else{
    res.render('login/login.ejs', {param:req ,  message:msg});
  }

};

var loginOut = async function(req, res) {

  req.session.destroy(function(){ 
    req.session;
    res.redirect('/');
  });
  
  
};


module.exports.login = login;
module.exports.loginChk = loginChk;
module.exports.loginOut = loginOut;




