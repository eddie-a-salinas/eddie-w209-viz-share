

d3.json("getVotesPerCongress/senate", function (err, data) {
  create_butterfly_chart(data, "senate", "#chart1") 
});

/*d3.json("getVotesPerCongress/house", function (err, data) {
  create_butterfly_chart(data, "house", "#chart2") 
});*/



d3.json("getTotalRollcallsPerCongress/senate", function (err, data) {  
  create_timeline_plot(data, "senate", "#chart3");
});


/*d3.json("getTotalRollcallsPerCongress/house", function (err, data) {  
  create_timeline_plot(data, "house", "#chart4")
});*/


function create_butterfly_chart(myData, chamber, chart_number) {
  

var width = 750,
  height = 300,
  svg = d3
    .select(chart_number)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 60 },
  iwidth = width - margin.left - margin.right,
  iheight_dem = (height/2) - margin.top - margin.bottom;
  iheight_rep = (height/2) - margin.top - margin.bottom;

var gDrawing = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleLinear().range([0, iwidth]);
var x_congress = d3.scaleBand() // from https://www.d3-graph-gallery.com/graph/custom_axis.html                    
                   .rangeRound([0, iwidth])
                   .paddingInner(0.1);;

var y_dem = d3.scaleLinear().range([iheight_dem, 0]);
var y_rep = d3.scaleLinear().range([0, iheight_rep]);


 var data = [];
  for (i = 0; i < myData.length; i++){            
        var temp = {"Congress_number": i + 35,
                    "House": chamber,
                    "Dem_Votes" :  parseInt(myData[i].Dem_Votes),
                    "Rep_Votes" :  parseInt(myData[i].Rep_Votes)                  
                };        
        data.push(temp)  
   }  
 
console.log("Latest data from API")  
console.log(data);



all_congress_numbers = d3.map(data, function(d){return d.Congress_number;}).keys();
var data_vote = data //[]; // GroupBy from https://stackoverflow.com/questions/29364262/how-to-group-by-and-sum-array-of-object

  // TODO Update scale domains based on your data variables
  x.domain([0, 1]);
  x_congress.domain(d3.range(all_congress_numbers.length));    
  y_dem.domain([0, d3.max(data_vote, function(d) { return parseInt(d.Dem_Votes); })]);
  y_rep.domain([0, d3.max(data_vote, function(d) { return parseInt(d.Dem_Votes); })]); // Special case as to get the same Y-Axis size


  gDrawing
    .append("g")
    .attr("transform", `translate(0,${iheight_dem})`)
    .call(d3.axisBottom(x_congress).tickFormat(""));
    
  gDrawing
    .append("g")
    //.attr("transform", `translate(${0}, ${0})`)
    .call(d3.axisLeft(y_dem).ticks(5))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("Democrat Votes")
    .attr("transform", `translate(${125}, 0)`);


     gDrawing
    .append("g")
    .attr("transform", `translate(${0}, ${iheight_dem})`)
    .call(d3.axisLeft(y_rep).ticks(5))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("Republican Votes")
    .attr("transform", `translate(${135}, ${iheight_dem + 10})`);


//////////////////////// Democrat Bars /////////////////////////
  gDrawing.selectAll("rect.bars_dem")
    .data(data_vote)
    .enter()
    .append("rect")
    .attr("class", "bars_dem")   
    .attr("x", function (d, i){ 
                             return x_congress(i); } )
    .attr("y", function (d) { return  y_dem(d.Dem_Votes); } )
    .attr("height", function (d) { return y_dem(0) - y_dem(d.Dem_Votes); } )
    .attr("width",   x_congress.bandwidth() )
    .style("fill", "blue") //.style("fill", "teal") //#69b3a2
    .style("opacity", 0.65)
    .on("mouseover", function() {        
      d3.select(this)
        .style("fill", "teal");
         })
    .on("mouseout", function() {
           d3.select(this)
              .transition()
              .duration(450)
            .style("fill", "blue");
         })
     .append("title")    
     .text(function(d) { 
          return "Congress Number: " + d.Congress_number  + "\nDemocrat Votes: " + parseInt(d.Dem_Votes) + 
                                                           "\nRepublican Votes: " + parseInt(d.Rep_Votes);   
      });                       

  var marks = gDrawing.selectAll(".mark").data(myData);

