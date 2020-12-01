# Node App
  품질재단 스마트 팩토리 개발자 양성과정 Web, Node 강의 
  
### project
-Express.js  
-MSSQL  
-MyBatis  
-Node.pptx  : 강의자료
-로그인,게시판 구현  

### project Setup
```
npm install
node app.js
```

### DB SCRIPT
```
CREATE SEQUENCE env_board_seq
AS int     --int 정수형
START WITH 1 -- 시작 값 0부터
INCREMENT BY 1;   


CREATE SEQUENCE board_Seq
AS int     --int 정수형
START WITH 1 -- 시작 값 0부터
INCREMENT BY 1;   


CREATE SEQUENCE board_files_seq
AS int     --int 정수형
START WITH 1 -- 시작 값 0부터
INCREMENT BY 1;   


CREATE TABLE env_user (
	user_id varchar(30),
	user_name varchar(60),
	user_pwd varchar(256),
	user_end_date varchar(8),
	user_type varchar(8),
	CONSTRAINT PK__env_user PRIMARY KEY (user_id)
)
insert into env_user
values
( 'admin','admin','admin','29990225' , 'S');


CREATE TABLE board_file (
	file_id varchar(100) ,
	board_id varchar(100) ,
	create_by varchar(100) ,
	create_date date NULL,
	use_yn varchar(100) ,
	file_name varchar(1000) ,
	file_dir varchar(1000) ,
	update_by varchar(100) ,
	update_date date NULL,
	CONSTRAINT board_file_PK PRIMARY KEY (file_id)
)


CREATE TABLE env_board (
	board_id varchar(100) ,
	board_title varchar(100) ,
	board_content varchar(8000) ,
	create_by varchar(100) ,
	create_date date NULL,
	update_by varchar(100) ,
	update_date date NULL,
	use_yn varchar(100) ,
	CONSTRAINT env_board_PK PRIMARY KEY (board_id)
)


CREATE TABLE board_log (
	user_id varchar(100) ,
	create_date varchar(100),
	board_id varchar(100) 
)
```
