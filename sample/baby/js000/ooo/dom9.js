//fullmap4用
var latlng;
var mapObj;
var marker;
var gTrackMarkerList = new google.maps.MVCArray();//-------------------------------マーカー削除用
var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
var gMarkerClusterer;// = new MarkerClusterer();//----------------------------大量のデータを取り扱うときに便利だよ用
var gMarkerCenter;
var infoWindow;
var currentInfoWindow = null;
var first = true;
var mapObj = null;
var pingnum;
var datacheck;
var tbobj;
var pingindex=new Array;
var projectName = getParameter("project");
var setting_lat = getParameter("lat");
var setting_long = getParameter("long");
var setting_name = getParameter("name");
var markers = [];

if(projectName == ""){
	projectName = "web_api";
}
if(setting_lat == ""){
	setting_lat = "緯度";
}
if(setting_long == ""){
	setting_long = "経度";
}
if(setting_name == ""){
	setting_name = "名前";
}
var rdfmgr = new RDFmgr(projectName);
	google.maps.event.addDomListener(window, 'load', function()
		{
			//ページか読みこまれた時点で地図を表示したいときはここでマップオブジェを作成するとよい
//		queryRead2();
		});

	function drawMarkerCenterInit(myMap,pos){//---------------------顔面センター
		var markerCenter = new google.maps.Marker({
			position: pos,
			map: myMap,
			title: 'map center:' + pos, // アイコンのタイトル (中心の経緯度を設定)
			icon: new google.maps.MarkerImage(
												'ping/center.gif'// アイコン画像を指定
			//									new google.maps.Size(32.0,32.0),
			//									new google.maps.Point(0,0)  // origin
			),
			//shadow: '', // 影のアイコン画像
			draggable: false // ドラッグ可能にする
		});
		return markerCenter;
	}


function deleteMarker(){//--------------------------------------マーカーの削除
	gTrackMarkerList.forEach(function(marker,i){
		marker.setMap(null);
	});
}

//プロジェクトネームその他取得
function setConf(){
	$("#setting_id").val(projectName);
	$("#setting_name").val(setting_name);
	$("#setting_lat").val(setting_lat);
	$("#setting_long").val(setting_long);
	console.log(projectName);
}

//LODBrowser用 onload セレクト文--------------------------------------------使ってない
function queryRead() {
	setConf();
	console.log(projectName);
	$('#query33').val("SELECT * WHERE {?class a rdfs:Class. filter (regex(str(?class), 'lodcu')) }");//検索式を設定する

	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE {?class a rdfs:Class. filter (regex(str(?class), 'lodcu')) }",
		inference:true,
		remakeJson: false,
		success: function (json){
			while(json.next()){
				for(var i=0;i<json.getLength();i++){
					$("#qsel5").append($("<option></option>").val(json.getValue(i).replace('lodcu:','')).html(json.getValue(i).replace('lodcu:','')));
				}
			}
		}
	});
}
//LODBrowner用 onload セレクト文--------------------------------------------DOM操作練習用
function queryRead2() {
	console.log("queryRead2スタート");
	markerBounds = new google.maps.LatLngBounds();
	clearMsglist();
	$("#edittable").empty();
	var id = 0;
	var namejson = new String('[');
	getstatus();
	$('#tt').tabs({
	    border:false,
	    onSelect:function(title){
	        console.log(title+' is selected');
	    }
	});
	if(mapObj!=null){
	gMarkerClusterer.clearMarkers();
	markers.length=0;
	};
	$('select#qsel3 option').remove();
	$('#query33').val("SELECT * WHERE {?class a rdfs:Class. filter (regex(str(?class), 'lodcu')) }");//検索式を設定する
	rdfmgr = new RDFmgr(projectName);
//	console.log(projectName);
	$('select#qsel5 option').remove();
	$('select#qsel3 option').remove();
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE {?class a rdfs:Class. filter (regex(str(?class), 'lodcu')) }",
		inference:true,
		remakeJson: false,
		success: function (json){
			while(json.next()){
				var num = json.getValueListLength();
				for(var i=0;i<json.getLength();i++){
					id=id+1;
					str = json.getValue(i);
					str=str.replace("lodcu:","");
					if(id==num){//                                  ここでcheckboxに表示するためのJSONデータ（文字列を生成）
						namejson += '{"classname":"'+str+'"}]';
//						console.log(namejson);
						showClassNameTable(namejson);
					}else{
						namejson += '{"classname":"'+str+'"},'
//						console.log(namejson);
					}

//					console.log(str);
					str2 = '<div id='+ str +'>'+ str +'</div>'
					$('#qsel5').append($("<option></option>").val(str2).html(str2));
				}
			}
		}

	});
}