//////////////////////// Republican Bars /////////////////////////
   gDrawing.selectAll("rect.bars_rep")
    .data(data_vote)
    .enter()
    .append("rect")
    .attr("class", "bars_rep")   
    .attr("x", function (d, i){ 
                             return x_congress(i); } )
    .attr("y",  iheight_dem)
    .attr("height", function (d) { return y_dem(0) - y_dem(d.Rep_Votes); } )
    .attr("width",   x_congress.bandwidth() )
    .style("fill", "Red") //.style("fill", "teal") //#69b3a2
    .style("opacity", 0.65)
    .on("mouseover", function() {        
      d3.select(this)
        .style("fill", "teal");
         })
    .on("mouseout", function() {
           d3.select(this)
              .transition()
              .duration(450)
            .style("fill", "Red");
         })
     .append("title")    
     .text(function(d) { 
          return "Congress Number: " + d.Congress_number + "\nDemocrat Votes: " + parseInt(d.Dem_Votes) + 
                                                           "\nRepublican Votes: " + parseInt(d.Rep_Votes);   
      });                       


}


function create_timeline_plot(myData, chamber, chart_number) {
 

var width = 750,
    height = 300,
    svg = d3.select(chart_number)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth = width - margin.left - margin.right,
  iheight_rollcalls = height - margin.top - margin.bottom;
 

var gDrawing = svg.append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);


var x_congress_year = d3.scaleBand() // from https://www.d3-graph-gallery.com/graph/custom_axis.html                    
                        .rangeRound([0, iwidth])
                        .paddingInner(0.05);;

var y_rollcalls = d3.scaleLinear()
                    .range([iheight_rollcalls, 0]);

 var data = [];
  for (i = 0; i < myData.length; i++){       
        var temp = {"Congress_number": i + 35,
                    "House": chamber,                    
                    "Total_Roll_Calls": parseInt(myData[i].Total_Roll_Calls),                   
                    "Year": parseInt(myData[i].Congress_Year)                                  
                };        
        data.push(temp)  
         
  }
console.log("This data is for rollcalls by API")  
console.log(data);



all_congress_numbers = d3.map(data, function(d){return d.Congress_number;}).keys();
all_congress_years = d3.map(data, function(d){return d.Year;}).keys();

congress_years_map = [];
for (i = 0; i < all_congress_numbers.length; i++){

         var temp = {"Congress_number" : parseInt(all_congress_numbers[i]),
                      "Year" : parseInt(1857 + (2 * i) )};        
         congress_years_map.push(temp);
     }
console.log(congress_years_map);


var data_rollcalls = data 
  
  x_congress_year.domain(all_congress_years);    
  y_rollcalls.domain([0, d3.max(data_rollcalls, function(d) { return parseInt(d.Total_Roll_Calls); })]);
  
var line = d3.line()
             .x(function(d, i) { return x_congress_year(congress_years_map[i].Year); }) // set the x values for the line generator
             .y(function(d) { return y_rollcalls(d.Total_Roll_Calls); }) // set the y values for the line generator 
             .curve(d3.curveMonotoneX) // apply smoothing to the line

  gDrawing
    .append("g")
    .attr("transform", `translate(0,${iheight_rollcalls})`)
    .call(d3.axisBottom(x_congress_year).tickValues(x_congress_year.domain().filter(function(d,i){ return !(i%5)})))//.tickFormat(""))
   

  gDrawing
    .append("g")
    .call(d3.axisLeft(y_rollcalls).ticks(5))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("Total Roll Calls")
    .attr("transform", `translate(${125}, 0)`);



