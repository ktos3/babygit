//full_map用
//	<script type="text/javascript" src="js/full_map.js"></script>
var latlng;
var marker;
var gTrackMarkerList = new google.maps.MVCArray();//-------------------------------マーカー削除用
var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
//var gMarkerClusterer = new MarkerClusterer();//----------------------------大量のデータを取り扱うときに便利だよ用
var gMarkerCenter;
var rdfmgr = new RDFmgr("taka_s");//----------------------------------------使用するプロジェクト指定

	google.maps.event.addDomListener(window, 'load', function()
		{
			var lng = 137.013574;
			var lat = 35.275825;
			latlng = new google.maps.LatLng(lat,lng);
			console.log(latlng);
			var mapOptions = {
				zoom: 4,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
				draggable:true,
				scrollwheel:true
			};
			mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);
//			console.log(mapObj);
//			drawMarkerCenterInit(mapObj,latlng);
			gMarkerCenter = drawMarkerCenterInit(mapObj,latlng);
//			gMarkerClusterer = new MarkerClusterer(mapObj);//----------------------------大量のデータを取り扱うときに便利だよ用

			// リスナーを追加：中心移動時にセンターマーカーを再描画(位置とタイトル)
			google.maps.event.addListener(mapObj, 'center_changed', function(){
				var pos = mapObj.getCenter();
				gMarkerCenter.setPosition(pos);
				gMarkerCenter.setTitle('map center: ' + pos);
			});



			// リスナーを追加：センターマーカー移動(ドラッグ完了)時に地図の中心を移動
			google.maps.event.addListener(gMarkerCenter, 'dragend', function(){
				mapObj.panTo(gMarkerCenter.position);
			});


			// リスナーを追加：センターマーカークリック時に情報ウィンドウを表示
			google.maps.event.addListener(gMarkerCenter, 'click', function(){
				var infoWindow = new google.maps.InfoWindow({
					content: 'map center: ' + mapObj.getCenter()
				})
				infoWindow.open(mapObj,gMarkerCenter);
			});

		function deleteMarker(){//--------------------------------------マーカーの削除
			gTrackMarkerList.forEach(function(marker,i){
				marker.setMap(null);
			});
		}
        });

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
			draggable: true // ドラッグ可能にする
		});
		return markerCenter;
	}

	console.log(latlng);


function deleteMarker(){//--------------------------------------マーカーの削除
	gTrackMarkerList.forEach(function(marker,i){
		marker.setMap(null);
	});
}




//LODBrowser用 onload セレクト文--------------------------------------------使ってないが今後使うかもしれんぬ
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
//	deleteMarker();  いらないかも
	gMarkerClusterer.clearMarkers();//前回表示したマーカークリア いらないかも
	var pre=$("#qsel5").val();
	var sq = "select * where {?x lodcu:県名 '"+pre+"' .?x lodcu:県名 ?prefecture. ?x lodcu:名前 ?name. ?x lodcu:住所 ?address.?x lodcu:緯度 ?lat. ?x lodcu:経度 ?long. ?x lodcu:番号 ?number. ?x lodcu:郵便番号 ?zipcode.} ";
	$('#query33').val(sq);
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: sq,
//		inference:false,
//		remakeJson: false,
		success: function(re){
			var markers = [];
			while(re.next()){
				var pos = new google.maps.LatLng(re.getValue("lat"),re.getValue("long"));
				marker = new google.maps.Marker({
					position:new google.maps.LatLng(re.getValue("lat"),re.getValue("long")),
					map:mapObj,
					title:re.getValue("name"),
//					animation:google.maps.Animation.DROP
				});
				markers.push(marker);
//				gTrackMarkerList.push(marker);
				markerBounds.extend(pos);//---------------------------------表示領域のための関数fitBounds()用
			}
			mapObj.fitBounds(markerBounds);
			gMarkerClusterer.addMarkers(markers); // マーカーの表示
		}
	});
}