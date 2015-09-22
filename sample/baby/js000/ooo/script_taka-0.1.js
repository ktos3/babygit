//rdfmgr_test5用

var mapObj;
var marker;
var gTrackMarkerList = new google.maps.MVCArray();//-------------------------------マーカー削除用
var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
var rdfmgr = new RDFmgr("LOD_Browser");
	google.maps.event.addDomListener(window, 'load', function()
		{
			var lng = 137.013574;
			var lat = 35.275825;
			var mapOptions = {
				zoom: 4,
				center: new google.maps.LatLng(lat, lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
				draggable:true,
				scrollwheel:true
			};
			mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);

        });




function deleteMarker(){//--------------------------------------マーカーの削除
	gTrackMarkerList.forEach(function(marker,i){
		marker.setMap(null);
	});
}

//LODBrowser用 onload セレクト文
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
	deleteMarker();
	var pre=$("#qsel5").val();
	var sq = "select * where {?x lodcu:県名 '"+pre+"' .?x lodcu:県名 ?prefecture. ?x lodcu:名前 ?name. ?x lodcu:住所 ?address.?x lodcu:緯度 ?lat. ?x lodcu:経度 ?long. ?x lodcu:番号 ?number. ?x lodcu:郵便番号 ?zipcode.} "
	$('#query33').val(sq);
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
		sparql: sq,
//		inference:false,
//		remakeJson: false,
		success: function(re){
			while(re.next()){
				marker = new google.maps.Marker({
					position:new google.maps.LatLng(re.getValue("lat"),re.getValue("long")),
					map:mapObj,
					title:re.getValue("name"),
//					animation:google.maps.Animation.DROP
				});
				gTrackMarkerList.push(marker);
			}
		}
	});
}