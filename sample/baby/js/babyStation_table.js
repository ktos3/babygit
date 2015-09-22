// list_table.js
//
// 	RDFのデータをCSVで表示するためには
// 	 1.先ず列（property）のリストを得る
// 	 2.各列ごとにproperty valueを得る

function sendSPARQL_toGetPropertyValues( vvv){  // 各property毎に列値を得るSPARQLを実行するルーチン
	var s1 = " select ?s ";
	var s2 = "";
	var i1=1;
	for(var v1 in vvv.props) {
		s1 +=" ?o"+i1;
		s2 += " optional { ?s "+vvv.props[v1] +" ?o"+i1+" .}";
		i1++;
	}
	s1 += " where {"+s2+"}";

	var stext=s1;
	console.log("sparql= "+stext);//どのようなSPARQLを送ったかを見るにはこのコンソール出力を参照すること

	vvv.rdfmgr.executeSparql({
		sparql: stext,
		inference: false,
		async: false,
		success: function(re) {//SparqlEPCUから受け取ったJSONデータをイテレータを使用して取り出す
				var str = "";

				while(re.next()){//各レコードごとの処理
					var s1 = "";
					for(var i=0; i < re.getLength();i++){
						st1= re.getValue(i);
						if(st1== undefined) {
							st1="";
						}
						s1 +="<td>"+st1+"</td>";
					}
					vvv.callback( s1);

					console.log("rrr "+re.getValue(0)+
							" "+re.getValue(1)+
							" "+re.getValue(2)+
							" "+re.getValue(3)+
							" "+re.getValue(4)+
							" "+re.getValue(5)+
							" ");
				}
				if(typeof vvv.all_completed == "function"  ) {
					vvv.all_completed();	//全レコードを処理したらall_completedを呼ぶ
				}
			},

		error: function ( eType, eMsg, eInfo) {  //getErrorMsg
			alert("send_toGet_ClassList"+eMsg+"\n\n"+eInfo);
		}
	});
}

function sendSPARQL_toGetPropertyList(vvv){

	var stext="select distinct ?p where {?s rdf:type ?c . ?s ?p ?o2 .} LIMIT 900";

	vvv.rdfmgr.executeSparql({
		sparql: stext,
		inference: false,
		async: false,
		success: function (re ) {//maketable3,

			while(re.next()){
				//str = "<tr><td>"+ii11+"</td>";
				for(var i=0; i < re.getLength();i++){
					//str += "<td>"+re.getValue(i)+"</td>";
				}
				if(vvv.callback) {
					vvv.callback(re.getValue(0), stext );
				}
				/*
				str +="</tr>";
				$("#disp").append(str);
				ii11++;*/
			}
			if(typeof vvv.all_completed == "function"  ) {
				vvv.all_completed();//全部処理したらallcompletedを呼ぶ
			}
		},
		error: function ( eType, eMsg, eInfo) {
			alert("sendSPARQL_toGetPropertyList"+eMsg+"\n\n"+eInfo);
		}

	});
}

var arrProps=[];

$(function(){
	//インスタンスの宣言
	var projectid="babyStation";

	var rdfmgr = new RDFmgr( projectid);//rdfserver_project);

	$("#projid").html( projectid);

	sendSPARQL_toGetPropertyList({
		rdfmgr: rdfmgr,
		callback:	function (prop, usedSPARQL) {//callbackで各カテゴリー毎に表示する機能を指定する
			$("#disp_props").append("<td>"+prop+"</td>");
			//$("#disp2").html(usedSPARQL);
			arrProps.push(prop);//受け取ったRDFのpropertyを配列arrPropsに格納する
		},
		all_completed: function () { // 全部処理が終わったら次の処理のproc22を呼び出す（非同期処理を順にこなしていくため）
			all_done();
		}
	});

	function all_done() {
		sendSPARQL_toGetPropertyValues({   // 各property毎に列値を得るSPARQLの処理を呼び出す
			rdfmgr: rdfmgr,
			props: arrProps,  // RDF property Listを基にインスタンス情報をSPARQL検索する
			callback:	function ( val) {//callbackで各カテゴリー毎に表示する機能を指定する

				$("#disp").append("<tr>"+val+"</tr>");
			}
		});
	}

});

//----------------------------------------------------------------------
