//fullmap4用
var latlng;
var mapObj;
var marker;
var gTrackMarkerList = new google.maps.MVCArray();//-------------------------------マーカー削除用
var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
//var gMarkerClusterer = new MarkerClusterer(mapObj);//----------------------------大量のデータを取り扱うときに便利だよ用
var gMarkerCenter;
var infoWindow;
var currentInfoWindow = null;
var first = true;
var mapObj = null;
var pingnum;
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
//	console.log("queryRead2スタート");
	markerBounds = new google.maps.LatLngBounds();
	clearMsglist();
	var id = 0;
	var namejson = new String('[');
	getstatus();

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
        onCheck:showQueryResult2,
        onUncheck:unCheck,
    });
}

function unCheck(index,data){
//	console.log("unCheck()スタート");
	$('select#qsel3 option').remove();
	gMarkerClusterer.clearMarkers();
	markers.length=0;
	check 	=	$('#dg').datagrid("getChecked");//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
	console.log(check);
	num	=	$('#dg').datagrid("getChecked").length;
	console.log(num);
	for(var i=0;i<num;i++){
//		console.log(check[i].classname);
		showQueryResult(check[i].classname);
	}
}

function one_for_all_all_for_one(check){//表示形式が変更されたとき一度リセットしたほうがいいですよね
//	console.log("one_for_all_all_for_one()スタート");
	clearMsglist();
	$("#gmap").empty();
	$('#dg').datagrid({singleSelect:(check.value==0)});
	gMarkerClusterer.clearMarkers();
	markers.length=0;
	$('select#qsel3 option').remove();
}

function showQueryResult(title) {//使う、チェックボックス外された時用
	console.log("showQueryResult()スタート");

//	$('select#qsel3 option').remove();
	console.log(title);
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

function showQueryResult2(index,data) {
//	console.log("showQueryResult2()スタート");

	pingnum="ping/dot"+index+".png";
	console.log(pingnum);
	check 	=	$('#dg').datagrid("options").singleSelect;//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用
	title = data.classname;
	console.log(title);
	if(check==true){//ひとつ選択　前のを消す
		$('select#qsel3 option').remove();
		if(mapObj!=null){
			markerBounds = new google.maps.LatLngBounds();
			gMarkerClusterer.clearMarkers();
			markers.length=0;
		}else{

			console.log(check);
		}
	}else{
		console.log(check);

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
//	console.log("json_analyzeスタート");

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
		for(var i in obj){//ここでひとつひとつオブジェクトを生成する
//			console.log(i);
//			console.log(obj[i]);
//			console.log(obj[i]["名前"]);
			placeMarker(obj[i],i);
		}
		mapObj.fitBounds(markerBounds);
		gMarkerClusterer.addMarkers(markers); // マーカーの表示
	}else{
		$("div#gmap div").remove();
		document.getElementById("gmap").innerHTML = maketable(true,obj,null);
//		console.log(maketable(true,obj,null));
	}
}
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
		gMarkerClusterer = new MarkerClusterer(mapObj);//----------------------------大量のデータを取り扱うときに便利だよ用
		gMarkerCenter = drawMarkerCenterInit(mapObj,latlng);
		// リスナーを追加：中心移動時にセンターマーカーを再描画(位置とタイトル)
		google.maps.event.addListener(mapObj, 'center_changed', function(){
			var pos = mapObj.getCenter();
			gMarkerCenter.setPosition(pos);
			gMarkerCenter.setTitle('map center: ' + pos);
		});
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
	gTrackMarkerList.push(markers);
	createMarkerButton(marker);
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
		str += "</table><br><a data-toggle='modal' href='#' onclick='edittable(&quot;"+ num +"&quot;)' class='btn btn-small'>編集</a>";

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
//テーブル表示準備
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
