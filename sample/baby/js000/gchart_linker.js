    var res_graph=null;
    var graph_title;
	var pro_sel=null;
    var inputnum1=1;
    var delnum1=1;
    var inputnum2=1;
    var delnum2=1;
    var inputnum3=1;
    var delnum3=1;
	function refresh(){
		res_graph=null;
		inputnum1=1;
	    delnum1=1;
	    inputnum2=1;
	    delnum2=1;
	    inputnum3=1;
	    delnum3=1;
	    pro_sel=null;
		
	}
	function graph_refresh(){
		$("#chart_div").empty();
		$("#scatter_chart_div").empty();
		$("#bar_chart_div").empty();
		$("#bar2_chart_div").empty();
		$("#Line_chart_div").empty();
	}
	function	selectbox_set(res){
		var p_result_graph=[];
		var p_result_graph_string;
		for(var key in res.results.bindings){
			var p=new String(res.results.bindings[key].p.value);
			p_result_graph_string=p.substring(p.indexOf("#")+1,p.length);
			if(p_result_graph.indexOf(p_result_graph_string)=="-1"){
				p_result_graph.push(p_result_graph_string);//グラフセレクトボックス用
			}
		}
		pro_sel=p_result_graph;
		for ( var i = 0; i < p_result_graph.length; ++i ) {//データ追加
//			console.log(p_result_graph[i]);
			$(".property").append($("<option>").html(p_result_graph[i]).val(p_result_graph[i]));
		}
	}
	
    //----------------------------------------------------------------------------------------------------------------------------------------------------------円
    // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});
      google.load("visualization", "1", {packages:["corechart"]});
      // Set a callback to run when the Google Visualization API is loaded.
