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
  var login_chk = true;

  var p_user_id = (req.body.user_id || req.query.user_id);
  var p_user_pwd = (req.body.user_pwd || req.query.user_pwd);
  
  var result_data = {
    USER_ID : p_user_id ,
    USER_NAME :  p_user_pwd
  };

  if( login_chk ){
    //로그인 성공후 session 담기
    req.session.user = result_data;

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