function showClassNameTable(name){//左カラム用クラス表示関数  jQueryeasyUIのcheckboxはJSON形式のデータを渡す必要があるめんど
//	console.log("showClassTable()スタート");
	var obj = JSON.parse(name);
	$('#dg').datagrid({
        data: obj,
        onCheck:showQueryResult2,//チェックされたとき
        onUncheck:unCheck3,//チェックが外されたとき
        onUncheckAll:unCheckAll,
        onCheckAll:onCheckAll,

    });
}

function unCheck(index,data){
//	console.log("unCheck()スタート");
	$('select#qsel3 option').remove();
	if(datacheck==true){
		gMarkerClusterer.clearMarkers();
		markers.length=0;
	}

	check 	=	$('#dg').datagrid("getChecked");//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
	console.log(check);
	deleteMarker();
	num	=	$('#dg').datagrid("getChecked").length;//for文を回すための数値
	console.log(num);

	pingnum="ping/dot"+index+".png";//表示するピンの色指定
	console.log(pingnum);
//	$('select#qsel3 option').remove();
//	console.log(title);
//	gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
//	markers.length=0;
	$('#query33').val("SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x");//検索式を設定する
	for(var i=0;i<num;i++){
		rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
			sparql: "SELECT * WHERE{?x rdf:type lodcu:" + check[i].classname +".?x ?pro ?z.}order by ?x",
			inference:false,
			remakeJson: false,
			success: json_analyze
		});

	}
}

function unCheck2(index,data){
	$('select#qsel3 option').remove();
	console.log("unCheck()スタート");
	var check 	=	$('#dg').datagrid("getChecked");//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
//	console.log(check[0].classname);
	deleteMarker();
	var num	=	$('#dg').datagrid("getChecked").length;//for文を回すための数値
//	console.log(num);
	var opts = $('#dg').datagrid('getColumnFields');	// get unfrozen columns
//	console.log(opts);
	var rows = $('#dg').datagrid('getRows');
	var rowsnum	=rows.length;
//	console.log(rows[0].classname);
	var j;
//	console.log(rowsnum);

	for(var i=0;i<num;i++){//checkされてる分

		while(j<rowsnum){//クラス数分

		if(check[i].classname==rows[j].classname){
//			console.log(j);
//			showQueryResult(j,rows[j].classname);
			pingnum="ping/dot"+j+".png";//表示するピンの色指定
			console.log(pingnum);
			$('#query33').val("SELECT * WHERE{?x rdf:type lodcu:" + check[i].classname +".?x ?pro ?z.}order by ?x");//検索式を設定する
			rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
				sparql: "SELECT * WHERE{?x rdf:type lodcu:" + check[i].classname +".?x ?pro ?z.}order by ?x",
				inference:false,
				remakeJson: false,
				success: json_analyze,
				error:function(eType, eMsg, eInfo){
					alert(eType+"<br>"+eMsg+"<br>"+eInfo);
				}
			});
			console.log("test");
		}
		j=j+1;
		}
	}

}

