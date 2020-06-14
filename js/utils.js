

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


//https://paulund.co.uk/how-to-capitalize-the-first-letter-of-a-string-in-javascript#:~:text=var%20uppercaseFirstLetter%20%3D%20string.,and%20remove%20the%20first%20letter.
function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


getSeason=function(d,m)
	{
	if(m==1 || m==2)
		{
		return 'winter';
		}
	else if(m==3)
		{
		if(d<20)
			{
			return 'winter';
			}
		else
			{
			return 'spring' ;
			}
		}
	else if(m==4 || m==5)
		{
		return 'spring';
		}
	else if(m==6)
		{
		if(d<20)
			{
			return 'spring';
			}
		else
			{
			return 'summer';
			}
		}
	else if(m==7 || m==8)
		{
		return 'summer';
		}
	else if(m==9)
		{
		if(d<22)
			{
			return 'summer';
			}
		else
			{
			return 'fall';
			}
		}
	else if(m==10 || m==11)
		{
		return 'fall';
		}
	else if(m==12)
		{
		if(d<21)
			{
			return 'fall';
			}
		else
			{
			return 'winter';
			}
		}
	alert('error in day to season!');
	}



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
