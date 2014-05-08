var host = "http://173.224.125.206:8803/"
var linesAPI = 'http://173.224.125.206:8803/OperadorServiceRest/linhas';
var line_Data = [];
var way_val, stop_val = 0;
var meters;
var timing;


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
	var way_sel = $("#lines-way option:selected").val();
	var line_sel = $("#lines-sel option:selected").val();
	var stop_pat = $("#lines-stop option:selected").attr('pat');
	var stop_sel_API = host + "OperadorServiceRest/sentido/" + way_sel +"/tamanho";
	var stop_time_API = host + "OperadorServiceRest/sentido/" + line_sel + "/" + way_sel + "/tempomedio";
	$.getJSON(stop_sel_API, function(json) {
	meters = json.int
});
	$.getJSON(stop_time_API, function(json) {
	timing = json.double;
	test_nan = isNAN(timing);
	test_float = pars
	console.log("timing is a " + timing + " and is " + test_nan);
	});

	var time_to_busStop = (stop_pat*timing)/60;
	console.log(stop_pat + ": Stop pat " + timing + ": timing");
};


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