function unCheck3(index,data){
	$('select#qsel3 option').remove();
	console.log("unCheck()スタート");
	var check 	=	$('#dg').datagrid("getChecked");//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
//	console.log(check[0].classname);
	deleteMarker();
	var num	=	$('#dg').datagrid("getChecked").length;//for文を回すための数値
//	console.log(num);
	var opts = $('#dg').datagrid('getColumnFields');	// get unfrozen columns
//	console.log(opts);
	var rows = $('#dg').datagrid('getRows');
	var rowsnum	=rows.length;
//	console.log(rows[0].classname);
	var j;
//	console.log(rowsnum);

	for(var i=0;i<num;i++){//checkされてる分

		for(var j=0;j<rowsnum;j++){//クラス数分

		if(check[i].classname==rows[j].classname){
//			console.log(j);
//			showQueryResult(j,rows[j].classname);

			pingnum="ping/dot"+j+".png";//表示するピンの色指定
			console.log(pingnum);
			$('#query33').val("SELECT * WHERE{?x rdf:type lodcu:" + check[i].classname +".?x ?pro ?z.}order by ?x");//検索式を設定する
			rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
				sparql: "SELECT * WHERE{?x rdf:type lodcu:" + check[i].classname +".?x ?pro ?z.}order by ?x",
				inference:false,
				remakeJson: false,
				success: json_analyze,
				error:function(eType, eMsg, eInfo){
					alert(eType+"<br>"+eMsg+"<br>"+eInfo);
				}
			});
			console.log("test");
		}
		}
	}

}

function unChecktest(index,data){
	$('select#qsel3 option').remove();
	console.log("unCheck()スタート");
	var check 	=	$('#dg').datagrid("getChecked");//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
//	console.log(check[0].classname);
	deleteMarker();
	var num	=	$('#dg').datagrid("getChecked").length;//for文を回すための数値
//	console.log(num);
	var opts = $('#dg').datagrid('getColumnFields');	// get unfrozen columns
//	console.log(opts);
	var rows = $('#dg').datagrid('getRows');
	var rowsnum	=rows.length;
//	console.log(rows[0].classname);

//	console.log(rowsnum);
	var title;
	for(var i=0;i<num;i++){//checkされてる分

		for(var j=0;j<rowsnum;j++){//クラス数分

		if(check[i].classname==rows[j].classname){
//			console.log(j);
//			showQueryResult(j,rows[j].classname);
			pingnum="ping/dot"+j+".png";//表示するピンの色指定
			console.log(pingnum);
//			title = eval(check[i].classname);
			title=check[i].classname;
			eval(j);
			console.log(title);
			pingindex[title]=j;
			console.log("pingindexに代入");

			}
		}
	}
	console.log(pingindex);
}

function onCheckAll(rows){
	console.log(rows);
	deleteMarker();
	$('select#qsel3 option').remove();
	alert("チェックオールの動作には対応しておりません。地図を初期化します。わかったか仙北谷");
	$('#dg').datagrid("clearChecked");
}

function unCheckAll(rows){
	console.log(rows);
	$('select#qsel3 option').remove();
	deleteMarker();
	clearMsglist();
	prepareShowTable();

}

function one_for_all_all_for_one(check){//表示形式が変更されたとき一度リセットしたほうがいいですよね
//	console.log("one_for_all_all_for_one()スタート");
	markerBounds = new google.maps.LatLngBounds();
	deleteMarker();
	clearMsglist();
	$("#gmap").empty();
	$('#dg').datagrid({singleSelect:(check.value==0)});
	var check2 	=	$('#dg').datagrid("options").singleSelect;//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
	if(mapObj!=null){
		gMarkerClusterer.clearMarkers();
		markers.length=0;
	}

	$('select#qsel3 option').remove();

}

function showQueryResult(num,title) {//使う、チェックボックス外された時用
	console.log("showQueryResult()スタート");
	console.log(num);
	console.log(title);

	pingnum="ping/dot"+num+".png";//表示するピンの色指定
	console.log(pingnum);
//	$('select#qsel3 option').remove();
//	gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
//	markers.length=0;
	$('#query33').val("SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x");//検索式を設定する
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x",
		inference:false,
		remakeJson: false,
		success: json_analyze,
	});
}

