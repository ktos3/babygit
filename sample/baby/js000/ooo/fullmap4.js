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

var projectName = getParameter("project");
var setting_lat = getParameter("lat");
var setting_long = getParameter("long");
var setting_name = getParameter("name");
var markers = [];
if(projectName == ""){
	projectName = "LOD_Browser";
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
/*
			console.log(projectName);
			console.log(setting_lat);
			console.log(setting_long);
			console.log(setting_name);
*/
//			queryRead2();
			/*
			// リスナーを追加：センターマーカー移動(ドラッグ完了)時に地図の中心を移動
			google.maps.event.addListener(gMarkerCenter, 'dragend', function(){
				mapObj.panTo(gMarkerCenter.position);
			});
*/
/*
			// リスナーを追加：センターマーカークリック時に情報ウィンドウを表示
			google.maps.event.addListener(gMarkerCenter, 'click', function(){
				var infoWindow = new google.maps.InfoWindow({
					content: 'map center: ' + mapObj.getCenter()
				})
				infoWindow.open(mapObj,gMarkerCenter);
			});
*/
		function deleteMarker(){//--------------------------------------マーカーの削除
			gTrackMarkerList.forEach(function(marker,i){
				marker.setMap(null);
			});
		}
		});

	function drawMarkerCenterInit(myMap,pos){//---------------------顔面センター
		var markerCenter = new google.maps.Marker({
			position: pos,
			map: myMap,
			title: 'map center:' + pos, // アイコンのタイトル (中心の経緯度を設定)
			icon: new google.maps.MarkerImage(
												'cg/center.gif'// アイコン画像を指定
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

//LODBrowser用 onload セレクト文--------------------------------------------使ってないが今後使うかもしれんぬ
function queryRead() {
	setConf();
	console.log(projectName);
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
	var id = 0;
	var namejson = new String('[');

	getstatus();
	gMarkerClusterer.clearMarkers();
	markers.length=0;
	$('select#qsel3 option').remove();
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
	var obj = JSON.parse(name);
	$('#dg').datagrid({
        data: obj,
        onCheck:showQueryResult2
    });
}

function one_for_all_all_for_one(){//表示形式が変更されたとき一度リセットしたほうがいいですよね
	$('#dg').datagrid({singleSelect:(this.value==0)})
	gMarkerClusterer.clearMarkers();
	markers.length=0;
	$('select#qsel3 option').remove();
}

function showQueryResult(obj) {
	$('select#qsel3 option').remove();
	index = obj.selectedIndex; //選択された項目番号を取得する
	value=obj.options[obj.selectedIndex].value; //選択された項目の値を取得する
	title = obj.options[obj.selectedIndex].text; //選択された項目のタイトルテキストを取得
//	console.log(index);
//	console.log(value);
//	console.log(title);
	gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
	markers.length=0;
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x",
		inference:false,
		remakeJson: false,
		success: json_analyze
	});

}

function showQueryResult2(index,data) {
	check 	=	$('#dg').datagrid("options").singleSelect;//trueならひとつ、falaseなら複数  if文でマーカーを保持するか消すかの二者択一に使用

	if(check==true){
		$('select#qsel3 option').remove();
		gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
		markers.length=0;
	}
//	$('select#qsel3 option').remove();
//	gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
//	markers.length=0;
	title = data.classname;
	console.log(title);
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: "SELECT * WHERE{?x rdf:type lodcu:" + title +".?x ?pro ?z.}order by ?x",
		inference:false,
		remakeJson: false,
		success: json_analyze
	});
}

function json_analyze(json){
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
		document.getElementById("gmap").innerHTML = maketable(true,obj,null);
	}
}
function placeMarker(obj,num){
//最初からマップを表示したくないときはここでmapオブジェクトをつくるといい
//	console.log(obj);
/*
	for (keys in obj){
		console.log(keys);
		console.log(obj[keys]);
	}
*/
//	$('#qsel3').append($("<option></option>").val(obj[setting_name]).html(obj[setting_name]));
	var name = obj[setting_name];
	var location = new google.maps.LatLng( obj[setting_lat], obj[setting_long]);
	markerBounds.extend(location);//---------------------------------表示領域のための関数fitBounds()用
	var table = maketable(false,obj,num);
	var infowindow = new google.maps.InfoWindow({
		disableAutoPan:false,
		content :table + "<br>",
		position : location
	});
//	console.log(table);
	var marker = new google.maps.Marker({
		position:location,
		map:mapObj,
		title:name
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
	if(nomap==false){
		var str = new String("<table id='popuptable' border='1'>");
		for(var i in obj){
			var data = obj[i];
			if(i.search("URL")!="-1"||i.search("画像")!="-1"){data = "<a href ='"+ obj[i] +"' target='_blank'>" + obj[i] + "</a>"}

			str += "<tr><td>"+ i +"</td><td>"+data+"</td></tr>";
		}
		str += "</table><br><a data-toggle='modal' href='#' onclick='edittable(&quot;"+ num +"&quot;)' class='btn btn-small'>編集</a>";

		return str;

	}else if(nomap==true){

		var str = new String("<table border='1' width='90%'><thead>");

		for(var i in obj){//最初の行
			for(var j in obj[i]){
				if(j.search("URL")!="-1"||j.search("画像")!="-1"){
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
					var objBody = document.getElementById("mk_list");
					var element = document.createElement("div");
					element.setAttribute("class", i);
					element.innerHTML = data;

					objBody.appendChild(element);
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

function createMarkerButton(marker) {
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

function getstatus(){
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


function getParameter(key) {
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
