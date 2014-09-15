var host = conf.path_to_webservice;
var linesAPI = conf.path_to_webservice + 'linhas';
var time2Update = conf.min_time_to_refresh;
var secondsLeft = 0;
var line_Data = [];
var way_val, stop_val = 0;
var meters = 0;
var timing = 0;
var updateTimes;
var buslist = [];
var sel_bus_lat;
var bus_store = new Store();
var map;

var configArrival = {
	line_sel: null, 
	way_sel: null, 
	stop_pat: null, 
	caltime: null, 
	caldist: null,
	linesObj_origin: null,
	waysObj_origin: null,
	stopsObj_origin: null,
	lineObj: null,
	wayObj: null,
	stopObj: null
};

$.ajaxSetup({ 
	cache: false,
	beforeSend: function(jqXHR) {
    	jqXHR.overrideMimeType("text/html;charset=iso-8859-1");
    }
});

function setLoading(input, enable){
	
	if(typeof enable == undefined || enable == null || enable == true){
		input.prev('i').removeClass('hide');
		input.attr('disabled', 'true');
	}else{
		input.prev('i').addClass('hide');
		input.removeAttr('disabled');
	}
}


function getLines(){
	
	var select = $('#lines-sel');
	setLoading(select);
	
 	$.getJSON(host + "linhas", function(json) {
  		var lines = json.linhas;

  		lines = lines.filter(function(e){
  			return conf.er_line_filter.test(e.nome)
  		});
  		console.log(linesAPI);
  
  		configArrival.linesObj_origin = lines;
  
  		$.each(lines, function(index, value) {
   
   			var line_name = lines[index].nome;
   			var line_id = lines[index].id;
   			select.append($('<option>')
    			.text(line_name)
    			.attr('value', line_id)
   			);
  		});
  		setLoading(select, false);
  		select.trigger('change');
 	});
}

function getWay(way_val) {
	var wayAPI = host + "sentidos/" + way_val;
	var select = $('#lines-way');
	
	setLoading(select);
	
	$.getJSON(wayAPI, function(json) {
		var ways = json.sentidos;
		console.log(wayAPI);
	
		configArrival.waysObj_origin = ways;
		
		$.each(ways, function(index, value) {
			var ways_name = ways[index].nome;
			var ways_id = ways[index].id;
			var ways_tipo = ways[index].tipo;
			
			$('#lines-way').append($('<option>')
				.text(ways_name)
				.attr('value', ways_id)
			);
		});
		setLoading(select, false);
		$('#lines-way').trigger('change');
	});
	return way_val;
}

function getStop(stop_val) {
	var stopAPI = host+ "pontos/" + stop_val;
	var select = $('#lines-stop');
	
	setLoading(select);
	
	console.log(stopAPI);
	$.getJSON(stopAPI, function(json) {
		var stop = json.pontos;
		
		configArrival.stopsObj_origin = stop;
		
		
		$.each(stop, function(index, value) {
			var stop_name = stop[index].nome;
			var stop_id = stop[index].id;
			var stop_tipo = stop[index].tipo;
			var stop_lat = stop[index].latitude;
			var stop_long = stop[index].longitude;
			var stop_fac = stop[index].patternFraction;
			
			$('#lines-stop').append($('<option>').text(stop_name).attr('value', stop_id).attr('pat', stop_fac));
	
		});
		setLoading(select, false);
		$('#lines-stop').trigger('change');
	});
}



function update() {
	
	//clearInterval(updateTimes);
	secondsLeft = 0;

	var way_sel = $("#lines-way option:selected").val();
	var line_sel = $("#lines-sel option:selected").val();
	var stop_pat = $("#lines-stop option:selected").attr('pat');
	var stop_sel_API = host + "sentido/" + way_sel +"/tamanho";
	var stop_time_API = host + "sentido/" + line_sel + "/" + way_sel + "/tempomedio";

	$.getJSON(stop_sel_API, function(json) {
		meters = json.int;
		console.log("meters: " + meters);
		caldist = calDis(meters, stop_pat);
	
	
		$.getJSON(stop_time_API, function(json) {
			timing = json.double;
			console.log("timing: " + timing);
			caltime = calTime(timing, stop_pat);
			
			
			configArrival.line_sel = line_sel;
			configArrival.way_sel = way_sel;
			configArrival.stop_pat = stop_pat;
			configArrival.caltime = caltime;
			configArrival.caldist = caldist;
			
			
			getBuses();
			updateTimes = setInterval(updateData, 1000);
		});

	});
	
		$('.line-title').html(configArrival.lineObj.nome.toUpperCase() +" - "+ configArrival.stopObj.nome.toUpperCase());
		$(window).scrollTop(0);

//	caltime = calTime(timing, stop_pat);
//	caldist = calDis(meters, stop_pat);
//	getBuses(line_sel, way_sel, stop_pat, caltime, caldist);
}