function showQueryResult2(index,data) {
	console.log("showQueryResult2()スタート");
	pingindex=index;
	pingnum="ping/dot"+index+".png";//表示するピンの色指定
	console.log(pingnum);
	check 	=	$('#dg').datagrid("options").singleSelect;//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
	title = data.classname;
	console.log(title);
	console.log(check);

	if(check==true){//ひとつ選択　前のを消す
		$('select#qsel3 option').remove();
		if(markers!=null){
			console.log("ここいってるやろー");
			datacheck=check;
			console.log(check);

		}else{

		}
	}else{
		datacheck=check;
		console.log(datacheck);
	}

/*	if(mapObj!=null){
		gMarkerClusterer.clearMarkers();
		markers.length=0;
	}*/
//	$('select#qsel3 option').remove();
//	gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
//	markers.length=0;

	$('#query33').val("SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x");//検索式を設定する

	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x",
		inference:false,
		remakeJson: false,
		success: json_analyze
	});
}

function json_analyze(json){
	console.log("json_analyzeスタート");


	datacheck 	=	$('#dg').datagrid("options").singleSelect;
	console.log(datacheck);
	$("#edittable").empty();
	obj = new Object();
	var nomap = null;

	while(json.next()){
		if(typeof obj[json.getValue("x")] === "undefined"){	obj[json.getValue("x")] = {};}//オブジェクト初期化

		if(json.getValue("pro")=="lodcu:"+setting_lat||json.getValue("pro")=="lodcu:"+setting_long){	//緯度もしくは経度の時はnomapフラグ解除
			nomap = false;
		}
		if(json.getValue("pro")!="rdf:type"){
			obj[json.getValue("x")][json.getValue("pro").replace('lodcu:','')] = json.getValue("z");
		}
	}
	if(nomap == false){
//		console.log("Original:");
//		console.log(obj);
		if(mapObj==null){
			var lng = 137.013574;
			var lat = 35.275825;
			latlng = new google.maps.LatLng(lat,lng);
			var mapOptions = {
				zoom: 4,
				center: new google.maps.LatLng(lat, lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
				draggable:true,
				scrollwheel:true
			};
			mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);
			gMarkerClusterer = new MarkerClusterer(mapObj);//----------------------------大量のデータを取り扱うときに便利だよ用

		}
		if(markers!=null){
//			markerBounds = new google.maps.LatLngBounds();
			gMarkerClusterer.clearMarkers();
			markers.length=0;
		}
		for(var i in obj){//ここでひとつひとつオブジェクトを生成する
//			console.log(i);
//			console.log(obj[i]);
//			console.log(obj[i]["名前"]);
//			console.log(datacheck);
			if(datacheck==false){//markerclusterer使わない
//				console.log("placeMarker2");
				placeMarker2(obj[i],i);
			}else{

				placeMarker(obj[i],i);
			}
		}
		if(datacheck!=false){
		mapObj.fitBounds(markerBounds);
		gMarkerClusterer.addMarkers(markers); // マーカーの表示
		}else{
			mapObj.fitBounds(markerBounds);
		}
	}else{
		$("div#gmap div").remove();
		document.getElementById("gmap").innerHTML = maketable(true,obj,null);
//		console.log(maketable(true,obj,null));
	}
}
/*
 * マーカークラスター使うマン
 */
