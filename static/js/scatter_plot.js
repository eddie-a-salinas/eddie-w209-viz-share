

var firstTimeObj={
		"scatter_plot_senate":true,
		"scatter_plot_house":true
	};

var anim_time=1000;
function svgScatterDraw(the_data,pk1,pk2,ftidx,rc_callback)
	{
	//console.log('data to plot is '+JSON.stringify(the_data));
	var svg_obj=d3.select('#'+ftidx);
	var width=svg_obj.attr("width");
	var height=svg_obj.attr("height");
	var margin={'left':50,'right':50,'bottom':50,'top':50};
	//console.log('width is '+width);


	var yScale=d3.scaleLinear()
		.domain([0.0,100.0])
		.range([height-margin.top-margin.bottom,0.0]);
	var xScale=d3.scaleLinear()
		.domain([0.0,100.0])
		.range([0,width-margin.right-margin.left]);



	var main_g=null;
	var hoverGroup=null;
	var isFirstTime=firstTimeObj[ftidx];
	console.log('ft is '+isFirstTime);
	if(isFirstTime)
		{

		var main_group_tx='translate('+margin.left+','+margin.top+')';
		main_g=svg_obj.append('g')
			.attr('transform',main_group_tx)
			.attr('class','g_main');
		//do gridlines
		line_attr={"stroke":"black",
			"stroke-dasharray":20};
		var line_step=25;
		var x_ticks=[];
		var y_ticks=[];
		for(var gx=0.0;gx<=100.0;gx+=line_step)
			{
			//console.log('ap line gx='+gx);
			main_g.append("line")
				.style("stroke",line_attr['stroke'])
				.style("stroke-dasharray",line_attr['stroke-dasharray'])
				.attr("x1",xScale(gx))
				.attr("x2",xScale(gx))
				.attr("y1",yScale(0.0))
				.attr("y2",yScale(100.0));
			x_ticks.push(gx);
			}
		for(var gy=0.0;gy<=100.0;gy+=line_step)
			{
			//console.log('ap line yx='+gy);
			main_g.append("line")
				.style("stroke",line_attr['stroke'])
				.style("stroke-dasharray",line_attr['stroke-dasharray'])
				.attr("y1",yScale(gy))
				.attr("y2",yScale(gy))
				.attr("x1",xScale(0.0))
				.attr("x2",xScale(100.0));
			y_ticks.push(gy);
			}
				
		//do axes
		//var x_ticks=8;
		//var y_ticks=8;
		console.log("x/y ticks : "+JSON.stringify(x_ticks)+"/"+JSON.stringify(y_ticks));
		var x_axis_tx="translate(0,"+(height-margin.top-margin.bottom)+")";
		var yAxis = d3.axisLeft(yScale)
			.tickFormat(function(d) { return d + " %"; })
			.tickValues(y_ticks);
		main_g.append("g")
			.call(yAxis);	
		var xAxis=d3.axisBottom(xScale)
			.tickFormat(function(d) { return d + " %"; })
			.tickValues(x_ticks);
		main_g.append("g")
			.attr("transform",x_axis_tx)
			.call(xAxis);
		var x_axis_text_tx="translate("+xScale(36)+",30)";
		//console.log('x axis text tx is '+x_axis_text_tx);
		main_g.append("g")
			.attr("transform",x_axis_tx)
			.append("g")
			.attr("transform",x_axis_text_tx)
			.append("text")
			.text("% Republicans Voting Yea");
		main_g.append("g")
			.attr("transform","translate("+(-(margin.left/1.0))+","+yScale(70)+")")
			.append("g")
			.attr("transform","rotate(90)")
			.append("text")
			.text("% Democrats Voting Yea");

		//bi-partisan "DMZ"
		//<polygon points="0,100 50,25 50,75 100,0" />
		var step=25;
		var t_bl_step=0.0;
		var poly_x=[0+t_bl_step , 0+t_bl_step    , 100.0-step , 100.0 , 100.0      , step+t_bl_step ];
		var poly_y=[0+t_bl_step , step+t_bl_step , 100.0      , 100.0 , 100.0-step , 0.0+t_bl_step  ];
		var poly_points=[];
		for(var p=0;p<poly_x.length;p++)
			{
			poly_points.push(""+xScale(poly_x[p])+","+yScale(poly_y[p]));
			}
		var poly_points_str=poly_points.join(" ");
		console.log("pps is "+poly_points_str);
		main_g.append("polygon")
			.attr("points",poly_points_str)
			.attr("fill","purple")
			.style("opacity",0.75);
		var dmz_text="Bi-Partisan Zone";
		main_g.append("text")
			.attr("x",xScale(100-step-2))
			.attr("y",yScale(100.0+1.0))
			.text(dmz_text);
		main_g.append("g")
			.attr("transform","translate("+xScale(100.0+1)+","+yScale(100.0)+") rotate(90)")
			.append("text")
			.text(dmz_text);

		}
	else
		{
		console.log("NOT FIRST TIME!");
		}
	main_g=svg_obj.selectAll('.g_main');
	//console.log('main trans is '+main_g.attr('transform'));



	//console.log("k1 is "+pk1+" and k2 is "+pk2);
	var my_transition = d3.transition()
	    .duration(anim_time/2.0)
	    .ease(d3.easeCubicInOut);
	hoverGroup=d3.selectAll(".poli_part_hg");
	var circs_to_plot=main_g.selectAll("circle").data(the_data);

	//exit
	circs_to_plot.exit()
		.remove();


	//update
	var to_update=function(elems)
		{
		elems
			.on("mouseenter",function(d,i) {
				d3.select(this)
					.attr("r",6);
				})
			.on("mouseout",function(d,i) {
				hoverGroup.style("visibility","hidden");
				d3.select(this)
					.attr("fill","gray")
					.attr("r",4);
				})
			.on("click",function(d,i)
					{
					//alert('you have clicked '+JSON.stringify(d)+' with i='+i);
					var rollcall=d['rc'];
					rc_callback(rollcall);
					})
			.transition(my_transition)
			.attr("cx",function(d,i) {
				if(pk1 in d)
					{
					var inx=d[pk1];
					return xScale(inx*100.0);
					}
				return 0.0;
				})
			.attr("cy",function(d,i) {
				if(pk2 in d)
					{
					var iny=d[pk2];
					return yScale(iny*100.0);
					}
				return 0.0;
				})
			.attr("r",4)
			.style("cursor","pointer")
			.attr("stroke","black")
			.attr("fill",function(d,i) {
					return "gray";
				});
		elems.append("title").text(function(d,i) {
				//return JSON.stringify(d);
				var rollcall=d['rc']
				return "Roll Call "+rollcall;
				});



		}
	to_update(circs_to_plot);


	//new
	var new_circs=circs_to_plot.enter().append("circle")
	to_update(new_circs);


	if(isFirstTime)
		{		
		firstTimeObj[ftidx]=false;
		hoverGroup=svg_obj.append("g")
			.attr("class","poli_part_hg")
			.style("visibility","hidden");
		hoverGroup.append("rect")
			.attr("x",-20)
			.attr("y",-20)
			.attr("width",100)
			.attr("height",20)
			.attr("fill","rgb(200,200,200)");
		hoverGroup.append("text")
			.attr("id","hovertextid")
			.attr("x",-14)
			.attr("y",-5)
			.text("hello!");
		svg_obj.on("mousemove",function(d, i) { 
		  var that = this;
		  hoverGroup.attr("transform",function() {
				    return "translate("+(d3.mouse(that)[0]+25)+","+(d3.mouse(that)[1]+55)+")";
				});
			});
		}
		


	}