//////////////////////// Total Roll Calls House /////////////////////////
gDrawing.append("path")
        .datum(data_rollcalls) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
var marks = gDrawing.selectAll("path.pt").data(data_rollcalls);
  // Update
 marks;
  //TODO change the attribs/style of your updating mark

  // Newly created elements 
    marks.enter()
       .append("path") 
       .attr("class", "pt")
       .attr("d",  d3.symbol().type(d3.symbolCircle))
       .attr("d", d3.symbol().size(50))// function(d){return d.Average_Rating * 25}))
       .attr("transform", function(d, i) {
              return "translate(" + x_congress_year(congress_years_map[i].Year) + "," + y_rollcalls(d.Total_Roll_Calls) + ")";})
       .attr("fill", "grey")
       .attr("stroke", "black") 
       .on("mouseover", function(d, i) {        
               d3.select(this)
                 .style("fill", "teal")
                 .attr("d", d3.symbol().size(125));
                 // .attr("r", 8);
                console.log("I am on hover");
                console.log(d);
                console.log(congress_years_map[i].Year);
                hoverImageBox.style("visibility","visible"); 
                hoverImage.attr("xlink:href", "images/events/" + imageData[congress_years_map[i].Year][0] ); 
                // hoverImage.attr("xlink:href","pictures/Becoming.jpg"); 
                hoverImage.style("visibility","visible"); 
                hoverGroup.style("visibility","visible"); 
                hoverText1.text(imageData[congress_years_map[i].Year][1]);
         })
        .on("mouseout", function(d, i) {
           d3.select(this)
              .transition()
              .duration(450)
              .style("fill", "grey")
              .attr("d", d3.symbol().size(50));
            hoverImageBox.style("visibility","hidden");
            hoverImage.style("visibility","hidden");  
            hoverGroup.style("visibility","hidden"); 
         })
        .append("title")    
        .text(function(d, i) { 
          return "Congress Number: " + d.Congress_number + "\nChamber: House" + "\nYear: " + parseInt(congress_years_map[i].Year) + "\n\nTotal Roll Calls: " + parseInt(d.Total_Roll_Calls) ;   
      }); 


var hoverImageBox = gDrawing.append("g").style("visibility","hidden")

 hoverImageBox.append("rect")
              .attr("x",650)
              .attr("y",20)
              .attr("width",280)
              .attr("height",200)
              .attr("fill","white")
              .attr("stroke", "5px");

 var hoverImage =  hoverImageBox.append("image")                               
                                .attr("x", 275)
                                .attr("y", 10)
                                .attr("width", 175)
                                .attr("height", 100);   

 var hoverGroup = gDrawing.append("g").style("visibility","hidden");

        hoverGroup.append("rect")
          .attr("x",550)
          .attr("y",0)
          .attr("width",200)
          .attr("height",20)
          .attr("fill","white")
          .attr("stroke", "5px");

var hoverText1 = hoverGroup.append("text").attr("x",275).attr("y",0).style("fill", "black").style("font-weight", "bold");                                   
    


}