function placeMarker(obj,num){
//	console.log("placeMarker()スタート");

//最初からマップを表示したくないときはここでmapオブジェクトをつくるといい
//	console.log(obj);
/*
	for (keys in obj){
		console.log(keys);
		console.log(obj[keys]);
	}
*/
//	$('#qsel3').append($("<option></option>").val(obj[setting_name]).html(obj[setting_name]));
	if(mapObj==null){
		var lng = 137.013574;
		var lat = 35.275825;
		latlng = new google.maps.LatLng(lat,lng);
		var mapOptions = {
			zoom: 4,
			center: new google.maps.LatLng(lat, lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scaleControl: true,
			draggable:true,
			scrollwheel:true
		};
		mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);
		var mcOptions = {gridSize: 10, maxZoom:15};
		gMarkerClusterer = new MarkerClusterer(mapObj,[],mcOptions);//----------------------------大量のデータを取り扱うときに便利だよ用

	}


	var name = obj[setting_name];
	var location = new google.maps.LatLng( obj[setting_lat], obj[setting_long]);
	markerBounds.extend(location);//---------------------------------表示領域のための関数fitBounds()用
	var table = maketable(false,obj,num);
	var infowindow = new google.maps.InfoWindow({
		disableAutoPan:false,
		content :table + "<br>",
		position : location
	});


	var image=new google.maps.MarkerImage(
			  pingnum,                     //画像のURL
			  new google.maps.Size(48.0,64.0),  //画像のサイズ
			  new google.maps.Point(0,0),       //画像のposition
			  new google.maps.Point(0,64.0)     //画像のアンカーの位置
			);
		var shadow=new google.maps.MarkerImage(
				"ping/shadow.png",                     //影の画像のURL
				new google.maps.Size(81.0,64.0),  //影の画像のサイズ
				new google.maps.Point(0,0),       //影の画像のposition
				new google.maps.Point(0,64.0)     //影の画像のアンカーの位置
			);
//	console.log(table);
	var marker = new google.maps.Marker({
		position:location,
		map:mapObj,
		title:name,
		icon:image,
		shadow:shadow
//		animation:google.maps.Animation.DROP
	});

	google.maps.event.addListener(marker, 'click', function(){
		if(currentInfoWindow){currentInfoWindow.close();}
		if(first == true){mapObj.setZoom(14);}
		infowindow.open(mapObj, marker);
		currentInfoWindow = infowindow;
		first = false;
    });

	google.maps.event.addListener(mapObj,'click',function(){
		infowindow.close();
	})

	google.maps.event.addListener(mapObj,'rightclick',function(event){
		document.getElementById("show_lat").innerHTML = event.latLng.lat();
		document.getElementById("show_lng").innerHTML = event.latLng.lng();
	})

	markers.push(marker);
	gTrackMarkerList.push(marker);
	createMarkerButton(marker);
	tbobj = obj;
};