//      google.setOnLoadCallback(drawChart1);-----------------------------------これを消した
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.

	function drawChart1() {
//		console.log(res_graph);
	    //------------------------------------------------------------------------------------------------------円グラフ用変数宣言
		var data;
		var options;
		var chart1;
	    //------------------------------------------------------------------------------------------------------ここまで
	    //------------------------------------------------------------------------------------------------------データセット用変数宣言
		var subject=null;
		var subject2=null;
		var all_data=[];
		var val1 = $("select#sel1").val();//縦
		var val2 = $("select#sel2").val();//横
//		console.log(val1);
//		console.log(val2);
		var array = new Array(val1,val2);
		all_data.push(array);
//		console.log(all_data);
	    //------------------------------------------------------------------------------------------------------ここまで
	    //------------------------------------------------------------------------------------------------------データセット
		if(res_graph==null){
			alert("キーワード検索からクラスを指定してください");
		}else{
		for(var key in res_graph.results.bindings){
//			console.log(key);
			subject=res_graph.results.bindings[key].s.value;
			var p=new String(res_graph.results.bindings[key].p.value);
			if(subject2!=subject&&subject2!=null){
//				String data_str = new String (data_object);
//				console.log("主語数");
//				console.log(data_object);
				var array = new Array(name_object,data_object);
				all_data.push(array);
//				console.log(name_object);
//				console.log(data_object);
				name_object=null;
				data_object=null;
			}
			if(p.search(val1)!="-1"){
//				console.log(res_graph.results.bindings[key].o.value);
				var name_object=res_graph.results.bindings[key].o.value;
			}
			if(p.search(val2)!="-1"){
//				console.log(res_graph.results.bindings[key].o.value);
				var data_object= res_graph.results.bindings[key].o.value;
				data_object=Number(data_object);//文字列を数値に変換
				var check = isNaN(data_object);
				console.log(check);
				if(check==true){
					alert("プロパティの選択にミスがあります。");
					break;
				}
				
//				console.log(data_object);
//				var data_object= new String(res_graph.results.bindings[key].o.value);
//				data_object=data_object.toString();
			}
			subject2=res_graph.results.bindings[key].s.value;
		}
	    //------------------------------------------------------------------------------------------------------データセットここまで
	    //------------------------------------------------------------------------------------------------------描画
//		console.log(all_data);
		
		// Create the data table.

		data = google.visualization.arrayToDataTable(all_data);
		data.addColumn('string', 'Topping');
		data.addColumn('number', 'Slices');
		data.addRows([
	]);
//	console.log(graph_title);
	// Set chart options
		var container = document.getElementById("graph");
		var divH=container.offsetHeight;
		divH=divH-5;
		options = {'title':graph_title,
				height:divH,
			is3D: true//3D指定
		};

		// Instantiate and draw our chart, passing in some options.
		chart1 = new google.visualization.PieChart(document.getElementById('chart_div'));
		chart1.draw(data, options);
		}
	    //-----------------------------------------------------------------------------------------------------描画ここまで
	    //----------------------------------------------------------------------------------------------------------------------------------------------------------円ここまで
	}
      //-------------------------------------------------------------------------------------------------------------------------------------------------散布図

 google.load("visualization", "1", {packages:["corechart"]});
 //google.setOnLoadCallback(drawChart2);
 function drawChart2() {
	    //------------------------------------------------------------------------------------------------------円グラフ用変数宣言
		var data;
		var options;
		var chart1;
		var container = document.getElementById("graph");
		var divH=container.offsetHeight;
		divH=divH-20;
	    //------------------------------------------------------------------------------------------------------ここまで
	    //------------------------------------------------------------------------------------------------------データセット用変数宣言
		var subject=null;
		var subject2=null;
		var all_data=[];
		var val1 = $("select#sel3").val();//縦
		var val2 = $("select#sel4").val();//横
//		console.log(val1);
//		console.log(val2);
		var array = new Array(val1,val2);
		all_data.push(array);
//		console.log(all_data);
	    //------------------------------------------------------------------------------------------------------ここまで
	    //------------------------------------------------------------------------------------------------------データセット
		if(res_graph==null){
			alert("キーワード検索からクラスを指定してください");
		}else{
		for(var key in res_graph.results.bindings){
//			console.log(key);
			subject=res_graph.results.bindings[key].s.value;
			var p=new String(res_graph.results.bindings[key].p.value);
			if(subject2!=subject&&subject2!=null){
//				String data_str = new String (data_object);
//				console.log("主語数");
//				console.log(data_object);
				var array = new Array(data1_object,data2_object);
				all_data.push(array);
//				console.log(name_object);
//				console.log(data_object);
				data1_object=null;
				data2_object=null;
			}
			if(p.search(val1)!="-1"){
//				console.log(res_graph.results.bindings[key].o.value);
				var data1_object=res_graph.results.bindings[key].o.value;
				data1_object=Number(data1_object);//文字列を数値に変換
				var check1 = isNaN(data1_object);
//				console.log(check1);
				if(check1==true){
					alert("横軸プロパティの選択にミスがあります。");
					break;
				}
			}
			if(p.search(val2)!="-1"){
//				console.log(res_graph.results.bindings[key].o.value);
				var data2_object= res_graph.results.bindings[key].o.value;
				data2_object=Number(data2_object);//文字列を数値に変換
				var check2 = isNaN(data2_object);
//				console.log(check2);
				if(check2==true){
					alert("縦軸プロパティの選択にミスがあります。");
					break;
				}
				
//				console.log(data_object);
//				var data_object= new String(res_graph.results.bindings[key].o.value);
//				data_object=data_object.toString();
			}
			subject2=res_graph.results.bindings[key].s.value;
		}
	    //------------------------------------------------------------------------------------------------------データセットここまで
	 
//	 console.log(all_data);
/*
var data_sample = google.visualization.arrayToDataTable([
     ['Age', 'Weight'],
     [ 8,      12],
     [ 4,      5.5],
     [ 11,     14],
     [ 4,      5],
     [ 3,      3.5],
     [ 6.5,    7]
   ]);
*/
	var data = google.visualization.arrayToDataTable(all_data);
   var options = {
     title: graph_title,
     height:divH,
//     'width':400,
//     'height':300,
//     hAxis: {title: 'Age', minValue: 0, maxValue: 15},
//     vAxis: {title: 'Weight', minValue: 0, maxValue: 15},
     legend: 'none'
   };

   var chart = new google.visualization.ScatterChart(document.getElementById('scatter_chart_div'));
   chart.draw(data, options);
		}
 }
 //----------------------------------------------------------------------------------------------------------------------------------------------------------散布図ここまで

 //----------------------------------------------------------------------------------------------------------------------------------------------------------縦棒グラフ


 //google.setOnLoadCallback(drawChart3);
 function drawChart3() {
		//------------------------------------------------------------------------------------------------------棒グラフ用変数宣言
			var data;
			var options;
			var chart1;
			var check1=false;
			var check=false;
			var container = document.getElementById("graph");
			var divH=container.offsetHeight;
			divH=divH-100;
		    //------------------------------------------------------------------------------------------------------ここまで
		    //------------------------------------------------------------------------------------------------------データセット用変数宣言
			var subject=null;
			var subject2=null;
			var all_data=[];
			var subject2=null;
			var val_side = $("select#g3").val();//縦
//			console.log(val);
			var array = new Array(val_side);
//			var val2 = $("select#sel4").val();//横
//			console.log(inputnum1);

			for (i = 0; i < inputnum1; i = i +1){
				var val = "select#g3_"+i;
				var val_i = $(val).val();
				eval("var val"+i+"=val_i;");
//				console.log(val_i);
				array.push(val_i);
			}

			console.log(array);
			console.log(inputnum1);

//			console.log(val1);
//			console.log(val2);
			all_data.push(array);
//			console.log(all_data);
		    //------------------------------------------------------------------------------------------------------ここまで
		    //------------------------------------------------------------------------------------------------------データセット

			if(res_graph==null){
				alert("クラスを指定してください");
			}else{
			for(var key in res_graph.results.bindings){
//				console.log(key);
				subject=res_graph.results.bindings[key].s.value;
				var p=new String(res_graph.results.bindings[key].p.value);
				if(subject2!=subject&&subject2!=null){
					//console.log("test");
					var array = new Array(data);
					for (i = 0; i < inputnum1; i = i +1){
//						eval("console.log(data_"+i+");");
						eval("array.push(data_"+i+");");
						eval("data_"+i+"=null;");
					}
					all_data.push(array);
//					String data_str = new String (data_object);
//					console.log("主語数");
//					console.log(data_object);
//					var array = new Array(data1_object,data2_object);
//					all_data.push(array);
//					console.log(name_object);
//					console.log(data_object);
//					data1_object=null;
//					data2_object=null;
				}

				if(p.search(val_side)!="-1"){
//					console.log(val);
					var data=res_graph.results.bindings[key].o.value;
				}
				for (i = 0; i < inputnum1; i = i +1){
					//console.log(i);
					eval("if(p.search(val"+i+")!='-1'){var data"+i+"=res_graph.results.bindings[key].o.value;data_"+i+"=Number(data"+i+");var check1 = isNaN(data_"+i+");}");
//					eval("if(p.search(val"+i+")!='-1'){console.log(res_graph.results.bindings[key].o.value);console.log('sakoさん');}");
					//eval("console.log(val"+i+");");
//					eval("data_"+i+"=Number(data"+i+");");
//					eval("var check1 = isNaN(data_"+i+");");
//					console.log(check1);
					if(check1==true){
						check=true;
					};
					check1==false;
//					console.log(check1);
				}
				subject2=res_graph.results.bindings[key].s.value;
			}
			if(check==true){
				alert("不適切なプロパティがあります。");
			};
		    //------------------------------------------------------------------------------------------------------データセットここまで
//		 console.log(all_data);

	/*   var data = google.visualization.arrayToDataTable([
	     ['Year', 'Sales', 'Expenses','sako'],
	     ['2004',  1000,      400,1000],
	     ['2005',  ,      460,10],
	     ['2006',  660,       1120,10],
	     ['2007',  1030,      540,10]
	   ]);*/
	   var data = google.visualization.arrayToDataTable(all_data);
	   var options = {
	     title: graph_title,
	     height:divH,
	     hAxis: {title: val_side, titleTextStyle: {color: 'red'}}
	   };

	   var chart = new google.visualization.ColumnChart(document.getElementById('bar_chart_div'));
	   chart.draw(data, options);
	 }
	 }
	function sel_append1(){
//		console.log("sakoさん");
		console.log(pro_sel);
		if(pro_sel!=null){
			var selId="g3_"+inputnum1;
			$("div#graph3_sel").append("<select id='"+selId+"'class='property'></select>");
//			console.log(pro_sel);
			selId="select#g3_"+inputnum1;
//			$('select.property option').remove();
			for ( var i = 0; i< pro_sel.length; ++i ) {//データ追加
//				console.log(p_result_graph[i]);
				$(selId).append($("<option>").html(pro_sel[i]).val(pro_sel[i]));
			}
			delnum1=inputnum1;
			inputnum1++;
		}else{
			alert("クラスを選択してください。");
		}
	}
	function sel_del1(){
		if(delnum1>0){
			var selId="#g3_"+delnum1;
			$("select").remove(selId);
			inputnum1=inputnum1-1;
			delnum1=delnum1-1;
		}else{
			alert("これ以上削除できません");
		}
	}
 //----------------------------------------------------------------------------------------------------------------------------------------------------------横棒グラフ
 //     google.load("visualization", "1", {packages:["corechart"]});
