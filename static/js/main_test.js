
console.log("in main_test.js ");

var eddie_func=function()
	{
	console.log("test eddie");
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
		if(vparty=="Democrat")
			{
			vparty="Democrat";
			}
		else if(vparty=="Republican")
			{
			vparty="Republican";
			}
		else
			{
			vparty="Other";
			}
		voters.push({'name':vname,'party':vparty,'vote':d[v]['cast_code']});
		}
	//console.log("Voters are "+JSON.stringify(voters));
	var desk_width=10;
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

		var party_colors={'Republican':'red','Democrat':'blue','Independent':'green'};


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
					//1=yay ; 6=nay ; else=blank
					if(the_vote==1)
						{
						//yay
						return party_colors[d['party']];						
						}
					else if(the_vote==6)
						{
						//nay
						return 'white';
						}
					else if(the_vote==9)
						{
						//absent!
						return 'grey';
						}
					else
						{
						return 'yellow';
						}
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