function placeMarker2(obj,num){//マーカークラスター使わないver

//	console.log("placeMarker()スタート");

//最初からマップを表示したくないときはここでmapオブジェクトをつくるといい
//	console.log(obj);
/*
	for (keys in obj){
		console.log(keys);
		console.log(obj[keys]);
	}
*/
//	$('#qsel3').append($("<option></option>").val(obj[setting_name]).html(obj[setting_name]));
	if(mapObj==null){
		var lng = 137.013574;
		var lat = 35.275825;
		latlng = new google.maps.LatLng(lat,lng);
		var mapOptions = {
			zoom: 4,
			center: new google.maps.LatLng(lat, lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scaleControl: true,
			draggable:true,
			scrollwheel:true
		};
		mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);
//		gMarkerClusterer = new MarkerClusterer(mapObj);//----------------------------大量のデータを取り扱うときに便利だよ用

	}
	var name = obj[setting_name];
	var location = new google.maps.LatLng( obj[setting_lat], obj[setting_long]);
	markerBounds.extend(location);//---------------------------------表示領域のための関数fitBounds()用
	var table = maketable(false,obj,num);
	var infowindow = new google.maps.InfoWindow({
		disableAutoPan:false,
		content :table + "<br>",
		position : location
	});


	var image=new google.maps.MarkerImage(
			  pingnum,                     //画像のURL
			  new google.maps.Size(48.0,64.0),  //画像のサイズ
			  new google.maps.Point(0,0),       //画像のposition
			  new google.maps.Point(0,64.0)     //画像のアンカーの位置
			);
		var shadow=new google.maps.MarkerImage(
				"ping/shadow.png",                     //影の画像のURL
				new google.maps.Size(81.0,64.0),  //影の画像のサイズ
				new google.maps.Point(0,0),       //影の画像のposition
				new google.maps.Point(0,64.0)     //影の画像のアンカーの位置
			);
//	console.log(table);
	var marker = new google.maps.Marker({
		position:location,
		map:mapObj,
		title:name,
		icon:image,
		shadow:shadow
//		animation:google.maps.Animation.DROP
	});

	google.maps.event.addListener(marker, 'click', function(){
		if(currentInfoWindow){currentInfoWindow.close();}
		if(first == true){mapObj.setZoom(14);}
		infowindow.open(mapObj, marker);
		currentInfoWindow = infowindow;
		first = false;
    });

	google.maps.event.addListener(mapObj,'click',function(){
		infowindow.close();
	})

	google.maps.event.addListener(mapObj,'rightclick',function(event){
		document.getElementById("show_lat").innerHTML = event.latLng.lat();
		document.getElementById("show_lng").innerHTML = event.latLng.lng();
	})
//	markers.push(marker);
//	gTrackMarkerList.push(markers);//なんだこれ
	gTrackMarkerList.push(marker);//----------------------------マーカーの後処理のための保持
	createMarkerButton(marker);//なんだこれ２
};


function maketable(nomap,obj,num){
//	console.log("maketable()スタート");

	if(nomap==false){
		var str = new String("<table id='popuptable' border='1'>");
		for(var i in obj){
			var data = obj[i];
			if(i.search("URL")!="-1"||i.search("画像")!="-1"){data = "<a href ='"+ obj[i] +"' target='_blank'>" + obj[i] + "</a>"}

			str += "<tr><td>"+ i +"</td><td>"+data+"</td></tr>";
		}
//		str += "</table><br><a data-toggle='modal' href='#' onclick='edittable(&quot;"+ num +"&quot;)' class='btn btn-small'>編集</a>";

		return str;

	}else if(nomap==true){//ここで表形式の魔法
		prepareShowTable();//追加、テーブル表示のための準備
		var str = new String("<table border='1' width='90%'><thead>");

		for(var i in obj){//最初の行
			for(var j in obj[i]){
				if(j.search("URL")!="-1"||j.search("画像")!="-1"){
					data = "<a href ='"+ obj[i] +"' target='_blank'>URL</a>"
				}
				if(j.search("アドレス")!="-1"||j.search("画像")!="-1"){
					data = "<a href ='"+ obj[i] +"' target='_blank'>URL</a>"
				}
				str += "<td>" + j + "</td>";
			}str += "</thead>";
			break;
			}

		for(var i in obj){ //obj個数をiに格納
			str += "<tr class='"+ i +"'>";
			for(var j in obj[i]){
				var data = obj[i][j];
				if(j==setting_name){
/*
					var objBody = document.getElementById("mk_list");
					var element = document.createElement("div");
					element.setAttribute("class", i);
					element.innerHTML = data;

					objBody.appendChild(element);
*/
				}
				str += "<td>" + data + "</td>";
				tbobj = obj;
			}
			str += "</tr>";
		}
			str +="</table>";
		return str;
	}
}
//右カラムにサイドバーを作成する
function createMarkerButton(marker) {
//	console.log("createMarkerButton()スタート");

	//サイドバーにマーカ一覧を作る
	var objBody = document.getElementById("qsel3");
	var element = document.createElement("option");
	var title = marker.getTitle();
	element.innerHTML = title;
	objBody.appendChild(element);

	//サイドバーマウスオーバーでマーカーを擬似クリック
	google.maps.event.addDomListener(element, "click", function(){
		element.innerHTML = title+"<br>";
		google.maps.event.trigger(marker, "click");
	});
}
//位置情報なし版テーブル表示準備
function prepareShowTable(){
//	console.log("prepareShowTable()スタート");

	$("#gmap").empty();
	mapObj=null;//地図初期化
	$('select#qsel3 option').remove();//右カラム削除
	var elem =  document.getElementById('gmap').style;//gmapによって書き換えられたstyleを表形式に対応させる↓
	elem.background="";
	elem.border="";
	elem.width="";
	elem.position="";
	elem.overflow="";//                                                                                ここまで
/*わかんね保留
	var right= $('#cc').layout('add',{
		collapsed:true
	});
*/
//	console.log(right);
}