var imageData = {


"1861": ["US_Civil_War_1861_1865.jpeg", "US Civil War (1861-1865)"],
"1862": ["US_Civil_War_1861_1865.jpeg", "US Civil War (1861-1865)"],
"1863": ["US_Civil_War_1861_1865.jpeg", "US Civil War (1861-1865)"],
"1864": ["US_Civil_War_1861_1865.jpeg", "US Civil War (1861-1865)"],
"1865": ["US_Civil_War_1861_1865.jpeg", "US Civil War (1861-1865)"],

"1899": ["Phillipine_American_War_1899_1902.jpeg", "Phillipine American War (1899-1902)"],
"1900": ["Phillipine_American_War_1899_1902.jpeg", "Phillipine American War (1899-1902)"],
"1901": ["Phillipine_American_War_1899_1902.jpeg", "Phillipine American War (1899-1902)"],
"1902": ["Phillipine_American_War_1899_1902.jpeg", "Phillipine American War (1899-1902)"],

"1914": ["WWI_1914_1918.jpeg", "World War 1 (1914-1918)"],
"1915": ["WWI_1914_1918.jpeg", "World War 1 (1914-1918)"],
"1916": ["WWI_1914_1918.jpeg", "World War 1 (1914-1918)"],
"1917": ["WWI_1914_1918.jpeg", "World War 1 (1914-1918)"],
"1918": ["WWI_1914_1918.jpeg", "World War 1 (1914-1918)"],

"1920": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1921": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1922": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1923": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1924": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1925": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1926": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1927": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],
"1928": ["Prohibition_1920_1933.jpg", "Prohibition (1920-1933)"],

"1929": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1930": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1931": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1932": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1933": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1934": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1935": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1936": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1937": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],
"1938": ["The_Great_Drpession_1929_1939.jpg", "The Great Drpession (1929-1939)"],

"1939": ["WW2_1939_1945.jpeg", "World War 2 (1939-1945)"],
"1940": ["WW2_1939_1945.jpeg", "World War 2 (1939-1945)"],
"1941": ["WW2_1939_1945.jpeg", "World War 2 (1939-1945)"],
"1942": ["WW2_1939_1945.jpeg", "World War 2 (1939-1945)"],
"1943": ["WW2_1939_1945.jpeg", "World War 2 (1939-1945)"],
"1944": ["WW2_1939_1945.jpeg", "World War 2 (1939-1945)"],

"1945": ["A_Bomb_Used_1945.jpeg", "Atomic Bomb Used - 1945"],

"1950": ["Korean_War_1950_1953.jpeg", "Korean War (1950-1953)"],
"1951": ["Korean_War_1950_1953.jpeg", "Korean War (1950-1953)"],
"1952": ["Korean_War_1950_1953.jpeg", "Korean War (1950-1953)"],
"1953": ["Korean_War_1950_1953.jpeg", "Korean War (1950-1953)"],

"1954": ["Desegregation_Civil_Rights_Movement_1950_1960.jpg", "Desegregation Civil Rights Movement (1950-1960)"],
"1955": ["Desegregation_Civil_Rights_Movement_1950_1960.jpg", "Desegregation Civil Rights Movement (1950-1960)"],
"1956": ["Desegregation_Civil_Rights_Movement_1950_1960.jpg", "Desegregation Civil Rights Movement (1950-1960)"],
"1957": ["Desegregation_Civil_Rights_Movement_1950_1960.jpg", "Desegregation Civil Rights Movement (1950-1960)"],
"1958": ["Desegregation_Civil_Rights_Movement_1950_1960.jpg", "Desegregation Civil Rights Movement (1950-1960)"],

"1959": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1960": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1961": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1962": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1963": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1964": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1965": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1966": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1967": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1968": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1969": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1970": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1971": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1972": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],
"1973": ["Vietnam_War_1959_1973.jpeg", "Vietnam War (1959-1973)"],



"1990": ["Operation_Dessert_Storm_1990_1991.jpg", "Operation Dessert Storm (1990-1991)"],
"1991": ["Operation_Dessert_Storm_1990_1991.jpg", "Operation Dessert Storm (1990-1991)"],

"2001": ["911.jpeg", "Terrorist Attacks - 09/11"],

"2002": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2003": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2004": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2005": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2006": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2007": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2008": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2009": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2010": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2011": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2012": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2013": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"],
"2014": ["OEF_Afghanistan_2001_2014.jpeg", "Operation Endurance Freedom (2001-2014)"]


};


// $.ajax({
//     type:"GET",
//     dataType: "json",
   
//     url: "http://localhost:5000/getTotalRollcallsPerCongress/house",
//     success: function(data){
//         buf1=data;
//         console.log(data);
//     }
// })
