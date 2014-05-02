var linesAPI = 'http://173.224.125.206:8803/OperadorServiceRest/linhas';
var line_Data = [];
var way_val = "";

function getLines(){
	$.getJSON(linesAPI, function(json) {
	var lines = json.linhas;
	$.each(lines, function(index, value) {
		var line_name = lines[index].nome;
		var line_id = lines[index].id;
		console.log(line_name);
		$('#lines-sel').append($('<option>')
			.text(line_name)
			.attr('value', line_id)
		);
	});


	console.log('line id :', lines);
	});
}; 

function getWay(way_val) {
	var wayAPI = "http://173.224.125.206:8803/OperadorServiceRest/sentidos/" + way_val;

	$.getJSON(wayAPI, function(json) {
	var ways = json.sentidos;
	$.each(ways, function(index, value) {
		var ways_name = ways[index].nome;
		var ways_id = ways[index].id;
		var ways_tipo = ways[index].tipo;
		
		$('#lines-way').append($('<option>')
			.text(ways_name)
			.attr('value', ways_id)
		);
	});
	console.log(wayAPI);
	});
};

function GetStop() {

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
});


$("#load-sel").click(function() {
	getLines();
});