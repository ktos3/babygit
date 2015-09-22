var rdfmgr = new RDFmgr("LOD_Browser");
//LODBrowner用 onload セレクト文--------------------------------------------DOM操作練習用
function queryRead2() {
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE {?class a rdfs:Class. filter (regex(str(?class), 'lodcu')) }",
		inference:true,
		remakeJson: false,
		success: function (json){
			while(json.next()){
				for(var i=0;i<json.getLength();i++){
					console.log(json.getValue(i));
					str = json.getValue(i);
					str=str.replace("lodcu:","");
					console.log(str);
					str2 = '<div id=test>'+ str +'</div>'
					$('#qsel5').append($("<option></option>").val(str2).html(str2));
//					$('.test').live("click",function(){
//						showQueryResult();
//					});
//					$("#qsel5").append($("<option></option>").val(json.getValue(i).replace('lodcu:','')).html(json.getValue(i).replace('lodcu:','')));
				}
			}
		}
	});
}
function showQueryResult() {
	console.log("showQueryResult開始");
}