	function date2ymdh( date1) {
        var theYear		 = date1.getFullYear();
        var theMonth	 = date1.getMonth()+1;
        var theDate		 = date1.getDate();
        var theDay		 = date1.getDay();
        var theHour		 = date1.getHours();
        var theMinutes	 = date1.getMinutes();
        var theSec		 = date1.getSeconds();

        if (theMonth   < 10) theMonth   = "0" + theMonth;
        if (theDate    < 10) theDate    = "0" + theDate;
        if (theHour    < 10) theHour    = "0" + theHour;
        if (theMinutes < 10) theMinutes = "0" + theMinutes;
        if (theSec     < 10) theSec     = "0" + theSec;

        var sdate = ""+theYear+"-"+
        	theMonth+"-"+
        	theDate+" "+
        	theHour+":"+
        	theMinutes+":"+
           	theSec;
        return sdate;
	}

	function sort_tos (arr2, sortkey, direction) {
		arr2.sort(function(a, b){
		    var x = a[sortkey];
		    var y = b[sortkey];
		    if (x < y) return (1 * direction);
		    if (x > y) return (-1 * direction);
		    return 0;
		});
	}
