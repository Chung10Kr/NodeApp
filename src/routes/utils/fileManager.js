/*
 * fileManager
 * @date 2020-05-26
 * @author Chung10 
 */
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');
var moment = require('moment');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
var uploadFile = async function (req, res) {

      
  
  var database = req.app.get('database');

  var returnPath='';
  var form = new multiparty.Form();
  
  var BOARD_ID = "";
  // get field name & value

  form.on('field',function(name,value){
    BOARD_ID = value;
  });

  var filenames = [];
  var fullpaths = [];
  // file upload handling
  form.on('part',function(part){


       var filename;
       var size;
       

       if (part.filename) {
             filename = moment().hours()+""+moment().minutes()+""+moment().seconds()+moment().milliseconds()+"_"+part.filename;
             size = part.byteCount;
       }else{
             part.resume();
       };
       
       filenames.push(filename);
       //폴더 생성
      var file_location = req.app.set("config").upload_location;
      var dir = file_location ; 
      var paths = [moment().format("YYYY")  , moment().format("MM") , moment().format("DD")  ];
      for(var i=0; i < 3 ; i++){
        dir = path.join(dir , paths[0] );
        returnPath = path.join(returnPath , paths[0] );
        paths.splice(0,1);
        !fs.existsSync(dir)&&fs.mkdirSync(dir);
        
      };
      returnPath = path.join(returnPath , filename );
      
       var fullpath = path.join(dir , filename);
       var writeStream = fs.createWriteStream(fullpath);
       fullpaths.push(fullpath);
       writeStream.filename = filename;
       part.pipe(writeStream);
       part.on('data',function(chunk){
       });
       part.on('end',function(){
             writeStream.end();
       });
       
  });
  // all uploads are completed
  form.on('close',function(){
      for(var i=0; i<filenames.length ; i++){
        params={
          FILE_NAME : filenames[i] , 
          FILE_DIR : fullpaths[i],
          BOARD_ID : BOARD_ID,
          USER_ID : res.locals.userId 
        };
        database( "boardMapper" , "insertFile" , params );

      }
      
      res.status(200).send({"result" : true });
      
  });
  // track progress
  form.on('progress',function(byteRead,byteExpected){
  });
  form.parse(req);
};

    





var mime = require('mime');
var filedown= async function(req,res){
  
  var database = req.app.get('database');
  var param = {
    FILE_ID :  (req.body.file_id || req.query.file_id)
  };
  var fileData = await database( "boardMapper" , "getFile" , param );
  var file = fileData.recordset[0].FILE_DIR;
  
  try {
    if (fs.existsSync(file)) { // 파일이 존재하는지 체크
      var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
      var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
      
      res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(filename) ); // 다운받아질 파일명 설정
      res.setHeader('Content-type', mimetype); // 파일 형식 지정
      
      var filestream = fs.createReadStream(file);
      
      filestream.pipe(res);
    } else {
      res.send('해당 파일이 없습니다.');  
      return;
    }
  } catch (e) { // 에러 발생시
    console.log(e);
    res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
    return;
  };
  
};


var deleteFile  = async function(req, res) {

  var database = req.app.get('database');
  var param = {
      FILE_ID : (req.body.FILE_ID || req.query.FILE_ID) , 
      USER_ID : res.locals.userId ,
  };
  var result = false;
  try{
    var file = await database( "boardMapper" , "updateFile" , param );
    result = true;
  }catch(err){
    console.log(err)
  };
  res.json({"result":result})
};

module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile
module.exports.filedown = filedown;






