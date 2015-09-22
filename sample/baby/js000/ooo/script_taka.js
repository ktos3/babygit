//Sample_takahashi rdfmgr_test1から4用



var mapObj;
var marker;
var gTrackMarkerList = new google.maps.MVCArray();//-------------------------------マーカー削除用
var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
var rdfmgr = new RDFmgr("SparqlTos2012");
	google.maps.event.addDomListener(window, 'load', function()
		{
			var lng = 137.013574;
			var lat = 35.275825;
			var mapOptions = {
				zoom: 9,
				center: new google.maps.LatLng(lat, lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
				draggable:false,
				scrollwheel:false
			};
			mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);

        });

function showQueryResult() {

//	clearMsglist();//検索結果のリスト表示をクリアする
	deleteMarker();
	sQuery= $('#query33').val();//検索式を取り出す
	console.log(sQuery);
//	$("#result").css("opacity","0.7").fadeOut(20);
	rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求する
		sparql: sQuery,
		success: function (re) {//CALLBACK   json1にはJSON形式の検索結果が入っている
			while(re.next()) {// 配列の分のループ
//				console.log(re.getValue("name"));
//				console.log(re.getValue("glat"));
//				console.log(re.getValue("glong"));
				marker = new google.maps.Marker({
					position:new google.maps.LatLng(re.getValue("glat"),re.getValue("glong")),
					map:mapObj,
					title:re.getValue("name"),
					animation:google.maps.Animation.DROP
				});
				gTrackMarkerList.push(marker);//----------------------------マーカーの後処理のための保持
//			console.log(re.getValue("glat"));
			}
		}
	});
}



function queryGo() {//--------------------------------------------セレクトボックスの値に対してのSPARQL文の選択-------------------
	var iq=$("#qsel5").val();
	var sq;
	console.log(iq);
	if(iq=="中央本線") {				sq=sQuery= "SELECT * WHERE {?x lodcu:line '中央本線'.	?x lodcu:name ?name .	?x lodcu:line ?line . ?x lodcu:imgURL ?imgurl . ?x lodcu:pos_lat ?glat. ?x lodcu:pos_long ?glong.  }";
		} else if(iq=="東海道本線") {	sq=sQuery= "SELECT * WHERE {?x lodcu:line '東海道本線'.	?x lodcu:name ?name .	?x lodcu:line ?line . ?x lodcu:imgURL ?imgurl . ?x lodcu:pos_lat ?glat. ?x lodcu:pos_long ?glong.  }";
		} else if(iq=="高山本線") {		sq=sQuery= "SELECT * WHERE {?x lodcu:line '高山本線'.?x lodcu:name ?name .	?x lodcu:line ?line . ?x lodcu:imgURL ?imgurl . ?x lodcu:pos_lat ?glat. ?x lodcu:pos_long ?glong.  }";
		} else if(iq=="太多線") {		sq=sQuery= "SELECT * WHERE {?x lodcu:line '太多線'.?x lodcu:name ?name .	?x lodcu:line ?line . ?x lodcu:imgURL ?imgurl . ?x lodcu:pos_lat ?glat. ?x lodcu:pos_long ?glong.  }";
		} else {
			return;
		}
//		console.log(sq);
		$('#query33').val(sq);//検索式を設定する
		showQueryResult();
}


function deleteMarker(){//--------------------------------------マーカーの削除
	gTrackMarkerList.forEach(function(marker,i){
		marker.setMap(null);
	});
}

