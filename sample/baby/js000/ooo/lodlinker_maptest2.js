	var mapObj;
	var gTrackMarkerList = new google.maps.MVCArray();//マーカー消去用
	var infoWindow;
	var currentInfoWindow = null;
	var markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
	var res_graph=null;//グラフ用
	
    var res_graph=null;
    var graph_title;
	var pro_sel=null;
	var currentId=null;
	window.onload = function() {
		$("input").focus(function() {
		    $("p").fadeToggle("fast", "linear");
		});
		$("input").focusout(function() {
		    $("p").fadeToggle("fast", "linear");
		});
		};
		
	google.maps.event.addDomListener(window, 'load', function()
			{
				test();
				var lng = 137.013574;
				var lat = 35.275825;
				var mapOptions = {
					zoom: 9,
					center: new google.maps.LatLng(lat, lng),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					scaleControl: true,
					draggable:true,
					scrollwheel:true
				};
				mapObj = new google.maps.Map(document.getElementById('gmap'), mapOptions);
			});
	function test(){
		$("#aaa").empty();
		$("#bbb").empty();
		$("#ccc").empty();
		$("#mk_list").empty();
		deletemarker();
		refresh();
		graph_refresh();
		$("#loading").empty();
		$("#table").empty();
		$("#graoh").empty();
		$('#south_body').css( 'overflow-y', 'hidden' );//これ！
		$('select#qsel3 option').remove();
		$('select#qsel5 option').remove();
		$('#gmap').show(500);
		$('#table').show(500);
		$('#graph').show(500);
		$('#iframe').hide(500);
		var keyword = $("#setting_key").val();//キーワード取得
		var LOD;
		var LOD_label;
		var label;
		var type;
		var uri;
		var lod;
		$("#loading2").html("<img src='ping/gif-load.gif'/>");
		$.ajax({
			url: 'http://lodlinker.org/?keyword='+keyword+'&output=json&offset=0',
			type: 'GET',
			dataType : "json",
	// データのロード完了時の処理
			success: function(res){
				$('select.property option').remove();
				// 取得した内容をコンソールに出力
//				console.log(res.results.bindings.length);
				if(res.results.bindings.length==0){
					alert("合致するクラスがありません。");
				}else{
				for(var key in res.results.bindings){
//					console.log(res.results.bindings[key].LOD_label.value);
					LOD = res.results.bindings[key].LOD.value;
					LOD_label = res.results.bindings[key].LOD_label.value;

						if(res.results.bindings[key].label!=undefined){
							label=res.results.bindings[key].label.value;
						}
//					label = res.results.bindings[key].label.value;
					type = res.results.bindings[key].type.value;
					uri = res.results.bindings[key].uri.value;
					LOD_label= LOD_label.replace(" ","");
					LOD_label= LOD_label.replace("(","");
					LOD_label= LOD_label.replace(")","");
//					console.log(label);
//					console.log(uri.slice(uri.search("#")+1,uri.length));
					lod=uri.slice(uri.search("#")+1,uri.length);
//					console.log(key);
//					console.log(LOD);console.log(LOD_label);console.log(type);console.log(uri);
//					$("#aaa").append("<div id="+key+" onclick='test2(this)' style='border-style: ridge; border-width: 2px;padding: 10px 5px 10px 5px;word-wrap: break-word;'><div>"+LOD_label+"</div><div>"+uri+"</div></div><br>");//divタグ内文章折り返し、余白、枠線
					if(label!=undefined){
						$("#aaa").append("<div id="+key+" onclick='test2(this)' style='border-style: ridge; border-width: 2px;padding: 10px 5px 10px 5px;word-wrap: break-word;'><div>"+label+"</div><div>in "+LOD_label+"</div></div><br>");//divタグ内文章折り返し、余白、枠線
						var title=label+"in"+LOD_label;
						label=undefined;
						$('div#'+key+'').attr({
							'LOD': LOD,
							'LOD_label': LOD_label,
							'type': type,
							'uri': uri,
							'title':title
						});
					}else{
						$("#aaa").append("<div id="+key+" onclick='test2(this)' style='border-style: ridge; border-width: 2px;padding: 10px 5px 10px 5px;word-wrap: break-word;'><div>"+lod+"</div><div>in "+LOD_label+"</div></div><br>");//divタグ内文章折り返し、余白、枠線
						var title=lod+"in"+LOD_label;
						$('div#'+key+'').attr({
							'LOD': LOD,
							'LOD_label': LOD_label,
							'type': type,
							'uri': uri,
							'title':title
						});
					}
				}//for文終わり
				}
			},
			error: function() {
				alert("通信が失敗しました");
			},
			complete : function() {
				$("#loading2").empty();
			}
		});
	}
	function test2(info){
		//各属性値取得
		$("#bbb").empty();
		$("#ccc").empty();
		$("#mk_list").empty();
		$("#table").empty();
//		$("#graph").empty();
/*		var ctx = canvas.getContext('2d');
		ctx.clearRect(45,45,60,60);*/
		$('select#qsel3 option').remove();
		$('select#qsel5 option').remove();
		graph_refresh();
//		$('#canvas_area').hide(500);
		deletemarker();
		$('#'+info.id+'').css( 'border-color', 'red' );//これ！
		if(currentId!=null){
			$('#'+currentId+'').css( 'border-color', 'gray' );//これ！
		}
		currentId=info.id;
		var lod = $('#'+info.id+'').attr('LOD');
		var lod_label = $('#'+info.id+'').attr('LOD_label');
		var type = $('#'+info.id+'').attr('type');
		var uri = $('#'+info.id+'').attr('uri');
		graph_title = $('#'+info.id+'').attr('title');
		var mapping=null;
		//console.log(lod);console.log(lod_label);console.log(type);console.log(uri);
		// ロード完了イベント
		$("#loading_instance").html("<img src='ping/gif-load.gif'/>");
		$.ajax({
			//url: str,
			url:"http://lodlinker.org/",
			data:{
				query : "select ?s ?p ?o where{?s a <"+uri+">.?s ?p ?o.}",
				service : lod ,
				output:'json'
			},
			type: 'GET',
			dataType : "json",
			async: false,
	// データのロード完了時の処理
			success: function(res){
				$('select.property option').remove();
				selectbox_set(res);
				res_graph=res;
				mapping=test3(res,mapping);
			},
			error: function() {
				$("#loading_instance").empty();
				alert("通信が失敗しました");
			},
			complete : function(res) {
				if(mapping==true){
					$("#loading").html("<p>通信終了　ピンが置かれました</p>");
					$("#loading_instance").empty();
					show_hide1();
					makeinstance(res_graph);
				}else{
					$("#loading_instance").empty();
					$("#loading").html("<p>通信終了　位置情報が含まれていません</p>");
					$('#south_body').css( 'overflow-y', 'visible' );//これ！
					makeinstance(res_graph);
					show_hide2();

					
				}
			}
		});
	}
	
	function makeinstance(obj){
//		console.log(obj);
		var subject=null;
		var subject2=null;
		var id=0;
		var lastresult_key=obj.results.bindings.length;//最後用
		for(var key in obj.results.bindings){
			subject=obj.results.bindings[key].s.value;
			var p=new String(obj.results.bindings[key].p.value);
			if(subject2!=subject&&subject2!=null){
//				console.log(insname);
				if(insname==undefined){
					var s = new String(subject2);
					var length=s.length;
					var result=s.lastIndexOf("/");
					result=s.substring(result+1,length);
//					console.log(result);
					$("#ccc").append("<div id="+id+" onclick='table_lift(this)'>"+result+"</div>");//divタグ内文章折り返し、余白、枠線
				}else{
					$("#ccc").append("<div id="+id+" onclick='table_lift(this)'>"+insname+"</div>");//divタグ内文章折り返し、余白、枠線
				}
				insname=undefined;
				id++;
			};
			if(p.search("名")!="-1"||p.search("label")!="-1"||p.search("name")!="-1"){
				var insname = obj.results.bindings[key].o.value;
//				$("#aaa").append("<div id="+key+" onclick='test2(this)' style='border-style: ridge; border-width: 2px;padding: 10px 5px 10px 5px;word-wrap: break-word;'><div>"+label+"</div><div>in "+LOD_label+"</div></div><br>");//divタグ内文章折り返し、余白、枠線
			};
			if(key==lastresult_key-1){//最後用
				if(insname==undefined){
					var s = new String(subject2);
					var length=s.length;
					var result=s.lastIndexOf("/");
					result=s.substring(result+1,length);
//					console.log(result);
					$("#ccc").append("<div id="+id+" onclick='table_lift(this)'>"+result+"</div>");//divタグ内文章折り返し、余白、枠線
				}else{
					$("#ccc").append("<div id="+id+" onclick='table_lift(this)'>"+insname+"</div>");//divタグ内文章折り返し、余白、枠線
				}
				insname=undefined;
				id++;
			};
			subject2=obj.results.bindings[key].s.value;
		}
		
	}
	
	function table_lift(info){
		console.log(info.id);

			var targetX = $("div#table_"+info.id+"");
			targetX.scrollTop();
			//			$("#table").animate({scrollTop:targetX});

	}
	
	function test3(obj,mapping){
		var subject_obj={};
		var subject=null;
		var subject2=null;
		var searchString;
		var p_result_graph=[];
		var p_result_graph_string;
		var id=0;
//		console.log(obj);
		var table = new String("<table border='1'><tr>");
		var disp_table = new String("<div id='table_"+id+"'><table border='1'><tr><th bgcolor='#B0E0E6'><font color='#DB7093'>subject</font></th><th bgcolor='#B0E0E6' width='150'><font color='#DB7093'>property</font></th><th bgcolor='#B0E0E6' width='200'><font color='#DB7093'>object</font></th></tr><tr>");
//		console.log(obj.results.bindings.length);
		id++;
//		console.log(obj.results.bindings.length);
		var lastresult_key=obj.results.bindings.length;//最後用
		if(lastresult_key==0){
			alert("データの中身がありません。");
		};
		for(var key in obj.results.bindings){
//			console.log(key);
//			console.log("-------------------------------------------------");
//			console.log(obj.results.bindings[key].s.value);console.log(obj.results.bindings[key].p.value);console.log(obj.results.bindings[key].o.value);
//			console.log("-----------------------------------------------");
			subject=obj.results.bindings[key].s.value;
//			console.log(subject);
			
			var p=new String(obj.results.bindings[key].p.value);
			var s=new String(obj.results.bindings[key].s.value);
			p_result_graph_string=p.substring(p.indexOf("#")+1,p.length);
//			console.log(p_result_graph_string);
//			console.log(p_result_graph.indexOf(p_result_graph_string));
			if(p_result_graph.indexOf(p_result_graph_string)=="-1"){
				p_result_graph.push(p_result_graph_string);//グラフセレクトボックス用
			}
			
			if(subject2!=subject&&subject2!=null){
//				console.log(subject);
//				console.log(subject2);
//				console.log("主語が変わった");
//				console.log(insname);
				table += "</table>";
				searchString = encodeURI(insname);
				search=new String("<a href='http://www.google.co.jp/#hl=ja&q="+searchString+"'target='_blank'>"+insname+"をgoogle検索</a>");
				table=search + table;
//				disp_table += "</table>";
				$("#table").append(disp_table);	
				
				if(lat!=null&&lon!=null){
//					console.log(insname);
//					console.log("コンソールテスト");
					placemarker(lat,lon,table,insname);
					
					mapObj.fitBounds(markerBounds);
					mapping=true;
					lat=null;
					lon=null;
					insname=null;
					table = new String("<table border='1'><tr>");
					disp_table = new String("</div><br><div id='table_"+id+"'><table border='1'><tr>");
					id++;
				};
				table = new String("<table border='1'><tr>");
				disp_table = new String("</div><br><div id='table_"+id+"'><table border='1'><tr>");
				id++;
			};
			if(p.search("緯度")!="-1"||p.search("lati")!="-1"||p.search("lat")!="-1"||p.search("latitude")!="-1"||p.search("geo:lat")!="-1"){
				var lat = obj.results.bindings[key].o.value;
			};
			if(p.search("経度")!="-1"||p.search("long")!="-1"||p.search("lon")!="-1"||p.search("longitude"||p.search("geo:long")!="-1")!="-1"){
				var lon = obj.results.bindings[key].o.value;
			};
			if(p.search("名")!="-1"||p.search("label")!="-1"||p.search("name")!="-1"){
				var insname = obj.results.bindings[key].o.value;
//				console.log(setting_name);
//				console.log(insname);
			};
			
			table += "<td>"+obj.results.bindings[key].p.value+"</td><td>"+obj.results.bindings[key].o.value+"</td>";
			disp_table += "<td>"+obj.results.bindings[key].s.value+"</td><td>"+obj.results.bindings[key].p.value+"</td><td>"+obj.results.bindings[key].o.value+"</td>";

			table += "</tr>";
			disp_table += "</tr>";
			if(key==lastresult_key-1){//最後用
				table += "</table>";
				$("#table").append(disp_table);	
				searchString = encodeURI(insname);
				search=new String("<a href='http://www.google.co.jp/#hl=ja&q="+searchString+"'target='_blank'>"+insname+"をgoogle検索</a>");
				table=search + table;
				if(lat!=null&&lon!=null){
//					console.log("コンソールテスト3");
//					console.log(insname);
					placemarker(lat,lon,table,insname);
					mapObj.fitBounds(markerBounds);
					//				$("#bbb").append("<div id="+key+"  style='border-style: ridge; border-width: 2px;padding: 10px 5px 10px 5px;word-wrap: break-word;'><div>"+insname+"</div></div><br>");//divタグ内文章折り返し、余白、枠線
					mapping=true;
					lat=null;
					lon=null;
					}
			}
			subject2=obj.results.bindings[key].s.value;
//			console.log("-------------------------------------------------");
		}//for文終わり
//		console.log(p_result_graph);
/*		for ( var i = 0; i < p_result_graph.length; ++i ) {
//			console.log(p_result_graph[i]);
//			$("#qsel5").append($("<option>").html(p_result_graph[i]).val(p_result_graph[i]));
//			$("#qsel3").append($("<option>").html(p_result_graph[i]).val(p_result_graph[i]));
			$(".property").append($("<option>").html(p_result_graph[i]).val(p_result_graph[i]));
		}*/

//		disp_table += "</table>";ここ
		
		markerBounds = new google.maps.LatLngBounds(); //-------------------------マーカーの領域（座標）を保持　画面周り調整用
		return mapping;
	}
	function placemarker(lat,lon,table,name){
//		console.log(lat);
//		console.log(lon);
		var str=table;
//		console.log(name);
		var location = new google.maps.LatLng(lat,lon);
		markerBounds.extend(location);//---------------------------------表示領域のための関数fitBounds()用
		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(lat,lon),
			map:mapObj,
			title:name,
//			title:re.getValue("name"),
			animation:google.maps.Animation.DROP
		});
		setMarkerListener(marker,str);
		createMarkerButton_linker(marker);
		gTrackMarkerList.push(marker);
	}
	
	function deletemarker(){
		gTrackMarkerList.forEach(function(d_marker, i){
	        d_marker.setMap(null);
	    }); 
	}
	function setMarkerListener(marker,table){
		var infomation=table;
		var infowindow2 = new google.maps.InfoWindow({
			content:table
		});
		google.maps.event.addListener(marker, 'click', function(event) {
	        // 情報ウィンドウの表示
			if(currentInfoWindow){currentInfoWindow.close();}
			infowindow2.open(mapObj, marker);
			currentInfoWindow = infowindow2;
	    });

		google.maps.event.addListener(mapObj,'click',function(){
			infowindow2.close();
		});
/*
		google.maps.event.addListener(mapObj,'rightclick',function(event){
			document.getElementById("show_lat").innerHTML = event.latLng.lat();
			document.getElementById("show_lng").innerHTML = event.latLng.lng();
		});*/
	}
	
	//右カラムにサイドバーを作成する
	function createMarkerButton_linker(marker) {
		//サイドバーにマーカ一覧を作る
		var objBody = document.getElementById("mk_list");
		var element = document.createElement("div");
		var title = marker.getTitle();
		element.innerHTML = title+"<br>";
		objBody.appendChild(element);

		//サイドバーマウスオーバーでマーカーを擬似クリック
		google.maps.event.addDomListener(element, "click", function(){
			element.innerHTML = title+"<br>";
			google.maps.event.trigger(marker, "click");
		});
	}
	
	$(function(){//各要素のうち、表示状態にあるものを非表示にし、非表示状態にあるものは表示状態にします
	    // 「id="jQueryBox"」を非表示
	    $("#jQueryBox").css("display", "none");
	 
	    // 「id="jQueryPush"」がクリックされた場合
	    $("#jQueryPush").click(function(){
	        // 「id="jQueryBox"」の表示、非表示を切り替える
	        $("#gmap").toggle();
	    });
	});
	$(function() {
		    //ページ内スクロール
		    $(".btn_sample").click(function () {
		        var i = $(".btn_sample").index(this)
		        var p = $(".content").eq(i).offset().top;
		        $('html,body').animate({ scrollTop: p }, 'fast');
		        return false;
		    });
		 
		    //ページ上部へ戻る
		    $(".map_button").click(function () {
		        $('#south_body').animate({ scrollTop: 0 }, 'fast');
		        return false;
		    });
		});

	function show_hide1(){
//		console.log(is_hidden);
		
		$('#gmap').show(500);
		$('#table').hide(500);
		$('#graph').hide(500);
		$('#iframe').hide(500);
		$('#ccc').css( 'display', 'none' );//これ！
		$('#mk_list').css( 'display', '' );//これ！
		$('#south_body').css( 'overflow-y', 'hidden' );//これ！
//		$('#south_body').css( 'overflow-y', 'visible' );//これ！
		return false;
	}
	function show_hide2(){
		$('#gmap').hide(500);
		$('#table').show(500);
		$('#graph').hide(500);
		$('#iframe').hide(500);
//		$('#south_body').css( 'overflow-y', 'hidden' );//これ！
		$('#south_body').css( 'overflow-y', 'visible' );//これ！
		$('#ccc').css( 'display', '' );//これ！
		$('#mk_list').css( 'display', 'none' );//これ！
		return false;
	}
	function show_hide3(){
//		var is_hidden = $("#gmap").is(":hidden");// #box4が、hidden状態か調べる false隠れてる
		$('#gmap').hide(500);
		$('#table').hide(500);
		$('#graph').show(500);
		$('#ccc').css( 'display', '' );//これ！
		$('#mk_list').css( 'display', 'none' );//これ！
		$('#iframe').hide(500);
		$('#south_body').css( 'overflow-y', 'hidden' );//これ！
//		$('#south_body').css( 'overflow-y', 'visible' );//これ！
		return false;
	}
	function show_hide4(){
//		var is_hidden = $("#gmap").is(":hidden");// #box4が、hidden状態か調べる false隠れてる
		$('#gmap').hide(500);
		$('#table').hide(500);
		$('#graph').hide(500);
		$('#iframe').show(500);
		$('#south_body').css( 'overflow-y', 'hidden' );//これ！
//		$('#south_body').css( 'overflow-y', 'visible' );//これ！
		return false;
	}

	function graph_change(){
		var graph_num=$("select#graph_sel").val();
		var id="#graph"+graph_num;
		if(graph_num==1){
			$('#graph2').hide();
			$('#graph3').hide();
			$('#graph4').hide();
			$('#graph5').hide();
			$(id).show(500);
		}else if (graph_num==2){
			$('#graph1').hide(500);
			$('#graph3').hide(500);
			$('#graph4').hide(500);
			$('#graph5').hide(500);

			$(id).show(500);
		}else if (graph_num==3){
			$('#graph1').hide(500);
			$('#graph2').hide(500);
			$('#graph4').hide(500);
			$('#graph5').hide(500);
			$(id).show(500);
		}else if (graph_num==4){
			$('#graph1').hide(500);
			$('#graph2').hide(500);
			$('#graph3').hide(500);
			$('#graph5').hide(500);
			$(id).show(500);
		}else if (graph_num==5){
			$("#graph1").css("display", "none");
			$("#graph2").css("display", "none");
			$("#graph3").css("display", "none");
			$("#graph4").css("display", "none");
			$("#graph5").css("display", "none");
			$(id).show(500);
			/*			$('#graph1').hide();
			$('#graph2').hide();
			$('#graph3').hide();
			$('#graph4').hide();*/
		}
	}
	