function issueScatterPlotUpdate(svg_id,congress,chamber,rc_callback) {
	/*var cc=getCongCham();
	var congress=cc[0];
	var chamber=cc[1];*/
	//http://localhost:5000/pct_party/106/House
	var url='pct_party/'+congress+'/'+chamber;
	console.log('url is '+url);
	$.ajax(url,{
			'success' : function(  data,  textStatus,  jqXHR )
				{
				if(typeof data=="string")
					{
					data=JSON.parse(data);
					}
				//console.log('data is '+JSON.stringify(data));
				var parties_by_size=data['parties_by_size'];
				console.log("parties by size : "+JSON.stringify(parties_by_size));
				if(parties_by_size.length>=2)
					{
					//good
					var pct_data=data['roll_calldata'].map(x=>x['vote_pct_data']);
					var pk1=parties_by_size[0];
					var pk2=parties_by_size[1];
					var pct_data_plot=[];
					for(var v=0;v<pct_data.length;v++)
						{
						
						var temp_obj={};
						if(pk1 in pct_data[v])
							{
							temp_obj[pk1]=pct_data[v][pk1];
							}
						else
							{
							temp_obj[pk1]=0.0;
							}
						if(pk2 in pct_data[v])
							{
							temp_obj[pk2]=pct_data[v][pk2];
							}
						else
							{
							temp_obj[pk1]=0.0;
							}
						temp_obj['desc']=data['roll_calldata'][v]['vote_description'];
						temp_obj['qust']=data['roll_calldata'][v]['vote_question'];
						temp_obj['ddesc']=data['roll_calldata'][v]['vote_detail_description'];
						var rc_str=data['roll_calldata'][v]['rollcall'];
						temp_obj['rc']=rc_str;
						pct_data_plot.push(temp_obj);
						}
					allowed_keys=["Republican","Democrat"];
					var e_msg="";
					if(allowed_keys.indexOf(pk1)==(-1))
						{
						e_msg="Un-implemented party : "+pk1+" !\n";
						}
					if(allowed_keys.indexOf(pk2)==(-1))
						{
						e_msg+="Un-implemented party : "+pk2+" !\n";
						}
					if(e_msg.length>1)
						{
						alert(e_msg);
						return;
						}
					//console.log("To draw with "+JSON.stringify(pct_data_plot,null,4));
					pk1=allowed_keys[0];
					pk2=allowed_keys[1];
					//console.log("PK1 as "+pk1+" AND PK2 as "+pk2);
					svgScatterDraw(pct_data_plot,pk1,pk2,svg_id,rc_callback);
					}
				else
					{
					alert('Found less than 2 parties to plot by?!?!');
					}
				}

		});


	}



