
/*
 * monitoring
 * @date 2020-09-29
 * @author LCY
 */
var stringUtils = require("./utils/stringUtils");


var list = async function(req, res) {

  var database = req.app.get('database');
  /*get 유저타입*/
  var mapperNm = 'boardMapper'
	var queryId='getUserType'
  var param = { 
      p_user_id: res.locals.userId
  };
  var result = await database( mapperNm , queryId , param );

  var user_type = '';
  
  if(  (result.recordset).length > 0 ){
    if( typeof( result.recordset[0].USER_TYPE ) != "undefined" ){
      user_type = result.recordset[0].USER_TYPE;
    };
  }
  /*get 유저타입*/

  res.render('board/boardList.ejs', {param:req  , user_type:user_type });
};
// 조회 화면 이동
var listTable = async function(req, res) {
  var database = req.app.get('database');
  
  var cnt = await database( "boardMapper" , "getBoardCnt" , { title: req.query.title || req.body.title  } );


  var totalPage = cnt.recordset[0].CNT;
  var page = await stringUtils.pageSet( totalPage , (req.query.page || req.body.page)  );

  
  /*글 가져오기*/
  var param2 = { 
      p_user_id: res.locals.userId,
      title: req.query.title || req.body.title,
      startRow : page.startRow,
      endRow : page.endRow
  };
  var result2 = await database( "boardMapper" , "getBoardList" , param2 );
  
  /*글 가져오기*/
  res.render('board/boardListTable.ejs', {param:req , pasing : page , resultList:result2.recordset   });
};

// 등록 화면 이동
var add = async function(req, res) {
  res.render('board/boardAdd.ejs', {param:req  });
};

//게시판 등록
var addAct = async function(req, res) {
  var database = req.app.get('database');
  var result = await database( "boardMapper" , "getBoardSeq" , {} );
  const BOARD_ID = result.recordset[0].SEQ ;
  
  var param = { 
    USER_ID :  res.locals.userId  , 
    TITLE :  (req.body.title || req.query.title),
    CONTENT :  (req.body.content || req.query.content),
    BOARD_ID : BOARD_ID
  };
  var rel=false;
  try{
    var result2 = database( "boardMapper" , "insertBoard" , param );
    rel=true;
  }catch(err){
    console.log( err)
  }
  

  res.json({"BOARD_ID" : BOARD_ID , "result" : rel });
};

// 조회 화면
var view = async function(req, res) {

  var database = req.app.get('database');

  var BOARD_ID = (req.body.board_id || req.query.board_id);
  
  var param = {BOARD_ID : BOARD_ID , USER_ID : res.locals.userId }

  var board = await database( "boardMapper" , "getBoard" , param );
  var files = await database( "boardMapper" , "getFiles" , param );
  

  var result = await database( "boardMapper" , "insertLog" , param );
  var logs = await database( "boardMapper" , "getLog" , param );
  

  res.render('board/boardView.ejs', {param:req , board:board.recordset[0] , files:files.recordset  , logs:logs.recordset     });
};


// 수정 화면
var edit = async function(req, res) {

  var database = req.app.get('database');

  var param = {
      BOARD_ID : (req.body.board_id || req.query.board_id) , 
      USER_ID : res.locals.userId 
    }

  var board = await database( "boardMapper" , "getBoard" , param );
  var files = await database( "boardMapper" , "getFiles" , param );
  
  res.render('board/boardEdit.ejs', {param:req , board:board.recordset[0] , files:files.recordset });
};

//게시글 삭제
var deleteAct  = async function(req, res) {

  var database = req.app.get('database');
  var param = {
      BOARD_ID : (req.body.board_id || req.query.board_id) , 
      USER_ID : res.locals.userId ,
      deleteyn : 'Y'
  };
  var result = false;
  try{
    var board = await database( "boardMapper" , "updateBoard" , param );
    var file = await database( "boardMapper" , "updateFile" , param );
    result = true;
  }catch(err){
    console.log(err)
  };
  

  res.json({"result":result})
};

//게시글 수정
var updateAct  = async function(req, res) {
  var database = req.app.get('database');
  var param = {
      BOARD_ID : (req.body.board_id || req.query.board_id) , 
      USER_ID : res.locals.userId , 
      BOARD_TITLE : (req.body.title || req.query.title) , 
      BOARD_CONTENT : (req.body.content || req.query.content)
  };
  var result = false;
  try{
    var updateBoardfile = await database( "boardMapper" , "updateBoard" , param );
    result = true;
  }catch(err){
    console.log(err)
  };
  res.json({"result":result})
}


module.exports.list = list;
module.exports.listTable = listTable;
module.exports.add = add;
module.exports.addAct = addAct;
module.exports.view = view;
module.exports.edit = edit;
module.exports.deleteAct = deleteAct;
module.exports.updateAct = updateAct;

