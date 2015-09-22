		function tos_init_gmap( stationList ) {
			//地図を表示
			var mapDiv = document.getElementById("map_canvas");
			var mapCanvas = new google.maps.Map(mapDiv);
			mapCanvas.setMapTypeId(google.maps.MapTypeId.ROADMAP);

			//マーカーを表示・非表示させるためのプロパティをセット
			mapCanvas.set("markersVisible", true);
			var checkBox = document.getElementById("marker_visibile");
			google.maps.event.addDomListener(checkBox, "click", function(){
				mapCanvas.set("markersVisible", Boolean(checkBox.checked));
			});

			//地図上にマーカーを配置していく
			var bounds = new google.maps.LatLngBounds();
			var station, i, latlng;
			for (i in stationList) {
				//マーカーを作成
				station = stationList[i];
				latlng = new google.maps.LatLng(station.latlng[0], station.latlng[1]);
				bounds.extend(latlng);
				var marker = createMarker(
					mapCanvas, latlng, station.name
				);

				//サイドバーのボタンを作成
				createMarkerButton(marker);
			}
			//マーカーが全て収まるように地図の中心とズームを調整して表示
			mapCanvas.fitBounds(bounds);
		}
		function createMarker(map, latlng, title) {
			//マーカーを作成
			var marker = new google.maps.Marker({
				position : latlng,
				map : map,
				title : title
			});

			//情報ウィンドウを作成
			var infoWnd = new google.maps.InfoWindow({
				content : "<strong>" + title + "</strong>"
			});

			//マーカーがクリックされたら、情報ウィンドウを表示
			google.maps.event.addListener(marker, "click", function(){
				infoWnd.open(map, marker);
			});

			//marker.visible を mapCanvas.markersVisible に連動する
			marker.bindTo("visible", marker.getMap(), "markersVisible");
			return marker;
		}
		function createMarkerButton(marker) {
			//サイドバーにマーカ一覧を作る
			var ul = document.getElementById("marker_list");
			var li = document.createElement("li");
			var title = marker.getTitle();
			li.innerHTML = title;
			ul.appendChild(li);

			//サイドバーがクリックされたら、マーカーを擬似クリック
			google.maps.event.addDomListener(li, "click", function(){
				google.maps.event.trigger(marker, "click");
			});
		}