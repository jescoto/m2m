var host = "http://173.224.125.206:8803/"
var linesAPI = 'http://173.224.125.206:8803/OperadorServiceRest/linhas';
var line_Data = [];
var way_val, stop_val = 0;
var meters = 0;
var timing = 0;
var updateTimes;


function getLines(){
	$.getJSON(linesAPI, function(json) {
	var lines = json.linhas;
	console.log(linesAPI);
	$.each(lines, function(index, value) {
		var line_name = lines[index].nome;
		var line_id = lines[index].id;
		$('#lines-sel').append($('<option>')
			.text(line_name)
			.attr('value', line_id)
		);
	});

	});
}; 

function getWay(way_val) {
	var wayAPI = host + "OperadorServiceRest/sentidos/" + way_val;

	$.getJSON(wayAPI, function(json) {
	var ways = json.sentidos;
	console.log(wayAPI);
	$.each(ways, function(index, value) {
		var ways_name = ways[index].nome;
		var ways_id = ways[index].id;
		var ways_tipo = ways[index].tipo;
		
		$('#lines-way').append($('<option>')
			.text(ways_name)
			.attr('value', ways_id)
		);
	});
	});
	return way_val;
};

function getStop(stop_val) {
	var stopAPI = host+ "OperadorServiceRest/pontos/" + stop_val;
	console.log(stopAPI);
	$.getJSON(stopAPI, function(json) {
	var stop = json.pontos;
	$.each(stop, function(index, value) {
		var stop_name = stop[index].nome;
		var stop_id = stop[index].id;
		var stop_tipo = stop[index].tipo;
		var stop_lat = stop[index].latitude;
		var stop_long = stop[index].longitude;
		var stop_fac = stop[index].patternFraction;
		
		$('#lines-stop').append($('<option>')
			.text(stop_name)
			.attr('value', stop_id)
			.attr('pat', stop_fac)
		);

	});
	});
};



function update() {
	
	clearInterval(updateTimes);	

	var way_sel = $("#lines-way option:selected").val();
	var line_sel = $("#lines-sel option:selected").val();
	var stop_pat = $("#lines-stop option:selected").attr('pat');
	var stop_sel_API = host + "OperadorServiceRest/sentido/" + way_sel +"/tamanho";
	var stop_time_API = host + "OperadorServiceRest/sentido/" + line_sel + "/" + way_sel + "/tempomedio";

	$.getJSON(stop_sel_API, function(json) {
		meters = json.int
		console.log("meters: " + meters);
		caldist = calDis(meters, stop_pat);
	
	
		$.getJSON(stop_time_API, function(json) {
			timing = json.double;
			console.log("timing: " + timing);
			caltime = calTime(timing, stop_pat);
			
			getBuses(line_sel, way_sel, stop_pat, caltime, caldist);
			updateTimes = setInterval(function(){
					getBuses(line_sel, way_sel, stop_pat, caltime, caldist);
				}, 20000);
		});

	});

//	caltime = calTime(timing, stop_pat);
//	caldist = calDis(meters, stop_pat);
//	getBuses(line_sel, way_sel, stop_pat, caltime, caldist);
};

function getBuses(line, dir, pat, caltime, caldist) {
 var getBus_API = host + "OperadorServiceRest/veiculosDaLinha/" + line + "/" + dir;
 $.getJSON(getBus_API, function(json) {
  var bus = json.veiculos.reverse();
  console.log(bus);
 $("#bus-list").empty();
 $.each(bus, function(index, value) {
  var bus_pat = bus[index].patternFraction;
  var bus_id = bus[index].id;
  var bus_code = bus[index].codigo;
  var bus_lat = bus[index].latitude;
  var bus_lng = bus[index].longitude;

  console.log(caltime);
  if (bus_pat < pat) {
   var time2next = (caltime - ((bus_pat*timing)/60.0));
   var time = Math.abs(time2next) >>> 0;
   console.log(time);
   if (time == 0) {
   		time = "Now";
   } else if (time == 1) {
   		time = time + " min"
   } else {
   		time = time + " mins"
   }

   var appended = $('<div class="bus-box"><a href="map.html"><div class="bus-time"><div class="bus-box-left pull-left"><p>'+ time +'</p><img src="img/bus.png" height="40px" width="auto"></div></div><div class="bus-right pull-left"><div class="bus-line"><p class="vehicle-title">' + bus_code + '</p><img src="img/loc.png" width="10px" height="auto" class="topminus5"><span class="geo">Current Location</span></div></div></a></div>');

   $("#bus-list").append(appended);
   appended.geocoder(bus_lat, bus_lng); 
  }
  });
 });
}

function calTime(value1, value2) {
	var time_to_busStop = (value1*value2)/60.0;
	return time_to_busStop;
};

function calDis(value1, value2) {
	var dis_to_busStop = (value1*value2)/1000.0;
	return dis_to_busStop;
}

$("#lines-sel").change(function() {
	var way_val = $("#lines-sel option:selected").val();
	var way = way_val;
	 if (way_val > 0) {
	 	$("#lines-way option[value!= '0']").remove();
	 	$("#lines-way").removeAttr('disabled');
	 	getWay(way_val);
	 } else {
	 	console.log("Select not active");
	 };
	 return way_val;
});

$("#lines-way").change(function() {
	var stop_val = $("#lines-way option:selected").val();
	var stop = stop_val;
	 if (stop_val > 0) {
	 	$("#lines-stop option[value!= '0']").remove();
	 	$("#lines-stop").removeAttr('disabled');
	 	getStop(stop);
	 } else {
	 	console.log("Select not active");
	 };
	 return stop_val;
});


$("#lines-stop").change(function() {
	$("#run-btn").removeAttr('disabled');
});

$("#load-sel").click(function() {
	getLines();
});

$("#run-btn").click(function() {
	$("#lineModal").modal("hide");
	update();
});
