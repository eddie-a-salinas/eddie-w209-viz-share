
var get_party_colors=function(){
	var party_colors={'Republican':'red','Democrat':'blue','Independent':'green'};
	return party_colors;
	}


//https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
var getKeyByValue=function(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}




var cast_code_lookup ={
	0:"Not a member of the chamber when this vote was taken",
	1:"Yea",
	2:"Paired Yea",
	3:"Announced Yea",
	4:"Announced Nay",
	5:"Paired Nay",
	6:"Nay",
	7:"Present (some Congresses)",
	8:"Present (some Congresses)",
	9:"Not Voting (Abstention)",
	}


var cast_code_to_color=function(cc,party_colors_map,party) {
	/*console.log("cast_code_to_color called");
	console.log("cast_code_to_color with cc="+cc);
	console.log("cast_code_to_color called with map as : "+JSON.stringify(party_colors_map));
	console.log("cast_code_to_color called with party  as : "+party);*/
	if(cc==1)
		{
		//yay
		var cc1ret="purple";
		if(party in party_colors_map)
			{
			cc1ret=party_colors_map[party];
			}
		else
			{
			cc1ret="purple";
			}
		//console.log("Returning party color : "+cc1ret);
		return cc1ret;
		}
	else if(cc==6)
		{
		//nay
		return 'white';
		}
	else if(cc==9)
		{
		//absent!
		return 'grey';
		}
	else
		{
		return 'yellow';
		}
	}


var installSeatLegend=function(div_id,svg_dim)
	{
	console.log("start installSeatLegend");
	var parties=["Democrat"];
	var castCodes=[1,6,9,-1];
	var castDescs=["Yay","Nay","Absent","Other (e.g. 'present' or 'announced')"];
	var table_html="<table><thead></thead>";
	for(var c=0;c<castCodes.length;c++)
		{
		table_html+="<tr>";
		table_html+="<td>"+castDescs[c]+"</td>";

		for(var p=0;p<parties.length;p++)
			{
			var svg_fill_color=cast_code_to_color(castCodes[c],get_party_colors(),parties[p]);
			if(c==0) { svg_fill_color="black"; }
			console.log("Svg rect fill color is "+svg_fill_color);
			table_html+="<td>";
				table_html+="<svg width="+svg_dim+" height="+svg_dim+">";
				table_html+="<rect x=0 y=0  width="+svg_dim+" height="+svg_dim+" style=\"stroke:black; fill:"+svg_fill_color+"; \" ></rect>";
				table_html+="</svg>";
			table_html+="</td>";
			}
		//table_html+="<td>Republican "+castDescs[c]+"</td>";
		table_html+="</tr>";		
		}
	table_html+="</table>";
	$('#'+div_id).html(table_html);
	console.log("finish installSeatLegend");		
	}


degrees_to_radians=function(d)
	{
	var radians=d*Math.PI/180.0;
	return radians;
	}



var getCastCodeFromEng=function(e)
	{
	if(e=="Not Voting")
		{
		return getKeyByValue(cast_code_lookup,"Not Voting (Abstention)");
		}
	return getKeyByValue(cast_code_lookup, e)
	}



polar_to_cart=function(r,t)
	{
	//Math.sin()
	var radians=degrees_to_radians(t);
	var y=r*Math.sin(radians);
	var x=r*Math.cos(radians);
	return [x,y];
	}



max_desk_per_hemicirc=function(desk_width,r)
	{
	   var numerator=Math.PI*r;
	   var  denominator=2.0*desk_width;
	   var result=Math.floor(numerator/denominator)-3;
	   if(result<=0)
		{
		return 0;
		}
	    else
		{
		return result;
		}
	}






