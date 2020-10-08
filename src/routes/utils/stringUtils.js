/*
 * stringUtils
 * @date 2020-06-03
 * @author LL Chung10 
 */

//req.body -> object params 
exports.setParams = function(params){
    var returnP = {};
    for( var i=0 ; i<Object.keys(params).length ; i++){
        returnP[  Object.keys(params)[i]  ] = Object.values(params)[i] ;
        };
        return returnP;
};



//페이징 처리
/*
totalPageCount : 전체 카운트 , 
curPage: 현재 페이지 
*/
exports.pageSet = async function(totalPageCount , curPage ){
    curPage = parseInt(curPage);
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 8;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = Math.ceil(  totalPageCount / page_size ) ;
    //limit 변수
    var no = "";


    //전체 페이지 갯수
    if (totalPageCount < 0) {
    totalPageCount = 0
    }

    var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
    var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수

    
    var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호

    
    var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
    var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


    //현재페이지가 0 보다 작으면
    if (curPage < 0) {
    no = 0
    } else {
    //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
    no = (curPage - 1) * 10
    }

    
    var startRow = curPage * page_size - page_size + 1
    var result2 = {
    "curPage": curPage,
    "page_list_size": page_list_size,
    "page_size": page_size,
    "totalPage": totalPage,
    "totalSet": totalSet,
    "curSet": curSet,
    "startPage": startPage,
    "endPage": endPage,
    "startRow":startRow,
    "endRow" : startRow + page_size - 1
    };

    
    return result2;

};