var width = 500,
  height = 500,
  svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom;

var gDrawing = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleLinear().range([0, iwidth]);
var y = d3.scaleLinear().range([iheight, 0]);

function update(myData) {
  // Data parsing, in case you need it
  const parseDate = d3.timeParse("%Y/%m/%d");
  myData.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  // TODO Update scale domains based on your data variables
  x.domain([0, 1]);
  y.domain([0, 1]);

  gDrawing
    .append("g")
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("xAxis")
    .attr("transform", `translate(${iwidth}, ${-20})`);

  gDrawing
    .append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("yAxis")
    .attr("transform", `translate(${50}, 0)`);

  var marks = gDrawing.selectAll(".mark").data(myData);

  // Update
  marks;
  //TODO change the attribs/style of your updating mark

  // Newly created elements
  marks.enter().append("circle").attr("class", "mark"); // TODO change for the mark you want to use e.g. rect, path, etc
  //TODO change the attribs/style of your updating mark

  // Elements to remove
  marks.exit().remove();
}

d3.csv("./data/mydata.csv", update);