var make_seat_info=function(desk_width,num_seats_desired)
	{
	ring_radii=[];
	//console.log('gtrr ');
	var rr_stop=desk_width*1000;
	for(var i=15;i<rr_stop;i+=2)
		{
		var temp=i*desk_width;
		ring_radii.push(temp);
		var max_cap=ring_radii.map(x=>max_desk_per_hemicirc(desk_width,x)).reduce(function(a,b) { return a+b;});
		if(num_seats_desired<max_cap)
			{
			i=rr_stop+1;
			}
		}
	//console.log("ring radii : "+ring_radii);
	var dprs=[];
	degrees=[];
	for(r in ring_radii)
		{
		var radius=ring_radii[r];
		//console.log('a radius '+radius);
		var dpr=max_desk_per_hemicirc(desk_width,radius);
		dprs.push(dpr);
		var degrees_delta=180/dpr;
	    	var degrees_start=degrees_delta/2;
		degrees_start-=(degrees_start/3);
		var degrees_here=[];
		for(var i=0;i<dpr;i++)
			{
			degrees_here.push(degrees_start+degrees_delta*i);
			}
		degrees.push(degrees_here)
		}


	var make_g_dr=function(degrees_to_use,radius_to_use,ring_id,id_within_ring)
		{
		var temp_g={};
		var carts_tx=polar_to_cart(radius_to_use,degrees_to_use);
		var x_tx=carts_tx[0];
		var y_tx=carts_tx[1];
		var tx_str='translate('+x_tx+','+y_tx+') rotate('+degrees_to_use+')';
		var rect_x=-desk_width/2.0;
		var rect_y=0;
		var temp_g={};
		temp_g['ring']=ring_id;
		temp_g['id_ring']=id_within_ring;
		temp_g['transform']=tx_str;
		temp_g['degrees']=degrees_to_use;
		var rect={};
		rect['x']=rect_x;
		rect['y']=rect_y;
		rect['width']=desk_width;
		rect['height']=desk_width;
		temp_g['rect']=rect;
		return temp_g;
		}


	var ret_pkg={};
	var gs=[];
	ret_pkg['num_rings']=dprs.length;
	ret_pkg['num_per_ring']={};
	ret_pkg['num_per_ring_full']={};
	var seat_id=0;
	for(var ring_id=0;ring_id<dprs.length;ring_id++)
		{
		//console.log('on ring '+ring_id);
		var degree_list=degrees[ring_id];
		//console.log('degree list : '+degree_list);
		for(var d=0;d<degree_list.length;d++)
			{
			ret_pkg['num_per_ring']['ring_'+ring_id]=d+1;
			ret_pkg['num_per_ring_full']['ring_'+ring_id]=degree_list.length;
			var degrees_to_use=degree_list[d];
			var radius_to_use=ring_radii[ring_id];
			var temp_g=make_g_dr(degrees_to_use,radius_to_use,ring_id,d);
			//temp_g['seat_id']=gs.length;
			gs.push(temp_g);
			if(gs.length>=num_seats_desired)
				{
				d=degree_list.length+1;
				ring_id=dprs.length+1;
				}
			}	
		}

	//adjust last ring if necessary
	var last_ring_desks=gs.filter(x=>x['ring']==ret_pkg['num_rings']-1);
	var num_desks_last_ring=last_ring_desks.length;
	//console.log('num desks last ring is '+num_desks_last_ring);
	//console.log('nprf looks like '+JSON.stringify(ret_pkg['num_per_ring_full']));
	var num_full_last_ring=ret_pkg['num_per_ring_full']['ring_'+(ret_pkg['num_rings']-1)];
	var id_of_last_ring=ret_pkg['num_rings']-1;
	//console.log('id_of_last ring is '+id_of_last_ring);
	//console.log('num desks if last ring is full : '+num_full_last_ring);
	if(num_desks_last_ring<num_full_last_ring)
		{
		//console.log('re adjust last ring');
		var degrees_delta=180/num_desks_last_ring;
		var degrees_start=degrees_delta/2;
		degrees_start-=(degrees_start/3);
		var readj_degrees=Array(num_desks_last_ring);
		for(var r=0;r<readj_degrees.length;r++)
			{
			readj_degrees[r]=degrees_start+degrees_delta*r;
			}
		var start_last_r_idx=gs.length-num_desks_last_ring;
		var radius_to_use=ring_radii[ring_radii.length-1];
		var r_idx=0;
		for(var x=start_last_r_idx;x<gs.length;x++)
			{
			gs[x]=make_g_dr(readj_degrees[r_idx],radius_to_use,id_of_last_ring,gs.length-num_desks_last_ring);
			r_idx++;
			}

		}
	else
		{
		//console.log('no readjust necessary!');
		}

	for(var s=0;s<gs.length;s++)
		{
		gs[s]['seat_id']=s;
		}
	ret_pkg['data']=gs;
	//console.log('gs_data :\n'+JSON.stringify(ret_pkg));
	return ret_pkg;
	}






