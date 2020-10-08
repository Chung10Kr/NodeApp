
/*
 * 설정
 */
			   
var property = require("./property"); 
module.exports = {
	server_port: property.server_port,
	db_url: property.db_url,
	//파일 위치 (%소스 위치 아님)
	files_location : property.files_location,
	//파일 업로드 위치 
	upload_location : property.files_location + "/upload",

	
	route_info:[
			{file:'../src/routes/login', path:'/', method:'login', type:'get'},
			{file:'../src/routes/main', path:'/main', method:'main', type:'get'},

		    //로그인
			{file:'../src/routes/login', path:'/login/login', method:'login', type:'get'},
			{file:'../src/routes/login', path:'/login/loginChk', method:'loginChk', type:'post'},
			{file:'../src/routes/login', path:'/login/logOut', method:'loginOut', type:'get'},

			//파일 업로드
			{file:'../src/routes/utils/fileManager', path:'/uploadFile', method:'uploadFile', type:'post'},
			{file:'../src/routes/utils/fileManager', path:'/filedown', method:'filedown', type:'post'},
			{file:'../src/routes/utils/fileManager', path:'/deleteFile', method:'deleteFile', type:'post'},


			//공지사항
			{file:'../src/routes/board', path:'/board/list', method:'list', type:'get'},
			{file:'../src/routes/board', path:'/board/list', method:'list', type:'post'},
			{file:'../src/routes/board', path:'/board/listTable', method:'listTable', type:'post'},
			
			{file:'../src/routes/board', path:'/board/add', method:'add', type:'post'},
			{file:'../src/routes/board', path:'/board/add/act', method:'addAct', type:'post'},
			{file:'../src/routes/board', path:'/board/view', method:'view', type:'post'},
			{file:'../src/routes/board', path:'/board/edit', method:'edit', type:'post'},
			
			{file:'../src/routes/board', path:'/board/delete/act', method:'deleteAct', type:'post'},
			{file:'../src/routes/board', path:'/board/update/Act', method:'updateAct', type:'post'},
			
			
	],
	//Auth Check Exception
	auth_Exception:[
		"/",
		"/login/login",
		"/login/loginChk"
	],

	// Mybatis Mapper 설정
	mapper_info:[
		{mapperNm : 'loginMapper' , path: './src/mapper/loginMapper.xml'},
		{mapperNm : 'boardMapper' , path: './src/mapper/boardMapper.xml'},
		
	]
}
