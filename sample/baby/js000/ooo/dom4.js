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
					str2 = '<div id='+ str +'>'+ str +'</div>'
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
function showQueryResult(obj) {
	index = obj.selectedIndex; //選択された項目番号を取得する
	value=obj.options[obj.selectedIndex].value; //選択された項目の値を取得する
	title = obj.options[obj.selectedIndex].text; //選択された項目のタイトルテキストを取得
	console.log(index);
	console.log(value);
	console.log(title);
}