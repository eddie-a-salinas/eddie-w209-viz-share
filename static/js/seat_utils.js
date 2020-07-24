


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