function updateData(){
	//var progress = document.querySelector('progress');
	var indicator = $('.circle-fill'); //$('#displayGauge');
	var refresh = $('#refresh');
	var divGauge = $('#content-gauge');
	var compName = $('.comp-name');
	
	if(secondsLeft <= 1){
		indicator.removeClass('zoomOut');
		indicator.addClass('zoomIn');

		//divGauge.addClass('gauge-slide-right');
		//compName.addClass('comp-name-to-big');

		refresh.removeClass('zoomIn');
		refresh.addClass('zoomOut');
		refresh.attr('disabled', true);
	}

	if(secondsLeft == time2Update){

		//getBuses();
		
		//gauge.set(0)
		//progress.value = 0;
		indicator.removeClass('zoomIn');
		indicator.addClass('zoomOut');


		//divGauge.removeClass('gauge-slide-right');
		//compName.removeClass('comp-name-to-big');

		
		refresh.removeClass('zoomOut');
		refresh.addClass('zoomIn');
		refresh.removeAttr('disabled');
	}else{
		secondsLeft++;
		
		//indicator.css("-webkit-transform", "scale("+ (secondsLeft/time2Update) +")");

		gauge.set(secondsLeft*100/time2Update)
		//progress.value = secondsLeft*100/time2Update;
	}

	
	
}

function getBuses() {
	
	var arrV = configArrival;
	
	//$('.circle-fill').css("-webkit-transform", "scale("+ (secondsLeft/time2Update) +")");
	gauge.set(0);
	secondsLeft = 0;

	//document.querySelector('progress').value = 0;
	var getBus_API = host + "veiculosDaLinha/" + arrV.line_sel + "/" + arrV.way_sel;
	$.getJSON(getBus_API, function(json) {
		var bus = json.veiculos.reverse();
		bus_store.update(bus);
		
		
		//console.log(bus);
		
	});
}

function buildList(data){
	
	var arrV = configArrival;
	
	
	$("#bus-list").empty();
	$.each(data, function(index, value) {
		var bus_pat = data[index].patternFraction;
		var bus_id = data[index].id;
		var bus_code = data[index].codigo;
		var bus_lat = data[index].latitude;
		var bus_lng = data[index].longitude;

		//console.log(bus_lng);
		if (bus_pat < arrV.stop_pat) {
			var time2next = (arrV.caltime - ((bus_pat*timing)/60.0));
			var time = Math.abs(time2next) >>> 0;
			var currentBus = [bus_lat,bus_lng];
			buslist.push(currentBus);
			//console.log(buslist);
				if (time === 0) {
				time = "Chegando";
				} else if (time == 1) {
					time = time + " min";
				} else {
					time = time + " mins";
				}

			//var appended = $('<div class="bus-box" data-toggle="modal" data-target="#mapModal" lat=' + '"' + bus_lat + '"' + " " +'lng=' + '"' + bus_lng + '"><div class="bus-time"><div class="bus-box-left pull-left"><p>'+ time +'</p><img src="img/bus@2x.png" height="35px" width="auto"></div></div><div class="bus-right pull-left"><div class="bus-line"><p class="vehicle-title">' + bus_code + '</p><img src="img/loc.png" width="10px" height="auto" class="topminus5"><span class="geo">Current Location</span></div></div></div>');

			var appended = $('<div class="bus-box" >' +
								'<div class="bus-time">' +
									'<div class="bus-box-left">' +
										'<p>'+ time +'</p>' +
										'<img src="img/bus@2x.png" height="35px" width="auto">' +
									'</div>' +
								'</div>' +
							'<div class="bus-right">' +
								'<div class="bus-line">' +
									'<p class="vehicle-title">' + bus_code + '</p>' +
									'<img src="img/loc.png" width="10px" height="auto" class="topminus5">' +
									'<span>Localização atual</span>' +
								'</div>' +
							'</div>');

			$("#bus-list").append(appended);
			appended.geocoder(bus_lat, bus_lng);
			
			myScroll.refresh();
		}
	});
}