//登録用モーダルテーブル作成
function addtable(){
	inputnum = 0;

	console.log(tbobj);
	var str = new String("<form name='addform'><table border='1' id='addformtable'>");
	for(var i in tbobj){
		var data ="";
		if(i == setting_lat){
			var data = $("#show_lat").text();
		}else if(i == setting_long){
			var data = $("#show_lng").text();
		}else if(i == "住所"){
			var data = $("#address").val();
		}
		console.log(data);
		str += "<tr><td id='add_prop" + inputnum + "'>"+ i +"</td><td>"+ "<input type='text' id='add" + inputnum + "' value='" + data + "'>" +"</td></tr>";
		inputnum++;
	}
	str += "</table></form><br>";
	str += "<a href='#' onclick='addtableinsert()'>プロパティ追加</a>";
	$("#addtable").empty();
	$("#addtable").append(str);
//	$('#addmodal').modal();
}

//住所登録モーダル表示
function runaddressmodal(){
	$("#address").empty();
	$('#addressmodal').modal();
}

//編集用モーダルテーブル作成
function edittable(num){

	objnum = num;
	inputnum = 0;
	console.log(obj);

	var str = new String("<form name='editform'><table border='1' id='editformtable'>");
	for(var i in obj[num]){
		var data = obj[num][i];
		str += "<tr><td id='edit_prop" + inputnum + "'>"+ i +"</td><td>"+ "<input type='text' id='edit" + inputnum + "' value='" + data + "'>" +"</td></tr>";
		inputnum++;
	}
	str += "</table></form><br>";
	str += "<a href='#' onclick='edittableinsert()'>プロパティ追加</a>";

	$("#edittable").empty();
	$("#edittable").append(str);
//	var tab = $('#tt').tabs('getSelected');
	/*
	$('#tt').tabs({
	    border:true,
	    onSelect:function(title){
	        console.log(title+' is selected');
	    }
	});
	*/
//	$('#editmodal').modal();
}

//プロパティ追加
function addtableinsert(){
	var selectform = "<select class='propsel' id='propselect_"+ inputnum +"'  onChange='propinsert(&quot;"+ inputnum +"&quot;,&quot;add&quot;)'></select>"
	$('#addformtable').append("<tr><td><input type='text' id='add_prop" + inputnum + "'>"+ selectform +"</td><td>"+ "<input type='text' id='add" + inputnum + "'>" +"</td></tr>");
	inputnum++;
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE {?x a rdf:Property. filter (regex(str(?x), 'lodcu'))}",
		inference:true,
		remakeJson: false,
		error: getErrorMsg,
		success: function (json){
			$(".propsel").empty();
			$(".propsel").append($("<option></option>").html("選択してください"));
			while(json.next()){
				for(var i=0;i<json.getLength();i++){
					$(".propsel").append($("<option></option>").val(json.getValue(i).replace('lodcu:','')).html(json.getValue(i).replace('lodcu:','')));
				}
			}
		}
	});
}

