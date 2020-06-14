

var days_of_week = new Array(7);
days_of_week[0] = "Sunday";
days_of_week[1] = "Monday";
days_of_week[2] = "Tuesday";
days_of_week[3] = "Wednesday";
days_of_week[4] = "Thursday";
days_of_week[5] = "Friday";
days_of_week[6] = "Saturday";

dayOfWeek=function(y,m,d) {
	//javascript uses 0-based months ; 0=jan, 1=feb, .... 11=Dec
	var d = new Date(y,m-1,d);
	return d.getDay();
	}

var keys=["Congress number","Day","Month","Number Democrat Nays","Number Democrat Yeas","Number Missing Votes (not voting and not in Congress)","Number Nays","Number Northern Democrat Nays","Number Northern Democrat Yeas","Number Northern Republican Nays","Number Northern Republican Yeas","Number Republican Nays","Number Republican Yeas","Number Southern Democrat Nays","Number Southern Democrat Yeas (11 States of Confederacy plus KY and OK)","Number Southern Republican Nays","Number Southern Republican Yeas (11 States of Confederacy plus KY and OK)","Number Yeas","Roll Call number","Year"]
/*
Congress number
Day
Month
Number Democrat Nays
Number Democrat Yeas
Number Missing Votes (not voting and not in Congress)
Number Nays
Number Northern Democrat Nays
Number Northern Democrat Yeas
Number Northern Republican Nays
Number Northern Republican Yeas
Number Republican Nays
Number Republican Yeas
Number Southern Democrat Nays
Number Southern Democrat Yeas (11 States of Confederacy plus KY and OK)
Number Southern Republican Nays
Number Southern Republican Yeas (11 States of Confederacy plus KY and OK)
Number Yeas
Roll Call number
Year
*/



getRecVal=function(rec,key_name)
	{
	key_idx=keys.indexOf(key_name);
	return rec[key_idx];
	}


getFractionWhoVoted=function(rec)
	{
	/*
		To arrive at the fraction who voted compute sum(yeas,nays)/sum(yeas,nays,missing)
	*/
	var sum_ya=getRecVal(rec,'Number Yeas');
	var sum_na=getRecVal(rec,'Number Nays');
	var sum_miss=getRecVal(rec,'Number Missing Votes (not voting and not in Congress)');

	var numerator=sum_ya+sum_na;
	var denominator=sum_ya+sum_na+sum_miss;

	var rate=numerator/denominator;
	return rate;
	}


//- Eddie: heat map:  for day of week and time of year; filter R/D/Neither/All
