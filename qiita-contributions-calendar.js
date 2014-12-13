
function render () {
  var div = $('<div>');
  div.addClass('row');
  var elem = $('<div>');
  elem.addClass('userPage_userContibutions');
  div.append(elem);

  $('.userPage_stats .container').append(div);
}
render();





function get365Dates() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dt = new Date(year, month - 1, day);
  var baseSec = dt.getTime();
  var stdout = [];
  for (var i = 0; 365 >i; i++) {
    var addSec = i * -86400000;
    var targetSec = baseSec + addSec;
    dt.setTime(targetSec);

    var y = dt.getFullYear();
    var m = dt.getMonth() + 1;
    var d = dt.getDate();
    m = ('0' + m).slice(-2);
    d = ('0' + d).slice(-2);
    stdout.push(y + '-' + m + '-' + d);
  }
  return stdout;
}

var data;
function parseData (data) {
  var dates = get365Dates();
  var obj = {};
  Object.keys(data).forEach(function (key) {
    var date = data[key].created_at;
    date = date.slice(0, 10);
    if (dates.slice(-1) > date) {
      return;
    }
    if (typeof obj[date] === 'number') {
      obj[date] += 0.0015114;
    } else {
      obj[date] = 0.0015114;
    }
  });

  dates.forEach(function (date) {
    if (typeof obj[date] === 'number') {
      return
    }
    obj[date] = 0;
  });

  console.log(obj);

  return obj;
}

var data = localStorage.getItem('data');
if (data === null) {
  d3.json('/api/v2/users/mizchi/items?page=1&per_page=100', function (json) {
    json = JSON.stringify(json);
    localStorage.setItem('data', json);
    location.reload();
  });
} else {
  data = JSON.parse(data);
  data = parseData(data);
}



var width = $('.userPage_userContibutions').width(),
height = 136,
cellSize = 17; // cell size

var day = d3.time.format("%w"),
week = d3.time.format("%U"),
percent = d3.format(".1%"),
format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize()
.domain([-.05, .05])
.range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

var svg = d3.select(".userPage_userContibutions").selectAll("svg")
.data(d3.range(2013, 2014, 2015))
.enter().append("svg")
.attr("width", width)
.attr("height", height)
.attr("class", "RdYlGn")
.append("g")
.attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
.attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
.style("text-anchor", "middle")
.text(function(d) { return d; });

var rect = svg.selectAll(".day")
.data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
.enter().append("rect")
.attr("class", "day")
.attr("width", cellSize)
.attr("height", cellSize)
.attr("x", function(d) { return week(d) * cellSize; })
.attr("y", function(d) { return day(d) * cellSize; })
.datum(format);

rect.append("title")
.text(function(d) { return d; });

svg.selectAll(".month")
.data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
.enter().append("path")
.attr("class", "month")
.attr("d", monthPath);


rect.filter(function(d) { return d in data; })
.attr("class", function(d) { return "day " + color(data[d]); })
.select("title")
.text(function(d) { return d + ": " + percent(data[d]); });


function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
  d0 = +day(t0), w0 = +week(t0),
  d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
  + "H" + w0 * cellSize + "V" + 7 * cellSize
  + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
  + "H" + (w1 + 1) * cellSize + "V" + 0
  + "H" + (w0 + 1) * cellSize + "Z";
}

d3.select(self.frameElement).style("height", "2910px");
