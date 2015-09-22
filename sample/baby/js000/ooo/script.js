if ((navigator.userAgent.indexOf('iPhone') > 0 &&navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
	location.href = 'http://lodcu.cs.chubu.ac.jp/lod_browser/sp/';
}


function getUrlVars(){//プロジェクト名を取得
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i <hashes.length; i++){
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	var projectName = getUrlVars()["project"];

	if(projectName == null){
		projectName = "LOD_Browser";
	}

	//RDFmgr初期化
	console.log(projectName);
	var rdfmgr = new RDFmgr(projectName);
	var sQuery = null;

	var inputnum = 0;
	var obj;
	var tbobj;
	var objnum;
	var prop = new Array();
	var propval = new Array();

	//Google Map初期化
	var map=null;
	var geocoder = new google.maps.Geocoder();
	var first = true;
	var className = null;
	var currentInfoWindow = null;
    var marker_list = new google.maps.MVCArray();
	var latlng = new google.maps.LatLng(38, 137);
	var infowindow = new google.maps.InfoWindow({content: 'Latlng'});
	var opts = {//mapオプション
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: latlng
	};

	function queryRead() {
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

	function showQueryResult() {

		clearMsglist();//検索結果とGoogle Mapを廃棄

		//セレクトボックスで指定した値を取得
		object = document.query.queryselect;
		index = object.selectedIndex;
		className = object.options[index].value;


		rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
			sparql: "SELECT * WHERE{?x rdf:type lodcu:" + className +".?x ?pro ?z.}order by ?x",
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

			if(json.getValue("pro")=="lodcu:緯度"||json.getValue("pro")=="lodcu:経度"){	//緯度もしくは経度の時はnomapフラグ解除
				nomap = false;
			}
			if(json.getValue("pro")!="rdf:type"){
				obj[json.getValue("x")][json.getValue("pro").replace('lodcu:','')] = json.getValue("z");
			}
		}
		if(nomap == false){
			console.log("Original:");
			console.log(obj);
			for(var i in obj){
				console.log(i);
				console.log(obj[i]);
				placeMarker(obj[i],i);
			}
		}else{
			document.getElementById("map_canvas").innerHTML = maketable(true,obj,null);
		}
	}

	function placeMarker(obj,num){

		if(map==null){
			map = new google.maps.Map(document.getElementById("map_canvas"), opts);
		}
		var name = obj["名前"];
		var table = maketable(false,obj,num);

		var location = new google.maps.LatLng( obj["緯度"], obj["経度"]);
		var marker = new google.maps.Marker({position : location,map : map,title : name});
		marker_list.push(marker);

		var infowindow = new google.maps.InfoWindow({
			content :table + "<br>",
			position : location
		});

		google.maps.event.addListener(marker, 'click', function(){
			if(currentInfoWindow){currentInfoWindow.close();}
			if(first == true){map.setZoom(14);}
			infowindow.open(map, marker);
			currentInfoWindow = infowindow;
			first = false;
	    });

		google.maps.event.addListener(map,'click',function(){
			infowindow.close();
		})

		google.maps.event.addListener(map,'rightclick',function(event){
			document.getElementById("show_lat").innerHTML = event.latLng.lat();
			document.getElementById("show_lng").innerHTML = event.latLng.lng();
		})

		createMarkerButton(marker);
		tbobj = obj;
	}

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
					if(j=="名前"){
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
		var objBody = document.getElementById("mk_list");
		var element = document.createElement("div");
		var title = marker.getTitle();
		element.innerHTML = title+"<br>";
		objBody.appendChild(element);

		//サイドバーマウスオーバーでマーカーを擬似クリック
		google.maps.event.addDomListener(element, "mouseover", function(){
			element.innerHTML = title+"<br>";
			google.maps.event.trigger(marker, "click");
		});
	}

	function getErrorMsg(eType,eMsg,eInfo){
		var str = "<font size='4' color='red'><b>エラー</b><br>"+eMsg+"</font>";
		$("#error").empty();
		$("#error").append(str);
	}

	function clearMsglist() {//データ表示部分を削除
		var node = document.getElementById('map_canvas');
		if (node.style.removeProperty) {
			node.style.removeProperty('background-color');
		}
		if (node.style.removeAttribute) {
			node.style.removeAttribute('background-color');
		}

		$("div#mk_list div").remove();
		$("div#map_canvas div").remove();
		map = null;
		first = true;

		marker_list.forEach( function(marker, idx) {
			marker.setMap(null);
		});
	}

	//Google Map APIを利用して住所→緯度経度変換
	function addaddressRun(){
		geocoder.geocode({
			address: $("#address").val()
		},
		function(data, status){
			console.log(data);
			if (status == google.maps.GeocoderStatus.OK) {
				$("#show_lat").empty();
				$("#show_lng").empty();
				$("#show_lat").append(data[0].geometry.location.lat());
				$("#show_lng").append(data[0].geometry.location.lng());
			}
			addtable();
		});
	}

	function addlocation(){
		if (navigator.geolocation) {

		    // 現在の位置情報を取得
			navigator.geolocation.getCurrentPosition(

				function (pos) {
					$("#show_lat").empty();
					$("#show_lng").empty();
					$("#show_lat").append(pos.coords.latitude);
					$("#show_lng").append(pos.coords.longitude);
					addtable();
				},
				// 位置情報の取得に失敗した場合
				function (error) {
					var message = "";

					switch (error.code) {

						// 位置情報が取得できない場合
						case error.POSITION_UNAVAILABLE:
						message = "位置情報の取得ができませんでした。";
						break;

										// Geolocationの使用が許可されない場合
						case error.PERMISSION_DENIED:
						message = "位置情報取得の使用許可がされませんでした。";
						break;

						// タイムアウトした場合
						case error.PERMISSION_DENIED_TIMEOUT:
						message = "位置情報取得中にタイムアウトしました。";
						break;
					}
					window.alert(message);
				}
			);
		} else {
			window.alert("本ブラウザではGeolocationが使えません");
		}
	}

	//登録用モーダルテーブル作成
	function addtable(){
		inputnum = 0;

		console.log(tbobj);
		var str = new String("<form name='addform'><table border='1' id='addformtable'>");
		for(var i in tbobj){
			var data ="";
			if(i == "緯度"){
				var data = $("#show_lat").text();
			}else if(i == "経度"){
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
		$('#addmodal').modal();
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
		$('#editmodal').modal();
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