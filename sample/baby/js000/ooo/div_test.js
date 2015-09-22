
      google.maps.event.addDomListener(window, 'load', function() {
		var map=null;
		var marker_list = new google.maps.MVCArray();
		var project=$('div').data('option').project;
		var useclass=$('div').data('option').classname;
		var setname=$('div').data('option').setname;
		var latitude=$('div').data('option').latitude;
		var longitude=$('div').data('option').longitude;
		var rdfmgr = new RDFmgr(project);
		var latlng = new google.maps.LatLng(38, 137);
		var infowindow = new google.maps.InfoWindow({content: 'Latlng'});
		var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
		var currentInfoWindow = null;
		var opts = {
				zoom: 5,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: latlng
			};
		rdfmgr.executeSparql({//RDFmgrに検索式を渡して検索実行を要求
			sparql: "SELECT * WHERE{?x rdf:type lodcu:" + useclass +".?x ?pro ?z.}order by ?x",
			inference:false,
			remakeJson: false,
			success: json_analyze,
			error:function(eType, eMsg, eInfo){
				alert(eType+"<br>"+eMsg+"<br>"+eInfo);
			}
		});
		
		function json_analyze(json){
			obj = new Object();
			var nomap = null;

			while(json.next()){
				if(typeof obj[json.getValue("x")] === "undefined"){	obj[json.getValue("x")] = {};}//オブジェクト初期化

				if(json.getValue("pro")=="lodcu:"+latitude||json.getValue("pro")=="lodcu:"+longitude){	//緯度もしくは経度の時はnomapフラグ解除
					nomap = false;
				}
				if(json.getValue("pro")!="rdf:type"){
					obj[json.getValue("x")][json.getValue("pro").replace('lodcu:','')] = json.getValue("z");
				}
			}
			if(nomap == false){
				//console.log("Original:");
				//console.log(obj);
				for(var i in obj){
					//console.log(i);
					//console.log(obj[i]);
					placeMarker(obj[i],i);
				}
			}else{
//				document.getElementById("map_canvas").innerHTML = maketable(true,obj,null);
			}
		}

		function placeMarker(obj,num){

			if(map==null){
				map = new google.maps.Map($(".rdfmgr-map").get(0), opts);
			}
			var name = obj[setname];
			var table = maketable(false,obj,num);

			var location = new google.maps.LatLng( obj[latitude], obj[longitude]);
			markerBounds.extend(location);//---------------------------------表示領域のための関数fitBounds()用
			var marker = new google.maps.Marker({position : location,map : map,title : name});
			marker_list.push(marker);

			var infowindow = new google.maps.InfoWindow({
				content :table + "<br>",
				position : location
			});


			google.maps.event.addListener(marker, 'click', function(){
				if(currentInfoWindow){currentInfoWindow.close();}
//				if(first == true){map.setZoom(14);}
				infowindow.open(map, marker);
				currentInfoWindow = infowindow;
				first = false;
		    });

			google.maps.event.addListener(map,'click',function(){
				infowindow.close();
			})
/*
			google.maps.event.addListener(map,'rightclick',function(event){
				document.getElementById("show_lat").innerHTML = event.latLng.lat();
				document.getElementById("show_lng").innerHTML = event.latLng.lng();
			})
*/
		}
		function maketable(nomap,obj,num){
			if(nomap==false){
				var str = new String("<table id='popuptable' border='1'>");
				for(var i in obj){
					var data = obj[i];
					if(i.search("URL")!="-1"||i.search("画像")!="-1"){data = "<a href ='"+ obj[i] +"' target='_blank'>" + obj[i] + "</a>"}

					str += "<tr><td>"+ i +"</td><td>"+data+"</td></tr>";
				}
				str += "</table><br>";

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
     });