makeRandomVoters=function(n,f_rep)
	{
	var voters=[];
	for(var v=0;v<n;v++)
		{
		if(Math.random()<=f_rep)
			{
			voters.push({'party':'rep'});
			}
		else
			{
			voters.push({'party':'dem'});
			}
		voters[voters.length-1]['name']='v_'+(v+1);
		}
	return voters;
	}

partition_by_party=function(voters)
	{
	var partition={};
	for(var v=0;v<voters.length;v++)
		{
		var this_voters_party=voters[v]['party'];
		if(!(this_voters_party in partition))
			{
			partition[this_voters_party]=[];
			}
		partition[this_voters_party].push(voters[v]);
		}
	for(party in partition)
		{
		partition[party].sort(function(a,b) {
			return a['vote']-b['vote'];
			});
		}
	return partition;
	}


assign_seats=function(seat_data,voters)
	{
	var voters_by_party=partition_by_party(voters);	
	var num_seats=seat_data['data'].length;
	if(num_seats!=voters.length)
		{
		alert('cannot assign seats! #voters='+voters.length+' ; #seats='+num_seats);
		return null;
		}
	var num_rings=seat_data['num_rings'];
	//console.log('AS num rings '+num_rings);
	if(num_rings==1)
		{
		//partition by party, assign one after the other party by party
		var num_assn_so_far=0;
		for(party in voters_by_party)
			{
			//console.log('considering party '+party);
			for(var p=0;p<voters_by_party[party].length;p++)
				{
				voters_by_party[party][p]['id_ring']=p+num_assn_so_far;
				voters_by_party[party][p]['ring']=0;
				num_assn_so_far++;
				}
			}
		//console.log("vbp : "+JSON.stringify(voters_by_party));
		}//for only one ring
	else
		{
		//partition seats by ring
		var seats_by_ring={};
		var curr_ring_idx={};
		for(var r=0;r<num_rings;r++)
			{
			seats_by_r=seat_data['data'].filter(s=>s['ring']==r);
			seats_by_ring[r]=seats_by_r;
			curr_ring_idx[r]=0;
			}
		//console.log('seats by ring : '+JSON.stringify(seats_by_ring));
		var last_seat=null;
		//last_seat represents last seat assigned 
		var curr_ring=0;
		var party_by_priority=["Republican","Democrat"];
		for(party in voters_by_party)
			{
			//console.log('Consider adding '+party);
			if(party_by_priority.indexOf(party)==(-1))
				{
				party_by_priority.push(party);
				}
			}
		//console.log("PVP is "+JSON.stringify(party_by_priority));
		//for(party in voters_by_party)
		for(var p=0;p<party_by_priority.length;p++)
			{
			party=party_by_priority[p];
			//console.log('now to assign voters for party '+party);
			for(var v=0;v<voters_by_party[party].length;v++)
				{
				//look at seat in current ring, if less than or equal to degrees than last seat, then assign, else skip
				if(last_seat==null)
					{
					voters_by_party[party][v]['seat_id']=0;
					last_seat=seats_by_ring[0][0];
					curr_ring_idx[0]=1;
					curr_ring=1;
					//console.log('new last seat : '+JSON.stringify(last_seat));
					//new last seat : {"ring":0,"id_ring":0,"transform":"translate(149,7) rotate(3)","degrees":3,"rect":{"x":-5,"y":0,"width":10,"height":10},"seat_id":0}
					}
				else
					{
					//look at the last seat's degrees value
					var last_assigned_seat_degrees=last_seat['degrees'];
					//candidate seats come from remaining rings (at curr indices) except from the ring of the previously assigned seat
					var candidate_seats=[];
					for(var r=0;r<num_rings;r++)
						{
						if(r==last_seat['ring'])
							{
							//skip
							}
						else
							{
							candidate_seats.push(seats_by_ring[r][curr_ring_idx[r]]);
							}
						}
					//console.log('candidate seats : '+JSON.stringify(candidate_seats));
					var candidates_seats_lower_degree_first=candidate_seats.sort(function(a,b) { return a['degrees']-b['degrees'];});
					//console.log('candidate seats increasing degree : '+JSON.stringify(candidates_seats_lower_degree_first))
					voters_by_party[party][v]['seat_id']=candidates_seats_lower_degree_first[0]['seat_id'];
					last_seat=candidates_seats_lower_degree_first[0];
					curr_ring_idx[candidates_seats_lower_degree_first[0]['ring']]++;
					curr_ring=candidates_seats_lower_degree_first[0]['ring'];
					}				
				}
			}
		}//for multiple rings

	//console.log(JSON.stringify(voters_by_party));
	var voters_to_return=[];
	for(party in voters_by_party)
		{
		for(var p=0;p<voters_by_party[party].length;p++)
			{
			voters_to_return.push(voters_by_party[party][p]);
			}
		}
	if(voters_to_return.length==seat_data['data'].length)
		{
		//console.log('num voters assigned seats is same as number seats');
		}
	else
		{
		alert('DIFFER in num voters assigned seats is same as number seats');
		}
	//make sure that mapping is 1-1
	for(v=0;v<voters_to_return.length;v++)
		{
		var this_voters_seat_id=voters_to_return[v]['seat_id'];
		if(this_voters_seat_id>=0 && this_voters_seat_id<voters_to_return.length)
			{
			//in range and assigned to one seat
			}
		else
			{
			//out of range!
			//console.log('out of range seat assignment for voter '+JSON.stringify(voters_to_return[v]));
			}
		}
	for(var s=0;s<seat_data['data'].length;s++)
		{
		var a_seat_id=s;
		var voters_assigned_this_seat=voters_to_return.filter(x=>x['seat_id']==a_seat_id);
		//console.log('For seat '+a_seat_id+', voter assigned to it is '+JSON.stringify(voters_assigned_this_seat));
		if(voters_assigned_this_seat.length==1)
			{
			//only one voter assigned to the seat! good!
			}
		else
			{
			alert('Seat with ID '+a_seat_id+' has multiple voters assigned to it : '+JSON.stringify(voters_assigned_this_seat));
			}
		}
	return voters_to_return;
	}



