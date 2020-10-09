// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');


// 모듈로 분리한 설정 파일 불러오기
var config = require('./config/config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./config/database');
database.databaseInit();

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./config/route_loader');

// cors 사용 - 클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

// 익스프레스 객체 생성
var app = express();

var engine = require('ejs-locals');
//Layouy 을 사용하기 위한 모듈

var ks = require('node-key-sender');
app.set("ks", ks);


//===== 뷰 엔진 설정 =====//
app.engine('ejs',engine); //ejs-locals 모듈 설정
app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

console.log('뷰 엔진이 ejs로 설정되었습니다.');

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);

app.set("database" , database);
app.set("config" , config);


// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
const hour_1 = 3600000; // 1시간
const min_1 = 60000; // 1분
var maxTime = hour_1 * 6;
app.use(expressSession({
	secret:'my key',
	resave:true,
  saveUninitialized:true,
  // cookie:{ expires : new Date(Date.now() + maxTime)}
}));
// expires == 만료

var requestIp = require('request-ip')
app.use(function(req, res, next) {
  
  var chk_result = true;
  var msg = '';
  var url = '';
  
  /*로그인 Session 체크 Start*/
  var excep_Url = config.auth_Exception;
  
  if(  (excep_Url).indexOf(  req.url) == -1){
    
    if( typeof( req.session.user ) == 'undefined' ){
      chk_result = false;
      msg = '로그인 후 이용해주세요.';
      url = 'login/login.ejs' ;  
    };

  };

  var userNm = '';
  var userId = '';

  res.locals.userNm = (req.session.user) ? (req.session.user).USER_NAME : userNm;
  res.locals.userId = (req.session.user) ? (req.session.user).USER_ID : userId;
  
  if(! chk_result ){
    //Auth Check failed
    res.render(url, {param:req ,  message:msg});
  }else{
    next();
  };
  
  
  
  
});



//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());

//라우팅 정보를 읽어들여 라우팅 설정
var router = express.Router();
route_loader.init(app, router);

//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');

	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});

// 시작된 서버 객체를 리턴받도록 합니다.
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});
