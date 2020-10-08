/*
 * 바코드 스캔
 * @date 2020-05-13
 * @author LCY
 */




var scan = function(req, res) {
  res.render('scan/scan.ejs', {param:req});
};

var send = async function(req, res) {
  
  var sendIp = (req.body.sendIp || req.query.sendIp);
  var sendTxt = (req.body.sendTxt || req.query.sendTxt); 

  const options = {
    uri:"http://"+sendIp,
    qs:{
      sendTxt:sendTxt
    }
  };
  const request = require('request');
  request(options,function(err,response,body){
    var result = false;

    if(JSON.parse(body) == "SUC"){
      result=true;
    };
    
    res.json(result);  
  });

  
  
};


module.exports.scan = scan;
module.exports.send = send;



