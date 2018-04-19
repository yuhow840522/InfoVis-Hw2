/* select svg area */
var svg = d3.select('svg')
var w = 700 ,h = 500 ,padding = 80 ,barWidth =45,xData = [96,106];
var yMin,yMax;
var department ;
var departmentData;
var school;

svg.append('g').attr('id','xAxis').attr('transform','translate(0, 414.02)');
svg.append('g').attr('id','yAxis').attr('transform','translate(49, 0)');



$('body').on('click','.department-select', function() {
  department = $(this).text();
  $('#department-select-show').text(department);
  departmentData = getDepartmentData(department);
  calculateDraw();
  $("#department-id").text(department);
});

// 監測選校之後產生選系名單
$('.school-select').on('click',function(){
  school = $(this).text();
  $('#school-select-show').text(school);
  $('#department-select-show').text("請選擇科系");
  $('#department-id').text("");

  let departmentList = data[school];
  departmentList = departmentList["科系資料"];

  let result=[];
  for(let i=0;i<departmentList.length;i++){
    result.push(departmentList[i]["科系名稱"]);
  }
  $("#school-id").text(school);
  // console.log(result);
  $('#department-select').empty();
  for(i=0;i<result.length;i++){
    $('#department-select').append('<li><a href="#" class="department-select">'+result[i]+'</a></li>')
  }
});

/* getData*/

function getDepartmentData(name){
  let d;
  let d1 = data[school]["科系資料"];
  for(let i=0;i<d1.length;i++){
    if(d1[i]["科系名稱"]==name){
      d = d1[i];
    }
  }
  let result=[
    {"year":96 ,"count":d["96 N"]},
    {"year":97 ,"count":d["97 N"]},
    {"year":98 ,"count":d["98 N"]},
    {"year":99 ,"count":d["99 N"]},
    {"year":100 ,"count":d["100 N"]},
    {"year":101 ,"count":d["101 N"]},
    {"year":102 ,"count":d["102 N"]},
    {"year":103 ,"count":d["103 N"]},
    {"year":104 ,"count":d["104 N"]},
    {"year":105 ,"count":d["105 N"]},
    {"year":106 ,"count":d["106 N"]}
  ]
  let yTempMin=result[0].count,yTempMax=result[0].count;
  for(let i=1;i<11;i++){
    if(yTempMin>result[i].count) yTempMin=result[i].count;
    if(yTempMax<result[i].count) yTempMax=result[i].count;
  }
  yMin=yTempMin;
  yMax=yTempMax;
  yMin=(yMin-(yMin%10))-10;
  if(yMin<0) yMin=0;
  // yMax=yMax+(10-yMax%10);
  return result;
}


function calculateDraw(){
  /* calculate scale */

  // d3.select("#text").select("svg").remove();
  // d3.select("g").select("text").remove();
  /*only select which has font-size attr text*/
  d3.select("#yAxis").select("svg").remove();
  $('text[font-family]').remove()
  $('rect').remove();


  setTimeout(function() {

    var xScale = d3.scale.linear()
    .domain(xData)
    .range([padding,w-padding])

    var yScale = d3.scale.linear()
    .domain([yMin,yMax])
    .range([padding, h-padding])

    var y = d3.scale.linear()
    .domain([yMin,yMax])
    .range([h-padding,padding])

    var colorScale = d3.scale.linear()
    .domain([yMin,yMax])
    .range([500+yMax*2,100+yMin*1.5])

    /* append real x-y Axis*/
    svg.select("#xAxis").call(function(g){
      let axis = d3.svg.axis().scale(xScale).orient("bottom");
      g.call(axis);
    });

    svg.select("#yAxis").call(function(g){
      let axis = d3.svg.axis().scale(y).orient("left");
      g.call(axis);
    });

    /* draw bar*/
    svg.selectAll('rect')
    .data(departmentData)
    .enter()
    .append('rect')
    .attr({
      'x': function(d,i) {return xScale(d.year)-(barWidth/2)},
      'y': function(d) {return h-yScale(d.count)},
      'width': barWidth,
      'height': function(d){return yScale(d.count)-90},
      'fill': function(d){var color = 0.20 + colorScale(d.count)*0.00056;
        return d3.hsl(187,0.57,color);},
      });

      /*draw bar.attr*/
      svg.append("g").selectAll('text')
      .data(departmentData)
      .enter()
      .append('text')
      .text(function(d){return d.count+"人"})
      .attr({
        'x': function(d,i) {return xScale(d.year)-(barWidth/10)+5},
        'y': function(d) {return h-yScale(d.count)-12.5},
        'font-family' : 'Microsoft JhengHei',
        'fill': '	#6d6d6d',
        'text-anchor': 'middle',
        'font-size': '50x',
        'font-weight': 'bold'
      });

      /*draw x-y label*/
      svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (padding/6) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .attr({'font-size': '100x','font-family' : 'Microsoft JhengHei'})
      .text("新生人數變化");

      svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (w/2) +","+(h-(padding/2))+")")  // centre below axis
      .attr({'font-size': '100x','font-family' : 'Microsoft JhengHei'})
      .text("年份(民國)");

    }, 14);

  }