function edittableinsert(){
	var selectform = "<select class='propsel' id='propselect_"+ inputnum +"'  onChange='propinsert(&quot;"+ inputnum +"&quot;,&quot;edit&quot;)'></select>"
	$('#editformtable').append("<tr><td><input type='text' id='edit_prop" + inputnum + "'>"+ selectform +"</td><td>"+ "<input type='text' id='edit" + inputnum + "'>" +"</td></tr>");
	inputnum++;
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE {?x a rdf:Property. filter (regex(str(?x), 'lodcu'))}",
		inference:true,
		remakeJson: false,
		error: getErrorMsg,
		success: function (json){
			$(".propsel").empty();
			$(".propsel").append($("<option></option>").html("選択してください"));
			while(json.next()){
				for(var i=0;i<json.getLength();i++){
					$(".propsel").append($("<option></option>").val(json.getValue(i).replace('lodcu:','')).html(json.getValue(i).replace('lodcu:','')));
				}
			}
		}
	});
}

function propinsert(inputnum,addoredit){

	if(addoredit == "add"){
		$('#add_prop' + inputnum).val($('#propselect_' + inputnum).val());
	}else{
		$('#edit_prop' + inputnum).val($('#propselect_' + inputnum).val());
	}

}

//登録
function adddata(){

	var head = "";
	var data = "";

	for(var i=0;i<addformtable.rows.length;i++){
		propname = "#add_prop" + i;
		valname = "#add" + i;
		console.log(i + ":" + $(propname).val() );
		console.log(i + ":" + $(propname).text() );
		if($(propname).val() != ""){
			prop = $(propname).val();
		}else{
			prop = $(propname).text();
		}
		console.log(prop);
		objectdata = $(valname).val();
		if(objectdata == ""){
			objectdata += " ";
		}

		if(head == ""){
			head = prop;
		}else{
			head += "," + prop;
		}

		if(data == ""){
			data = objectdata;
		}else{
			data += "," + objectdata;
		}
	}
	head += ";";
	data += ";";

	csv = "@"+ className + "," + head + data;
	rdfmgr.insertInstance({
		rdfdata:csv,
		success: function (){
			alert("登録が完了しました");
			showQueryResult();
		}
	});
}

//編集
function editdata(){
	console.log(tbobj);
	for(var i=0;i<editformtable.rows.length;i++){
		propname = "#edit_prop" + i;
		valname = "#edit" + i;

		if($(propname).val() != ""){
			prop = $(propname).val();
		}else{
			prop = $(propname).text();
		}

		objectdata = $(valname).val();
		if(objectdata == ""){
			objectdata = " ";
		}

		console.log(tbobj[prop]);
		if(tbobj[prop] != objectdata){
			rdfmgr.updateInstance({
				subject: objnum,
				predicate: prop,
				object: objectdata
			});
		}
	}
	showQueryResult()
}


function getstatus(){
//	console.log("getstatus()スタート");

	projectName = $("#setting_id").val();
	setting_lat = $("#setting_lat").val();
	setting_long = $("#setting_long").val();
	setting_name = $("#setting_name").val();
/*
	console.log(projectName);
	console.log(setting_long);
	console.log(setting_lat);
	console.log(setting_name);
*/
}

function clearMsglist() {//データ表示部分を削除
//	console.log("clearMsglist()スタート");
	$("div#gmap div").remove();
	$("#edittable").empty();
//	$("div#map_canvas div").remove();
	mapObj = null;
	first = true;
}

function test(){
	console.log("test()スタート");
	$("#gmap").empty();
}

function getParameter(key) {
//	console.log("getParameter()スタート");

	var str = location.search.split("?");
	if (str.length < 2) {
		return "";
	}

	var params = str[1].split("&");
	for (var i = 0; i < params.length; i++) {
		var keyVal = params[i].split("=");
		if (keyVal[0] == key && keyVal.length == 2) {
			return decodeURIComponent(keyVal[1]);
		}
	}
	return "";
}


function getErrorMsg(eType,eMsg,eInfo){
	var str = "<font size='4' color='red'><b>エラー</b><br>"+eMsg+"</font>";
	$("#error").empty();
	$("#error").append(str);
}