
console.log("in main_test.js ");

var getDeskWidth=function()
	{
	var desk_width=14;
	return desk_width;
	}

var eddie_func=function()
	{
	console.log("test eddie");
	}


///bin/echo "SELECT congress,chamber,MIN(CAST(rollnumber AS INT)) AS MIN_ROLL,MAX(CAST(rollnumber AS INT)) AS MAX_ROLL FROM rollcalls GROUP BY congress,chamber ORDER BY CAST(congress AS INT) ASC;" |sqlite3 ../data/cong_data.db  | tr "|" ","|sed -r "s/,/\",\"/g"| awk '{print "[\"" $0 "\"]," }'|grep -Pv 'MIN_ROLL'

const cong_min_max_rollnums=[
	["1","House","1","109"],
	["1","Senate","1","100"],
	["2","House","1","102"],
	["2","Senate","1","52"],
	["3","House","1","69"],
	["3","Senate","1","79"],
	["4","House","1","83"],
	["4","Senate","1","86"],
	["5","House","1","155"],
	["5","Senate","1","202"],
	["6","House","1","96"],
	["6","Senate","1","120"],
	["7","House","1","142"],
	["7","Senate","1","88"],
	["8","House","1","132"],
	["8","Senate","1","150"],
	["9","House","1","158"],
	["9","Senate","1","88"],
	["10","House","1","237"],
	["10","Senate","1","91"],
	["11","House","1","293"],
	["11","Senate","1","167"],
	["12","House","1","314"],
	["12","Senate","1","204"],
	["13","House","1","352"],
	["13","Senate","1","263"],
	["14","House","1","113"],
	["14","Senate","1","189"],
	["15","House","1","106"],
	["15","Senate","1","132"],
	["16","House","1","147"],
	["16","Senate","1","120"],
	["17","House","1","95"],
	["17","Senate","1","91"],
	["18","House","1","94"],
	["18","Senate","1","178"],
	["19","House","1","111"],
	["19","Senate","1","234"],
	["20","House","1","233"],
	["20","Senate","1","238"],
	["21","House","1","273"],
	["21","Senate","1","277"],
	["22","House","1","462"],
	["22","Senate","1","422"],
	["23","House","1","327"],
	["23","Senate","1","229"],
	["24","House","1","459"],
	["24","Senate","1","439"],
	["25","House","1","475"],
	["25","Senate","1","410"],
	["26","House","1","751"],
	["26","Senate","1","334"],
	["27","House","1","974"],
	["27","Senate","1","822"],
	["28","House","1","597"],
	["28","Senate","1","305"],
	["29","House","1","642"],
	["29","Senate","1","383"],
	["30","House","1","478"],
	["30","Senate","1","344"],
	["31","House","1","572"],
	["31","Senate","1","499"],
	["32","House","1","455"],
	["32","Senate","1","358"],
	["33","House","1","607"],
	["33","Senate","1","546"],
	["34","House","1","729"],
	["34","Senate","1","449"],
	["35","House","1","548"],
	["35","Senate","1","702"],
	["36","House","1","433"],
	["36","Senate","1","607"],
	["37","House","1","638"],
	["37","Senate","1","801"],
	["38","House","1","600"],
	["38","Senate","1","598"],
	["39","House","1","613"],
	["39","Senate","1","501"],
	["40","House","1","717"],
	["40","Senate","1","716"],
	["41","House","1","634"],
	["41","Senate","1","742"],
	["42","House","1","517"],
	["42","Senate","1","803"],
	["43","House","1","475"],
	["43","Senate","1","420"],
	["44","House","1","328"],
	["44","Senate","1","434"],
	["45","House","1","377"],
	["45","Senate","1","585"],
	["46","House","1","439"],
	["46","Senate","1","570"],
	["47","House","1","349"],
	["47","Senate","1","986"],
	["48","House","1","334"],
	["48","Senate","1","428"],
	["49","House","1","306"],
	["49","Senate","1","461"],
	["50","House","1","320"],
	["50","Senate","1","389"],
	["51","House","1","587"],
	["51","Senate","1","526"],
	["52","House","1","304"],
	["52","Senate","1","209"],
	["53","House","1","373"],
	["53","Senate","1","561"],
	["54","House","1","162"],
	["54","Senate","1","197"],
	["55","House","1","183"],
	["55","Senate","1","381"],
	["56","House","1","149"],
	["56","Senate","1","169"],
	["57","House","1","185"],
	["57","Senate","1","118"],
	["58","House","1","87"],
	["58","Senate","1","92"],
	["59","House","1","136"],
	["59","Senate","1","128"],
	["60","House","1","312"],
	["60","Senate","1","84"],
	["61","House","1","202"],
	["61","Senate","1","268"],
	["62","House","1","262"],
	["62","Senate","1","396"],
	["63","House","1","282"],
	["63","Senate","1","572"],
	["64","House","1","157"],
	["64","Senate","1","406"],
	["65","House","1","266"],
	["65","Senate","1","384"],
	["66","House","1","339"],
	["66","Senate","1","407"],
	["67","House","1","362"],
	["67","Senate","1","751"],
	["68","House","1","179"],
	["68","Senate","1","235"],
	["69","House","1","114"],
	["69","Senate","1","236"],
	["70","House","1","72"],
	["70","Senate","1","191"],
	["71","House","1","103"],
	["71","Senate","1","436"],
	["72","House","1","123"],
	["72","Senate","1","280"],
	["73","House","1","143"],
	["73","Senate","1","228"],
	["74","House","1","212"],
	["74","Senate","1","193"],
	["75","House","1","158"],
	["75","Senate","1","174"],
	["76","House","1","227"],
	["76","Senate","1","266"],
	["77","House","1","152"],
	["77","Senate","1","192"],
	["78","House","1","156"],
	["78","Senate","1","220"],
	["79","House","1","231"],
	["79","Senate","1","244"],
	["80","House","1","163"],
	["80","Senate","1","248"],
	["81","House","1","275"],
	["81","Senate","1","455"],
	["82","House","1","181"],
	["82","Senate","1","313"],
	["83","House","1","147"],
	["83","Senate","1","271"],
	["84","House","1","149"],
	["84","Senate","1","217"],
	["85","House","1","193"],
	["85","Senate","1","307"],
	["86","House","1","180"],
	["86","Senate","1","422"],
	["87","House","1","240"],
	["87","Senate","1","428"],
	["88","House","1","232"],
	["88","Senate","1","534"],
	["89","House","1","394"],
	["89","Senate","1","497"],
	["90","House","1","478"],
	["90","Senate","1","596"],
	["91","House","1","443"],
	["91","Senate","1","666"],
	["92","House","1","649"],
	["92","Senate","1","955"],
	["93","House","1","1078"],
	["93","Senate","1","1138"],
	["94","House","1","1273"],
	["94","Senate","1","1311"],
	["95","House","1","1540"],
	["95","Senate","1","1156"],
	["96","House","1","1276"],
	["96","Senate","1","1054"],
	["97","House","1","812"],
	["97","Senate","1","966"],
	["98","House","1","906"],
	["98","Senate","1","663"],
	["99","House","1","890"],
	["99","Senate","1","740"],
	["100","House","1","939"],
	["100","Senate","1","799"],
	["101","House","1","879"],
	["101","Senate","1","638"],
	["102","House","1","901"],
	["102","Senate","1","550"],
	["103","House","1","1094"],
	["103","Senate","1","724"],
	["104","House","1","1321"],
	["104","Senate","1","919"],
	["105","House","1","1166"],
	["105","Senate","1","612"],
	["106","House","1","1209"],
	["106","Senate","1","672"],
	["107","House","1","990"],
	["107","Senate","1","633"],
	["108","House","1","1218"],
	["108","Senate","1","675"],
	["109","House","1","1210"],
	["109","Senate","1","645"],
	["110","House","1","1865"],
	["110","Senate","1","657"],
	["111","House","1","1647"],
	["111","Senate","1","696"],
	["112","House","1","1602"],
	["112","Senate","1","486"],
	["113","House","1","1202"],
	["113","Senate","1","657"],
	["114","House","1","1322"],
	["114","Senate","1","502"],
	["115","House","1","1207"],
	["115","Senate","1","599"],
	["116","House","1","808"],
	["116","Senate","1","530"]
	];