//      google.setOnLoadCallback(drawChart4);
      function drawChart4() {
  		//------------------------------------------------------------------------------------------------------棒グラフ用変数宣言
  			var data;
  			var options;
  			var chart1;
  			var check1=false;
  			var check=false;
  			var container = document.getElementById("graph");
  			var divH=container.offsetHeight;
  			divH=divH-100;
  		    //------------------------------------------------------------------------------------------------------ここまで
  		    //------------------------------------------------------------------------------------------------------データセット用変数宣言
  			var subject=null;
  			var subject2=null;
  			var all_data=[];
  			var subject2=null;
  			var val_side = $("select#g4").val();//縦
//  			console.log(val);
  			var array = new Array(val_side);
//  			var val2 = $("select#sel4").val();//横
//  			console.log(inputnum1);

  			for (i = 0; i < inputnum2; i = i +1){
  				var val = "select#g4_"+i;
  				var val_i = $(val).val();
  				eval("var val"+i+"=val_i;");
  				console.log(val_i);
  				array.push(val_i);
  			}

 // 			console.log(array);
  //			console.log(inputnum1);

//  			console.log(val1);
//  			console.log(val2);
  			all_data.push(array);
//  			console.log(all_data);
  		    //------------------------------------------------------------------------------------------------------ここまで
  		    //------------------------------------------------------------------------------------------------------データセット

  			if(res_graph==null){
  				alert("クラスを指定してください");
  			}else{
  			for(var key in res_graph.results.bindings){
//  				console.log(key);
  				subject=res_graph.results.bindings[key].s.value;
  				var p=new String(res_graph.results.bindings[key].p.value);
  				if(subject2!=subject&&subject2!=null){
  					//console.log("test");
  					var array = new Array(data);
  					for (i = 0; i < inputnum2; i = i +1){
//  						eval("console.log(data_"+i+");");
  						eval("array.push(data_"+i+");");
  						eval("data_"+i+"=null;");
  					}
  					all_data.push(array);
//  					String data_str = new String (data_object);
//  					console.log("主語数");
//  					console.log(data_object);
//  					var array = new Array(data1_object,data2_object);
//  					all_data.push(array);
//  					console.log(name_object);
//  					console.log(data_object);
//  					data1_object=null;
//  					data2_object=null;
  				}

  				if(p.search(val_side)!="-1"){
//  					console.log(val);
  					var data=res_graph.results.bindings[key].o.value;
  				}
  				for (i = 0; i < inputnum2; i = i +1){
  					//console.log(i);
  					eval("if(p.search(val"+i+")!='-1'){var data"+i+"=res_graph.results.bindings[key].o.value;data_"+i+"=Number(data"+i+");var check1 = isNaN(data_"+i+");}");
//  					eval("if(p.search(val"+i+")!='-1'){console.log(res_graph.results.bindings[key].o.value);console.log('sakoさん');}");
  					//eval("console.log(val"+i+");");
//  					eval("data_"+i+"=Number(data"+i+");");
//  					eval("var check1 = isNaN(data_"+i+");");
//  					console.log(check1);
  					if(check1==true){
  						check=true;
  					};
  					check1==false;
//  					console.log(check1);
  				}
  				subject2=res_graph.results.bindings[key].s.value;
  			}
  			if(check==true){
  				alert("不適切なプロパティがあります。");
  			};
  		    //------------------------------------------------------------------------------------------------------データセットここまで
//  		 console.log(all_data);

  	/*   var data = google.visualization.arrayToDataTable([
  	     ['Year', 'Sales', 'Expenses','sako'],
  	     ['2004',  1000,      400,1000],
  	     ['2005',  ,      460,10],
  	     ['2006',  660,       1120,10],
  	     ['2007',  1030,      540,10]
  	   ]);*/
  	   var data = google.visualization.arrayToDataTable(all_data);
  	   var options = {
  	     title: graph_title,
  	   height:divH,
  	     hAxis: {title: val_side, titleTextStyle: {color: 'red'}}
  	   };

       var chart = new google.visualization.BarChart(document.getElementById('bar2_chart_div'));
  	   chart.draw(data, options);
  	 }
  	 }
  	function sel_append2(){
//  		console.log("sakoさん");
  		console.log(pro_sel);
  		if(pro_sel!=null){
  			var selId="g4_"+inputnum2;
  			$("div#graph4_sel").append("<select id='"+selId+"'class='property'></select>");
//  			console.log(pro_sel);
  			selId="select#g4_"+inputnum2;
//  			$('select.property option').remove();
  			for ( var i = 0; i< pro_sel.length; ++i ) {//データ追加
//  				console.log(p_result_graph[i]);
  				$(selId).append($("<option>").html(pro_sel[i]).val(pro_sel[i]));
  			}
  			delnum2=inputnum2;
  			inputnum2++;
  		}else{
  			alert("クラスを選択してください。");
  		}
  	}
  	function sel_del2(){
  		if(delnum2>0){
  			var selId="#g4_"+delnum2;
  			$("select").remove(selId);
  			inputnum2=inputnum2-1;
  			delnum2=delnum2-1;
  		}else{
  			alert("これ以上削除できません");
  		}
  	}
    //----------------------------------------------------------------------------------------------------------------------------------------------------------円

 //     google.setOnLoadCallback(drawChart7);
      function drawChart5() {
    		//------------------------------------------------------------------------------------------------------棒グラフ用変数宣言
    			var data;
    			var options;
    			var chart1;
    			var check1=false;
    			var check=false;
    			var container = document.getElementById("graph");
    			var divH=container.offsetHeight;
    			divH=divH-100;
    		    //------------------------------------------------------------------------------------------------------ここまで
    		    //------------------------------------------------------------------------------------------------------データセット用変数宣言
    			var subject=null;
    			var subject2=null;
    			var all_data=[];
    			var subject2=null;
    			var val_side = $("select#g5").val();//縦
//    			console.log(val);
    			var array = new Array(val_side);
//    			var val2 = $("select#sel4").val();//横
//    			console.log(inputnum1);

    			for (i = 0; i < inputnum3; i = i +1){
    				var val = "select#g5_"+i;
    				var val_i = $(val).val();
    				eval("var val"+i+"=val_i;");
    				console.log(val_i);
    				array.push(val_i);
    			}

   // 			console.log(array);
    //			console.log(inputnum1);

//    			console.log(val1);
//    			console.log(val2);
    			all_data.push(array);
//    			console.log(all_data);
    		    //------------------------------------------------------------------------------------------------------ここまで
    		    //------------------------------------------------------------------------------------------------------データセット

    			if(res_graph==null){
    				alert("クラスを指定してください");
    			}else{
    			for(var key in res_graph.results.bindings){
//    				console.log(key);
    				subject=res_graph.results.bindings[key].s.value;
    				var p=new String(res_graph.results.bindings[key].p.value);
    				if(subject2!=subject&&subject2!=null){
    					//console.log("test");
    					var array = new Array(data);
    					for (i = 0; i < inputnum3; i = i +1){
//    						eval("console.log(data_"+i+");");
    						eval("array.push(data_"+i+");");
    						eval("data_"+i+"=null;");
    					}
    					all_data.push(array);
//    					String data_str = new String (data_object);
//    					console.log("主語数");
//    					console.log(data_object);
//    					var array = new Array(data1_object,data2_object);
//    					all_data.push(array);
//    					console.log(name_object);
//    					console.log(data_object);
//    					data1_object=null;
//    					data2_object=null;
    				}

    				if(p.search(val_side)!="-1"){
//    					console.log(val);
    					var data=res_graph.results.bindings[key].o.value;
    				}
    				for (i = 0; i < inputnum3; i = i +1){
    					//console.log(i);
    					eval("if(p.search(val"+i+")!='-1'){var data"+i+"=res_graph.results.bindings[key].o.value;data_"+i+"=Number(data"+i+");var check1 = isNaN(data_"+i+");}");
//    					eval("if(p.search(val"+i+")!='-1'){console.log(res_graph.results.bindings[key].o.value);console.log('sakoさん');}");
    					//eval("console.log(val"+i+");");
//    					eval("data_"+i+"=Number(data"+i+");");
//    					eval("var check1 = isNaN(data_"+i+");");
//    					console.log(check1);
    					if(check1==true){
    						check=true;
    					};
    					check1==false;
//    					console.log(check1);
    				}
    				subject2=res_graph.results.bindings[key].s.value;
    			}
    			if(check==true){
    				alert("不適切なプロパティがあります。");
    			};
    		    //------------------------------------------------------------------------------------------------------データセットここまで
//    		 console.log(all_data);

    	/*   var data = google.visualization.arrayToDataTable([
    	     ['Year', 'Sales', 'Expenses','sako'],
    	     ['2004',  1000,      400,1000],
    	     ['2005',  ,      460,10],
    	     ['2006',  660,       1120,10],
    	     ['2007',  1030,      540,10]
    	   ]);*/
    	   var data = google.visualization.arrayToDataTable(all_data);
    	   var options = {
    	     title: graph_title,
    	     height:divH,
    	     hAxis: {title: val_side, titleTextStyle: {color: 'red'}}
    	   };

           var chart = new google.visualization.LineChart(document.getElementById('Line_chart_div'));
    	   chart.draw(data, options);
    	 }
    	 }
    	function sel_append3(){
//    		console.log("sakoさん");
    		console.log(pro_sel);
    		if(pro_sel!=null){
    			var selId="g5_"+inputnum3;
    			$("div#graph5_sel").append("<select id='"+selId+"'class='property'></select>");
//    			console.log(pro_sel);
    			selId="select#g5_"+inputnum3;
//    			$('select.property option').remove();
    			for ( var i = 0; i< pro_sel.length; ++i ) {//データ追加
//    				console.log(p_result_graph[i]);
    				$(selId).append($("<option>").html(pro_sel[i]).val(pro_sel[i]));
    			}
    			delnum3=inputnum3;
    			inputnum3++;
    		}else{
    			alert("クラスを選択してください。");
    		}
    	}
    	function sel_del3(){
    		if(delnum3>0){
    			var selId="#g5_"+delnum3;
    			$("select").remove(selId);
    			inputnum3=inputnum3-1;
    			delnum3=delnum3-1;
    		}else{
    			alert("これ以上削除できません");
    		}
    	}
      
      /*
      function drawChart7() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]);

        var options = {
          title: 'Company Performance',
        //------------------------曲線設定ここから
          curveType: 'function',
          legend: { position: 'bottom' }
        //------------------------ここまで

        };

        var chart = new google.visualization.LineChart(document.getElementById('Line_chart_div'));
        chart.draw(data, options);
      }
      */
//----------------------------------------------------------------------------------------------------------------------------------------------------------テーブル
google.load('visualization', '1', {packages:['table']});
//      google.setOnLoadCallback(drawTable8);
      function drawTable8() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Salary');
        data.addColumn('boolean', 'Full Time Employee');
        data.addRows([
          ['Mike',  {v: 10000, f: '$10,000'}, true],
          ['Jim',   {v:8000,   f: '$8,000'},  false],
          ['Alice', {v: 12500, f: '$12,500'}, true],
          ['Bob',   {v: 7000,  f: '$7,000'},  true]
        ]);

        var table = new google.visualization.Table(document.getElementById('table_div'));
        table.draw(data, {showRowNumber: true});
      }