function buildMap(data){
	map.updateVehicles(data);
}


function calTime(value1, value2) {
	var time_to_busStop = (value1*value2)/60.0;
	return time_to_busStop;
}

function calDis(value1, value2) {
	var dis_to_busStop = (value1*value2)/1000.0;
	return dis_to_busStop;
}

function maptheBus() {
	
	var mapOptions = {
		mapTypeId: google.maps.MapTypeId.Roadmap
	};

	
	map = new Map('#mapView', mapOptions);
	//map = new Map('#bus-map', mapOptions);
	map.addStopPoint(configArrival.stopObj);
	
}

function transition(x, y, z){
	this.style.webkitTransform = "translate3d("+x+"%, "+y+"px, "+z+"px)";
}


function findAt(record, name, val){
	return record.filter(function(e){
		return e[name] == val;
	})
}

function firstLoad() {
	getLines();
	$('#lineModal').modal('show');
	console.log("Loaded");
}

$("#lines-sel").change(function() {
	var way_val = $("#lines-sel option:selected").val();
	var way = way_val;
	if (way_val > 0) {
		$("#lines-way option[value!= '0']").remove();
		$("#lines-way").removeAttr('disabled');
		getWay(way_val);
		
		configArrival.lineObj = findAt(configArrival.linesObj_origin, 'id', way_val)[0];
	} else {
		console.log("Select not active");
	}
	
	return way_val;
});

$("#lines-way").on('change', function() {
	var stop_val = $("#lines-way option:selected").val();
	var stop = stop_val;
	if (stop_val > 0) {
		$("#lines-stop option[value!= '0']").remove();
		$("#lines-stop").removeAttr('disabled');
		getStop(stop);
		
		configArrival.wayObj = findAt(configArrival.waysObj_origin, 'id', stop)[0];
	} else {
		console.log("Select not active");
	}
	return stop_val;
});


$("#lines-stop").change(function() {
	$("#run-btn").removeAttr('disabled');
	
	configArrival.stopObj = findAt(configArrival.stopsObj_origin, 'id',  $("#lines-stop option:selected").val())[0];
});



$("#run-btn").click(function() {
	$("#lineModal").modal("hide");
	update();
	maptheBus();
});


$(document).click(function(e) {
	var sidr = $('#sidr');
	
	if(e.target != sidr[0] && sidr.hasClass('show-menu')) {
		toggleMenu();
	}
});

$('body').on('click','.bus-box', function(e) {
	var sel_bus_lat = $(this).attr("lat");
	var sel_bus_lng	= $(this).attr("lng");
	maptheBus(sel_bus_lat, sel_bus_lng);
	console.log(sel_bus_lat);
});

bus_store.on('update', function(store, data){
	buildList(data);
	buildMap(data);
});

$(window).resize(function(e){
	$('#mapView').height(document.body.offsetHeight - 160);
	$('#frame iframe').height(document.body.offsetHeight - 160);
});



function pageShow(selector){
	pageHide();
	
	$(selector).removeClass('hide-page');
	
	
}

function pageHide(){
	$('.show-page').addClass('hide-page');
}


function toggleMenu(){
	$('#sidr').toggleClass('show-menu');
}


function processBackButton(){
	var modal = $('div[aria-hidden=false]');
	
	if(!WxSelect.hide){
		WxSelect.pickerDisplaying.hidePicker();
	}else if(!!(modal.length)){
		modal.modal('hide');
	}else if ($('.page:nth-child(1)').hasClass('hide-page')){
		pageShow('.page:nth-child(1)');
		console.log('to page 1')
	}else{
		try{
			Device.exitAlert();
		}catch(e){}
	}
}

