


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
		console.log('the w/h are '+svg_width+' and '+svg_height);
		var koi_sums=[0,0,0,0,0];
		console.log("for this plot, len data is "+data.length);
		console.log('koi_sums len is '+koi_sums.length);
		console.log('koi  len is '+koi.length);
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
		console.log("num data filt is "+this_dow_data.length);
		var this_dow_plot=dowPlot();
		this_dow_plot.data(this_dow_data);
		this_dow_plot.dow(d);
		var svg_id_to_use='svg_'+days_of_week[d];
		console.log('using svg id '+svg_id_to_use);
		var svg_obj=d3.select("#"+svg_id_to_use);
		this_dow_plot.plot(svg_obj);
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


