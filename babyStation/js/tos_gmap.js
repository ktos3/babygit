		function tos_init_gmap( stationList ) {
			//�n�}��\��
			var mapDiv = document.getElementById("map_canvas");
			var mapCanvas = new google.maps.Map(mapDiv);
			mapCanvas.setMapTypeId(google.maps.MapTypeId.ROADMAP);

			//�}�[�J�[��\���E��\�������邽�߂̃v���p�e�B���Z�b�g
			mapCanvas.set("markersVisible", true);
			var checkBox = document.getElementById("marker_visibile");
			google.maps.event.addDomListener(checkBox, "click", function(){
				mapCanvas.set("markersVisible", Boolean(checkBox.checked));
			});

			//�n�}��Ƀ}�[�J�[��z�u���Ă���
			var bounds = new google.maps.LatLngBounds();
			var station, i, latlng;
			for (i in stationList) {
				//�}�[�J�[���쐬
				station = stationList[i];
				latlng = new google.maps.LatLng(station.latlng[0], station.latlng[1]);
				bounds.extend(latlng);
				var marker = createMarker(
					mapCanvas, latlng, station.name
				);

				//�T�C�h�o�[�̃{�^�����쐬
				createMarkerButton(marker);
			}
			//�}�[�J�[���S�Ď��܂�悤�ɒn�}�̒��S�ƃY�[���𒲐����ĕ\��
			mapCanvas.fitBounds(bounds);
		}
		function createMarker(map, latlng, title) {
			//�}�[�J�[���쐬
			var marker = new google.maps.Marker({
				position : latlng,
				map : map,
				title : title
			});

			//���E�B���h�E���쐬
			var infoWnd = new google.maps.InfoWindow({
				content : "<strong>" + title + "</strong>"
			});

			//�}�[�J�[���N���b�N���ꂽ��A���E�B���h�E��\��
			google.maps.event.addListener(marker, "click", function(){
				infoWnd.open(map, marker);
			});

			//marker.visible �� mapCanvas.markersVisible �ɘA������
			marker.bindTo("visible", marker.getMap(), "markersVisible");
			return marker;
		}
		function createMarkerButton(marker) {
			//�T�C�h�o�[�Ƀ}�[�J�ꗗ�����
			var ul = document.getElementById("marker_list");
			var li = document.createElement("li");
			var title = marker.getTitle();
			li.innerHTML = title;
			ul.appendChild(li);

			//�T�C�h�o�[���N���b�N���ꂽ��A�}�[�J�[���[���N���b�N
			google.maps.event.addDomListener(li, "click", function(){
				google.maps.event.trigger(marker, "click");
			});
		}