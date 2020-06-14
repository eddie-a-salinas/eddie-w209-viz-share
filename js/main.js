


var ddmrrcolors=["blue","steelblue","purple","pink","red"];




dowPlot = function() {

	var data = [];
	var data_ = function(_) {
		var that = this;
		if (!arguments.length) return data;
		data = _;
		return that;
		};

	var dow;
	var dow_=function(_) {
		var that=this;
		if(!arguments.length) return dow;
		dow=_;
		return that;
		};

	var koi=["Number Democrat Yeas","Number Democrat Nays","Number Missing Votes (not voting and not in Congress)","Number Republican Nays","Number Republican Yeas"];

	var plot_ =function(svg_elem)
		{
		var svg_width=svg_elem.attr('width');
		var svg_height=svg_elem.attr('height');
		//console.log('the w/h are '+svg_width+' and '+svg_height);
		var koi_sums=[0,0,0,0,0];
		/*console.log("for this plot, len data is "+data.length);
		console.log('koi_sums len is '+koi_sums.length);
		console.log('koi  len is '+koi.length);*/
		for(var d=0;d<data.length;d++)
			{
			for(var k=0;k<koi.length;k++)
				{
				var temp_val=parseInt(getRecVal(data[d],koi[k]));
				/*if(k==0 && d==0)
					{
					console.log('d='+d+', k='+k+' and tv ='+temp_val);
					}*/
				koi_sums[k]=koi_sums[k]+temp_val;		
				}
			}
		//console.log("koi_sums : "+JSON.stringify(koi_sums));
		var main_sum=koi_sums.reduce(function(a,b) { return a+b; });
		var pcts=koi_sums.map(x => x/main_sum );
		var rect_widths=pcts.map(x=>x*svg_width);
		var rect_x=[0];
		for(var r=1;r<rect_widths.length;r++)
			{
			var widths_consider=rect_widths.slice(0,r);
			var sum_wc=widths_consider.reduce(function(a,b) { return a+b; });
			rect_x.push(sum_wc);
			}
		/*console.log("pcts   : "+JSON.stringify(pcts));
		console.log("widths : "+JSON.stringify(rect_widths));
		console.log("x      : "+JSON.stringify(rect_x));*/
		//yellowGreen = d3.interpolateYlGn(0.5),
		svg_elem.selectAll("rect")
			.data(pcts)
			.enter()
			.append("rect")
			.attr("x",function(d,i) {
				return rect_x[i];
				})
			.attr("y","0")
			.attr("width",function(d,i) {
				return rect_widths[i];
				})
			.attr("height",svg_height)
			.style("fill",function(d,i) {
				//var redBlue=d3.interpolateRdBu				
				//var rev_i=(rect_x.length-i)/rect_x.length;
				//return d3.interpolateRdBu(rev_i);
				return ddmrrcolors[i];
				});
		}
  
	var publicObject = {
		"dow": dow_,
		"data": data_,
		"plot": plot_
		};
  
	return publicObject;

	};


window.onload = function() {
var dow_div=$( "#dow_div" );
var dow_table=$("<table border='1'></table>").appendTo(dow_div);

for(var d=0;d<days_of_week.length;d++)
	{
	var svg_id='svg_'+days_of_week[d];
	var svg_dim=100;
	dow_table.append('<tr><td>'+days_of_week[d]+'</td><td><svg width='+svg_dim+' height='+svg_dim+'   id='+svg_id+'  ></svg></td><tr>');
	}

var load_svg_charts=function(result)
	{
	//iterate over each day of the week
	console.log("num data is "+result.data.length);
	for(var d=0;d<days_of_week.length;d++)
		{
		/*
		Day
		Month
		Year
		*/
		var this_dow_data=result.data.filter(function(rec) {
			var rec_year=parseInt(getRecVal(rec,'Year'));
			var rec_month=parseInt(getRecVal(rec,'Month'));
			var rec_day=parseInt(getRecVal(rec,'Day'));
			var dow=dayOfWeek(rec_year,rec_month,rec_day);
			return dow==d;
			});
		//console.log("num data filt is "+this_dow_data.length);
		var this_dow_plot=dowPlot();
		this_dow_plot.data(this_dow_data);
		this_dow_plot.dow(d);
		var svg_id_to_use='svg_'+days_of_week[d];
		//console.log('using svg id '+svg_id_to_use);
		var svg_obj=d3.select("#"+svg_id_to_use);
		this_dow_plot.plot(svg_obj);
		}

	var dow_seasons=$( "#dow_seasons" );
	var seasons=["Winter","Spring","Summer","Fall"];
	//console.log('seasons is '+JSON.stringify(seasons));
	//console.log('dowp is '+JSON.stringify(dows));
	var sadTable="<table border=1>";
	for(var d=0;d<days_of_week.length;d++)
		{
		if(d==0)
			{
			var header_row="<tr><td></td>"+seasons.map(x=>"<td>"+x+"</td>").join('')+"</tr>";
			sadTable+=header_row;
			}
		var temp_row="<tr>";
		for(var s=0;s<seasons.length;s++)
			{
			if(s==0)
				{
				temp_row+="<td>"+days_of_week[d]+"</td>";
				}
			var this_svg_id="svg_"+days_of_week[d]+"_"+seasons[s];
			var svg_dim=100;
			temp_row+="<td><svg id=\""+this_svg_id+"\" width=\""+svg_dim+"\" height=\""+svg_dim+"\"></svg></td>";
			}
		sadTable+=temp_row;
		}
	sadTable+="</table>";
	console.log("sadtable is "+sadTable);
	dow_seasons.append(sadTable);
	
	for(var d=0;d<days_of_week.length;d++)
		{
		for(var s=0;s<seasons.length;s++)
			{
			var svg_id_to_load_with="svg_"+days_of_week[d]+"_"+seasons[s];
			var this_block_data=result.data.filter(function(rec) {
				var rec_month=parseInt(getRecVal(rec,'Month'));
				var rec_day=parseInt(getRecVal(rec,'Day'));
				var rec_year=parseInt(getRecVal(rec,'Year'));
				var this_dow=days_of_week[dayOfWeek(rec_year,rec_month,rec_day)];
				var this_season=getSeason(rec_day,rec_month);
				this_season=jsUcfirst(this_season);
				var same_day=this_dow==days_of_week[d];
				/*console.log('this_dow is '+this_dow);
				console.log('ref dow is '+days_of_week[d]);
				console.log('same day is '+same_day);
				sdfsdf();*/
				var same_season=this_season==seasons[s];
				
				return same_day && same_season;
				});
			console.log("for d="+d+" s="+s+" num in block is "+this_block_data.length);
			var this_saddow_plot=dowPlot();
			this_saddow_plot.data(this_block_data);
			var this_svg_to_plot_saddow=d3.select("#"+svg_id_to_load_with);
			this_saddow_plot.plot(this_svg_to_plot_saddow);
			}
		}

	}

var cong_data=$.ajax({url: "./data/demrep35_113.json",
	success: function(result){
	    //var myss=(result+'').substring(0,1000);
		load_svg_charts(result);
    	},
	error: function(m)
	{
	alert('ajax error : '+JSON.stringify(m));
	}
});



};