var ordinalNum=function(d)
	{
	d=""+d+"";
	ew_obj={
		"1":"st",
		"2":"nd",
		"3":"rd"
		}
	for(const [key, value] of Object.entries(ew_obj))
		{
		if(d.endsWith(key)) {
			return d+value;
			}
		}
	if(d=="0")
		{
		return d;
		}
	else
		{
		return d+"th";
		}
	}


var getMMRollCallSelectionDDFromGivenCongress=function(cong_int,chamber)
	{
	var fchamber="";
	if(chamber=="senate")
		{
		fchamber="Senate";
		}
	else
		{
		fchamber="House";
		}
	var targetCMM=cong_min_max_rollnums.filter(function(d)
		{
		var cong=parseInt(d[0]);
		var chamb=d[1];
		if(cong==cong_int && chamb==fchamber)
			{
			return true;
			}
		return false;
		});
	//console.log("in get MM For cong_int = "+cong_int+" and chamber = "+chamber+", the filtered is "+targetCMM);
	if(targetCMM.length!=1)
		{
		alert("Error in acquiring number roll calls for congress "+cong_int+" in the "+chamber);
		return [-1,-1];
		}
	else
		{
		var min_roll=parseInt(targetCMM[0][2]);
		var max_roll=parseInt(targetCMM[0][3]);
		return [min_roll,max_roll];
		}
	}
