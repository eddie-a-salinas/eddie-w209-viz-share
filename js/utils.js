

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

dayOfWeek=function(y,m,d) {
	//javascript uses 0-based months ; 0=jan, 1=feb, .... 11=Dec
	var d = new Date(y,m-1,d);
	return d.getDay();
	}



/*
////////////////////////////////
HOW TO USE dayOfWeek function
for(var dom=1;dom<=31;dom++)
	{
	var y=2020;
	var m=4;
	var dow=dayOfWeek(y,m,dom);
	console.log("for may "+dom+" 2020, day of week is "+weekday[dow]);
	}*/