var update_seat_svg=function(svg_id,data_arr,trx_x,trx_y) {
	//console.log("d is "+JSON.stringify(d));
/*{"congress":"100","chamber":"Senate","icpsr":"7638","state_icpsr":"25","district_code":"0","state_abbrev":"WI","party_code":
"100","occupancy":"0","last_means":"1","bioname":"PROXMIRE, William","bioguide_id":"P000553","born":"1915","died":"2005","nominate_dim1":"-0.598","nominate_dim2":"0.801",
"nominate_log_likelihood":"-475.8294","nominate_geo_mean_probability":"0.473","nominate_number_of_votes":"636","nominate_number_of_errors":"210",
"conditional":"","nokken_poole_dim1":"-0.613","nokken_poole_dim2":"0.79","rollnumber":"799","cast_code":"1","prob":"7.3"}*/
	var d=data_arr;
	/*d=d.map(function(x)  {
		x['party']=x['party_name'];
		console.log("To return : "+JSON.stringify(x));
		return x;
		});*/
	voters=[];
	for(var v=0;v<d.length;v++)
		{
		var vname=d[v]['bioname']+" of "+d[v]['state_abbrev'];
		var vparty=d[v]['party_name'];
		/*if(vparty=="Democrat")
			{
			vparty="Democrat";
			}
		else if(vparty=="Republican")
			{
			vparty="Republican";
			}
		else
			{
			vparty=d[v]
			}*/
		voters.push({'name':vname,'party':vparty,'vote':d[v]['cast_code']});
		}
	//console.log("Voters are "+JSON.stringify(voters));
	var desk_width=getDeskWidth();
	var seat_info=make_seat_info(desk_width,voters.length);
	var voters_assigned_seats=assign_seats(seat_info,voters);

	//console.log(JSON.stringify(voters_assigned_seats));


	var svg_obj=d3.select("#"+svg_id);
	var cong_g=svg_obj.append('g')
		.attr('transform','translate('+trx_x+','+trx_y+') rotate(0)');



		//console.log("mcumu "+JSON.stringify(cumu_data_list));	
		var hoverGroup=svg_obj.append("g")
			.style("visibility","hidden");
		hoverGroup.append("rect")
		.attr("x",-20)
		.attr("y",-20)
		.attr("width",100)
		.attr("height",20)
		.attr("fill","rgb(200,200,200)");
		var hoverText = hoverGroup.append("text").attr("x",-14).attr("y",-5).text("hello!");

		svg_obj.on("mousemove",function(d, i) { 
		  var that = this;
		  hoverGroup.attr("transform",function() {
		    return "translate("+(d3.mouse(that)[0]+25)+","+(d3.mouse(that)[1]+55)+")";
		});});

		var the_gs=cong_g.selectAll('g').data(voters_assigned_seats)
			.enter()
			.append('g')
			.attr('transform',function(d,i) { 
					//return d['transform']; 
					return  seat_info['data'][d['seat_id']]['transform']
					});

		var party_colors=get_party_colors();


		the_gs.append('rect')
			.attr('stroke-width',2)
			.attr('stroke',function(d) {
					if(d['party'] in party_colors)
						{
						return party_colors[d['party']];
						}
					return 'black';
					})
			.attr('x',function(d) { return seat_info['data'][d['seat_id']]['rect']['x'];})
			.attr('y',function(d) { return seat_info['data'][d['seat_id']]['rect']['y'];})
			.attr('width',function(d) { return seat_info['data'][d['seat_id']]['rect']['width'];})
			.attr('height',function(d) { return seat_info['data'][d['seat_id']]['rect']['height'];})
			.style('fill',function(d,i)
					{
					//console.log('d is '+JSON.stringify(d));
					//console.log('party is '+d['party']);
					//console.log('pc : '+JSON.stringify(party_colors));
					var the_vote=parseInt(d['vote']);
					var color=cast_code_to_color(the_vote,party_colors,d['party']);
					return color;
					})
			.on("mouseenter",function(d,i) {
					var the_voters_party=d['party'];
					var the_voters_name=d['name'];
					var the_vote=parseInt(d['vote']);
					//return the_voters_name+":"+the_voters_party;
					the_vote=cast_code_lookup[the_vote];
					hoverText.text(the_voters_name+":"+the_voters_party+":s"+d['seat_id']+":V="+the_vote);
					//https://stackoverflow.com/questions/1636842/svg-get-text-element-width
					//https://stackoverflow.com/questions/36540141/why-cant-i-get-the-bounding-box-of-this-d3-js-text
					var bbox = hoverText.node().getBBox();
					hoverGroup.selectAll('rect').attr('width',bbox.width+10);
					//hoverGroup.height=bbox.height;
					hoverGroup.style("visibility","visible");
					})
			.on("mouseout",function() {
					hoverGroup.style("visibility","hidden");
					//hoverGroup.selectAll("rect").attr("width",75)
					});




	};


