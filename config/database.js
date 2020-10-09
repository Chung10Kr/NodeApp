const mybatisMapper = require('mybatis-mapper');
const config = require('./config');
const sql = require('mssql')


var databaseInit = function(){
	
	var arr = config.mapper_info;
	for(var z=0 ; z<arr.length ; z++){
		for( var y=0 ; y<z ; y++){
			if(arr[z].mapperNm == arr[y].mapperNm){
				
				console.log("[Database Error] ======> Mapper Name Duplication Exception")
				process.exit();
				break;
			};
		} ;
	};
};

var database = async function( mapperNm , queryId ,param){
	
	var mapperPath = null;
		
	for(var i=0 ; i < config.mapper_info.length ; i++){
		if( config.mapper_info[i].mapperNm == mapperNm){
			mapperPath = config.mapper_info[i].path;
		};
	};
	if( mapperPath == null ){
		console.log("[Database Error] ======>Mapper Path Null Exception ");
		return false;
	};

	let result;
	try {
		let pool = await sql.connect(config.db_url);
			mybatisMapper.createMapper([mapperPath]);
		var format = {language: 'sql', indent: '  '};
		var query = mybatisMapper.getStatement(mapperNm,queryId, param, format);

		//console.log( "[MSSQL SQL]]============>" );
		//console.log(query);
		//console.log( "[MSSQL SQL]]============<" );

		result = await pool.request().query(query);
	
	}catch (err){
		console.log(err);
	};
	
	return result;
};

// database 객체를 module.exports에 할당
module.exports = database;
module.exports.databaseInit = databaseInit;