/** http://joliclic.free.fr/php/javascript-packer/en/index.php
 * highcharts 사용 공통 자바스크립트
 * 작성자 방지환
 * mail : b8545@naver.com 
 */

	Highcharts.setOptions({
			lang: {
		        thousandsSep: ','
		    }
	});
	
	//div영역 로딩 이미지 세팅
	function setChartLodingImg(opt){
		$("#"+opt.chart.renderTo).addClass("chartAreaClass");
		$("#"+opt.chart.renderTo+"Table").addClass("chartAreaClass");
		var cSrc = $("#"+opt.chart.renderTo+"Loding");
		//로딩이미지가 없을경우 자동 세팅
		if(cSrc.length == 0){
			$("#"+opt.chart.renderTo).prepend('<img id="'+opt.chart.renderTo+'Loding" src="/img/ajax-loader.gif" class="loading_img"/>');
		}
	}
	//div영역 로딩 이미지 세팅
	function setTabletLodingImg(opt){
		var cSrc = $("#"+opt.table.renderTo+"Loding");
		//로딩이미지가 없을경우 자동 세팅
		if(cSrc.length == 0){
			$("#"+opt.table.renderTo).prepend('<img id="'+opt.table.renderTo+'Loding" src="/img/ajax-loader.gif" class="loading_img"/>');
		}
	}
	
	
	/*	{
	     chart: {
	            renderTo: 'chartDiv3',    
	            type: 'pie'
	            },
	            title: {
	                    text: ''
	            },
	            data : { lgu : '1_2', qid : 'mt.monitor.getMonitor03_03'
	            },
	            seriesPieNm : '점유율',
	            types:['column','column','column','line']
	}*/
	//차트 Data 호출
	function chartDataLoad(opt, async, sucessFun){
		if(async == undefined) async = true;
		$("#"+opt.chart.renderTo+"Loding").show();
		jQuery.ajax({
		    type:"POST",
		    data: opt.data,
		    url: "/mt/chart",
		    dataType:"JSON",
		    async: async,
		    success: function(data){
		    	$("#"+opt.chart.renderTo+"Loding").hide();
		    	chartRendering(data, opt);
		    	chartToTable(data,opt);
		    },
		     complete : function(date){
		    	 $("#"+opt.chart.renderTo+"Loding").hide();
		    }, 
		    error : function(xhr, status, error){
		    	$("#"+opt.chart.renderTo+"Loding").hide();
		        alert(decodeURI("%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%98%A4%EB%A5%98%EA%B0%80%20%EB%B0%9C%EC%83%9D%ED%95%98%EC%98%80%EC%8A%B5%EB%8B%88%EB%8B%A4."));
		    }
		    
		});
	}
	
	//차트 렌더링
	function chartRendering(data, opt){
    	//차트 옵션
		var options = {
			 	chart: {
	                renderTo: 'container',             //div 태그와 연동되는 필수(str)
	                type: 'column'
	            },
	            colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#ffc000', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
				credits: {
	                enabled : false
	            },
	            title: {
	                text: '테스트',
	                style: {
	                    fontWeight: 'bold'
	                    ,fontSize: '14px'	
	                }
	            },
	            xAxis: {
	                 labels: {
	                     enabled: true,
	                 },
	                 /*crosshair: true,*/
	                 categories:data.categories
	            },
	            plotOptions: {
	                series: {
	                    marker: {
	                        enabled: true
	                    }
	                }

	            }, 
	            yAxis: {
	                title: {
	                    text: ''
	                }, 
	                min : 0 ,
	                tickInterval : null,
	                max : null,
	                plotLines: [{
	                    value: 0,
	                    width: 1,
	                    color: '#808080'
	                }],
	                labels: {
	                    format: '{value:.,0f}'
	                }
	            },
	            tooltip: {
	            	/*enabled: false,*/
	                valueSuffix: ''
	            },
	            legend: {
	                layout: 'horizontal',    //horizontal, vertical
	                align: 'center',         //left, center, right
	                verticalAlign: 'bottom', //top, middle, bottom 
	                borderWidth: 0 
	            },
	            /* legend: {
	                layout: 'vertical',
	                align: 'left',
	                x: 80,
	                verticalAlign: 'top',
	                y: 55,
	                floating: true,
	                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
	            }, */
	            series: data.series,
	            lang: {
	                noData: decodeURI("%EC%9E%90%EB%A3%8C%EA%B0%80%20%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4.")
	            },
	            noData: {
	                style: {
	                    fontWeight: 'bold',
	                    fontSize: '15px',
	                    color: '#303030'
	                }
	            }
	            
		};
		
		
		//pie 차트일 경우에만	
		if(opt.chart.type == 'pie'){
			
			options.tooltip = {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        };
			options.series = data.seriesPie;
	        options.plotOptions = {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        };
	        try{ if(opt.seriesPieNm != undefined ) options.series[0].name = opt.seriesPieNm; }catch(e){}
		}
		
		
        //주로 사용되는 옵션 변경사항 적용
		if(opt != undefined ){
			//chart
			try{ if(opt.chart.renderTo != undefined ) 		options.chart.renderTo		= opt.chart.renderTo; }catch(e){}//div ID
			try{ if(opt.chart.type != undefined ) 			options.chart.type 			= opt.chart.type; }catch(e){} //차트 유형
			//title
			try{ if(opt.title.text != undefined ) 			options.title.text 			= opt.title.text; }catch(e){} //타이틀 유형
			try{ if(opt.colors != undefined ) 				options.colors 				= opt.colors; }catch(e){} //타이틀 유형
			//yAxis
			try{ if(opt.yAxis.min != undefined ) 			options.yAxis.min 			= opt.yAxis.min; }catch(e){} //y축 최소 표
			try{ if(opt.yAxis.max != undefined ) 			options.yAxis.max 			= opt.yAxis.max; }catch(e){} //y축 최대 표시
			try{ if(opt.yAxis.tickInterval != undefined ) 	options.yAxis.tickInterval 	= opt.yAxis.tickInterval; }catch(e){} //y축 간격
			
			
			try{ if(opt.plotOptions != undefined ) 			options.plotOptions 			= opt.plotOptions; }catch(e){} //plotOptions
			try{ if(opt.legend != undefined ) 				options.legend 					= opt.legend; }catch(e){} //legend
			try{ if(opt.tooltip != undefined ) 				options.tooltip 				= opt.tooltip; }catch(e){} //tooltip
			try{ if(opt.yAxis != undefined ) 				options.yAxis 					= opt.yAxis; }catch(e){} //yAxis
			
			//전체 옵션 변경시 사용
			try{ if(opt.options != undefined ) 				options 					= opt.options; }catch(e){} //y축 간격
		}
		
		var chart = new Highcharts.Chart(options);
		
		if(opt != undefined ){
			try{ 
				if(opt.types != undefined ){
					var t = opt.types;
					for(var i = 0 ; i< t.length ; i++){
						chart.series[i].update({
				            type: t[i]
				        });
					}
				}
			}catch(e){
			}
		}
		
		try{
    		if(typeof(eval(opt.chart.renderTo+"Success")) == 'function') eval(opt.chart.renderTo+"Success")();	
    	}catch(e){
    		
    	}
		
	}
	
	//차트 테이블로 변환
	function chartToTable(datas ,opt){
		var hearders = datas.categories;
		var $tr = $('<tr />').appendTo("#"+opt.chart.renderTo+"TableData thead");
		$('<th />').text("구분").appendTo($tr);
		for(var i = 0 ; i<hearders.length ; i ++){
			$('<th />').text(checkNull(hearders[i])).appendTo($tr);
		}
		
		var bodys = datas.series;
		for(var i = 0 ; i<bodys.length ; i ++){
			var $tr = $('<tr />').appendTo("#"+opt.chart.renderTo+"TableData tbody");
			var sss = bodys[i].data;
			$('<th />').text(checkNull(bodys[i].name)).appendTo($tr);	
			for(j in sss){
				$('<td />').text(checkNull(sss[j])).appendTo($tr);	
			}	
		}
	}
	
	///////////////////////////////////////////////////////////////////////////////////
	
	
	/* type : column, bar, pie, area, spline, linear, areaspline, line */
	/*
	Insert into NWISDBA.MONITOR_INFO
	   (VIEW_NM, VIEW_OPT, OPT_GUBUN)
	 Values
	   ('monitor02', '{
	     table: {
	            renderTo: ''tableArea4'',    
	            headCnt : 2,
	            colSize : [150,150,200,200,200]
	            colMerge : [0, 1, 2  7]
	            rowMerge : [0, 1, 2] 
	            },
	    data : { qid : ''bms.chart.getMonitor02_C01''
	      },
	       interval : 0           
	}', 'T');
*/	
	//테이블 Data 호출
	function tableDataLoad(opt){
		$("#"+opt.table.renderTo+"Loding").show();
		jQuery.ajax({
		    type:"POST",
		    data: opt.data,
		    url: "/mt/jsonTable",
		    dataType:"JSON",
		    success: function(data){
		    	var list = data.list;
		    	tableRendering(list, opt);
		    	$("#"+opt.table.renderTo+"Loding").hide();
		    },
		     complete : function(date){
		    	 $("#tableDIvLoding").hide();
		    }, 
		    error : function(xhr, status, error){
		    	$("#"+opt.table.renderTo+"Loding").hide();
		        alert(decodeURI("%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%98%A4%EB%A5%98%EA%B0%80%20%EB%B0%9C%EC%83%9D%ED%95%98%EC%98%80%EC%8A%B5%EB%8B%88%EB%8B%A4."));
		    }
		});
	}
	
	//table 렌더링
	function tableRendering(list, opt){
		var tId = opt.table.renderTo;
		var listLen = list.length;
		var headCnt = opt.table.headCnt; 
		if(headCnt == undefined) headCnt = 1;
		$('#'+tId).show();
		$('#'+tId+'Data').find("thead tr").remove();
		$('#'+tId+'Data').find("tbody tr").remove();
		$('#'+tId+'Data').find("colgroup").remove();
		
		//col 넓이 세팅
		try{ 
			if(opt.table.colSize != undefined ){
				var colSizes = opt.table.colSize;
				var $colgroup = $('<colgroup />').appendTo('#'+tId+'Data');
				for(var i = 0; colsLen = colSizes.length,  i<colsLen; i ++){
					$('<col />', {
						width: colSizes[i]+'px'
			            }).appendTo($colgroup);
				}
				
			} 
		}catch(e){
			//console.log(e);			
		}
	
		//헤더, 바디 세팅
		for(var i = 0 ; i<listLen ; i ++){
			if(i < headCnt){
				var $tr = $('<tr />').appendTo('#'+tId+'Data thead');
				var datas = list[i];
				for(j in datas){
					$('<th />').html(checkNull(datas[j])).appendTo($tr);
				}	
			}else{
				var $tr = $('<tr />').appendTo('#'+tId+'Data tbody');
				var datas = list[i];
				for(j in datas){
					if(j.indexOf("H") > -1){
						$('<th />').html(checkNull(datas[j])).appendTo($tr);
					}else{
						var alg = 'center';
						if(j.indexOf("L") > -1){
							alg = 'left';
						}else if(j.indexOf("R") > -1){
							alg = 'right';
						}else{
							alg = 'center';
						}
						
						
						$('<td />', {
							style :" text-align : "+alg
				            }).html(checkNull(datas[j])).appendTo($tr);	
					}
				}
			}
		}
		
		//자료가 없을 경우
		
		if(listLen == 0){
			
		}else if(listLen - headCnt == 0){
			var $tr = $('<tr />').appendTo('#'+tId+'Data tbody');
			$('<td colspan='+Object.keys(list[0]).length+'/>', {
				style :" text-align : center"
	            }).text(decodeURI("%EC%9E%90%EB%A3%8C%EA%B0%80%20%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4.")).appendTo($tr);
		}
		
		//병합
		try{ 
			//열병합
			if(opt.table.colMerge != undefined ){
				var cm = opt.table.colMerge;
				for(var i = 0 ; dlen = cm.length, i<dlen ; i ++){
					$('#'+tId+'Data').rowspan (cm[i]);//열병합	
				}
			} 
			//행병합
			if(opt.table.rowMerge != undefined ){
				var rm = opt.table.rowMerge;
				for(var i = 0 ; dlen = rm.length,  i<dlen ; i ++){
					$('#'+tId+'Data').colspan (rm[i]);//행병합	
				}
			}else{
				$('#'+tId+'Data').colspan (0);//행병합
			} 
		}catch(e){
			//console.log(e);			
		}
		
		try{
    		
    		if(typeof(eval(opt.table.renderTo+"Success")) == 'function') eval(opt.table.renderTo+"Success")();	
    	}catch(e){
    		//console.log(opt.table.renderTo+"Success");
    		//console.log(e);
    	}

		
		
		
		/*$('#'+tId+'Data').rowspan(0);//열병합
		$('#'+tId+'Data').rowspan(1);
		$('#'+tId+'Data').rowspan(2);
		$('#'+tId+'Data').rowspan(4);
		$('#'+tId+'Data').rowspan(7);
		$('#'+tId+'Data').colspan (0);//행병합
		$('#'+tId+'Data').colspan (1);//행병합
		*/		
	}
	
	
	
	
	
	//null 대체
	function checkNull(data){
		var chr = '-';
		if(data == null || data == ""){
			return chr;
		}else{
			return data;
		}
	}
	
	/* 
	 * 
	 * 같은 값이 있는 열을 병합함
	 * 
	 * 사용법 : $('#테이블 ID').rowspan (0);
	 * 
	 */  
	$.fn.rowspan = function(colIdx, isStats) {       
	    return this.each(function(){      
	        var that;     
	        $('tr', this).each(function(row) {      
	            $('th:eq('+colIdx+')', this).filter(':visible').each(function(col) {
	                 
	                if ($(this).html() == $(that).html()
	                    && (!isStats 
	                            || isStats && $(this).prev().html() == $(that).prev().html()
	                            )
	                    ) {            
	                    rowspan = $(that).attr("rowspan") || 1;
	                    rowspan = Number(rowspan)+1;
	 
	                    $(that).attr("rowspan",rowspan);
	                     
	                    // do your action for the colspan cell here            
	                    $(this).hide();
	                     
	                    //$(this).remove(); 
	                    // do your action for the old cell here
	                     
	                } else {            
	                    that = this;         
	                }          
	                 
	                // set the that if not already set
	                that = (that == null) ? this : that;      
	            });     
	        }); 
	        /*var that;
	        $('tr', this).each(function(row) {      
	            $('td:eq('+colIdx+')', this).filter(':visible').each(function(col) {
	                 
	                if ($(this).html() == $(that).html()
	                    && (!isStats 
	                            || isStats && $(this).prev().html() == $(that).prev().html()
	                            )
	                    ) {            
	                    rowspan = $(that).attr("rowspan") || 1;
	                    rowspan = Number(rowspan)+1;
	 
	                    $(that).attr("rowspan",rowspan);
	                     
	                    // do your action for the colspan cell here            
	                    $(this).hide();
	                     
	                    //$(this).remove(); 
	                    // do your action for the old cell here
	                     
	                } else {            
	                    that = this;         
	                }          
	                 
	                // set the that if not already set
	                that = (that == null) ? this : that;      
	            });     
	        }); */
	    });  
	}; 
	 
	 
	/* 
	 * 
	 * 같은 값이 있는 행을 병합함
	 * 
	 * 사용법 : $('#테이블 ID').colspan (0);
	 * 
	 */  
	$.fn.colspan = function(rowIdx) {
	    return this.each(function(){
	         
	        var that;
	        $('tr', this).filter(":eq("+rowIdx+")").each(function(row) {
	            $(this).find('th').filter(':visible').each(function(col) {
	                if ($(this).html() == $(that).html()) {
	                    colspan = $(that).attr("colSpan") || 1;
	                    colspan = Number(colspan)+1;
	                     
	                    $(that).attr("colSpan",colspan);
	                    $(this).hide(); // .remove();
	                } else {
	                    that = this;
	                }
	                 
	                // set the that if not already set
	                that = (that == null) ? this : that;
	                 
	            });
	        });
	        var that;
	        $('tr', this).filter(":eq("+rowIdx+")").each(function(row) {
	            $(this).find('td').filter(':visible').each(function(col) {
	                if ($(this).html() == $(that).html()) {
	                    colspan = $(that).attr("colSpan") || 1;
	                    colspan = Number(colspan)+1;
	                     
	                    $(that).attr("colSpan",colspan);
	                    $(this).hide(); // .remove();
	                } else {
	                    that = this;
	                }
	                 
	                // set the that if not already set
	                that = (that == null) ? this : that;
	                 
	            });
	        });
	    });
	};
	
	//차트 확대보기 팝업
	function chartPop(ht,gu){
		var tit = ht.innerHTML;
		var url = '/mt/chartPop?gu='+gu+"&tit="+encodeURI(tit); 
		window.open( url, "sss", s='top=0,left=0,width=800,height=600,resizable=1,scrollbars=1,status=0,toolbar=0,location=0');
	}
	//사용안함 아래꺼로 대체
	/*function goNexacroPage(pThis){
		var viewUrl = $(location).attr('pathname');
		viewUrl = viewUrl.substring((viewUrl.lastIndexOf("/")+1));
		var nexUrl = $(pThis).attr("href");
		window.parent["_callerForm"+viewUrl].goPageUrl(nexUrl);
	}*/
	
	function goNexacroPage( nexUrl){
		var viewUrl = $(location).attr('pathname');
		
		viewUrl = viewUrl.substring((viewUrl.lastIndexOf("/")+1));
		if(viewUrl == "monitor09_2" || viewUrl =="monitor09_3"){
			viewUrl = "monitor09_1";
		}
		if(viewUrl == "dashboardGate.jsp"){
			viewUrl = "wt_monitor01";
		}
		window.parent["_callerForm"+viewUrl].fn_pageLink(nexUrl);
		return false;
	}
	
	//넥사크로 페이지 이동
	$(function(){
		$(".footer > ul > li a").click(function(){
			var viewUrl = $(location).attr('pathname');
			
			viewUrl = viewUrl.substring((viewUrl.lastIndexOf("/")+1));
			if(viewUrl == "monitor09_2" || viewUrl =="monitor09_3"){
				viewUrl = "monitor09_1";
			}
			if(viewUrl == "dashboardGate.jsp"){
				viewUrl = "wt_monitor01";
			}
			var nexUrl = $(this).attr("href");
			
			var target = $(this).attr("target");
			
			if(target =="_blank") return true;
			
			window.parent["_callerForm"+viewUrl].fn_pageLink(nexUrl);
			return false;
		});
	});