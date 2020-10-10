
GIT : https://github.com/LEECHUNGRYEOL/NodeSample.git



% Node 로그인 , 게시판 Sample

-셋팅
1. npm install
2. config.js 수정
3. node app.js



-배포
1. npm run build
2. exe파일 실행




-MSSQL TABLE
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

CREATE TABLE dbo.env_board (
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