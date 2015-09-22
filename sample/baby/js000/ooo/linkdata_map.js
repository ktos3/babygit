function SparqlSend_linkdata1(){
		var stext = $("#sparql").val();
 	console.log(stext);
		//executeSparql()でSPARQL検索を行う
		rdfmgr.executeSparql({
			sparql: "select * where{?s ?p ?o}",
			inference: false,
			projectID:stext,
			success: maketable_linkdata2,
			error: getErrorMsg_linkdata
		});
		$("#aaa").append(stext);
	}
 
	//SparqlEPCUから受け取ったJSONデータをイテレータを使用して取り出し表作成
	function maketable_linkdata2(re){
		var s;
		var t;
		var subject=null;
		var subject2=null;
		$("#disp").empty();
		var str = new String("<tr>");
		var table = new String("<table border='1'><tr>");
		for(var i=0; i<re.getKeyListLength();i++){
//			console.log(re.getKey(i));spo
			str += "<td>"+re.getKey(i)+"</td>";
		}
		str += "</tr>";
		while(re.next()){
//			console.log(re.getLength());3
			for(var i=0; i < re.getLength();i++){
				p=re.getValue(i);
//				console.log(p)
				if(i==0){//タイトル的な名前を取得
					s=re.getValue(0);
					s=s.slice(s.search("#")+1,s.length);
//					console.log(s);
				};
				if(p.search("緯度")!="-1"||p.search("lati")!="-1"||p.search("lat")!="-1"||p.search("latitude")!="-1"||p.search("geo:lat")!="-1"){
					var lat = p=re.getValue(2);;
				};
				if(p.search("経度")!="-1"||p.search("long")!="-1"||p.search("lon")!="-1"||p.search("longitude")!="-1"||p.search("geo:long")!="-1"){
					var lon = p=re.getValue(2);;
				};
				str += "<td><pre>"+re.getValue(i)+"</pre></td>";

				if(subject!=s&&subject!=null){
					table += "</tr></table>";
//					$("#disp").append(table);
					t=table;
					var table = new String("<table border='1'><tr>");
					subject=s;
				};
				
				if(i!=0){//テーブル作成
					table += "<td>"+re.getValue(i)+"</td>";
				};

			}//for終わり
			str += "</tr>";

			
			table += "</tr>";
			if(subject2!=s&&subject2!=null){
//				$("#bbb").append("<div id='test'>"+subject2+"</div>");
				if(lat!=null&&lon!=null){
//					console.log("ここでマッピング処理");
					placemarker_linkdata3(lat,lon,t,subject2);
					lat=null;
					lon=null;
				};

			};
			
			subject2=s;
			subject=s;
		}
		$("#bbb").append("<div id='test'>"+subject2+"</div>");
		if(lat!=null&&lon!=null){
//			console.log("これでラストー");
			placemarker_linkdata3(lat,lon,t,subject2);
			lat=null;
			lon=null;
		};
		$("#disp").append(table);
//		$("#disp").append(str);

	}
	function getErrorMsg_linkdata(eType,eMsg,eInfo){
		alert(eMsg+"\n\n"+eInfo);
	}
 
	function placemarker_linkdata3(lat,lon,table,name){
//		console.log(lat);
//		console.log(lon);
//		console.log(table);
		
		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(lat,lon),
			map:mapObj,
			title:name,
			animation:google.maps.Animation.DROP
		});
		setMarkerListener_linkdata5(marker,table);
		gTrackMarkerList.push(marker);
		createMarkerButton_linkdata6(marker);
	}
	function deletemarker_linkdata4(){
		gTrackMarkerList.forEach(function(d_marker, i){
	        d_marker.setMap(null);
	    }); 
	}
	function setMarkerListener_linkdata5(marker,table){
//		$("#disp").append(table);
//		var infowindow;
		var infomation;
		information=table;
		infowindow = new google.maps.InfoWindow({
			content:information,
//			maxWidth:200
		});
		google.maps.event.addListener(marker, 'click', function(event) {
	        // 情報ウィンドウの表示
			if(currentInfoWindow){currentInfoWindow.close();}
			infowindow.open(mapObj, marker);
			currentInfoWindow = infowindow;
	    });

		google.maps.event.addListener(mapObj,'click',function(){
			infowindow.close();
		});

		google.maps.event.addListener(mapObj,'rightclick',function(event){
			document.getElementById("show_lat").innerHTML = event.latLng.lat();
			document.getElementById("show_lng").innerHTML = event.latLng.lng();
		});
	}
	
	//右カラムにサイドバーを作成する
	function createMarkerButton_linkdata6(marker) {
//		console.log("createMarkerButton()スタート");

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