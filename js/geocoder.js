
(function( $ ){
 
	$.fn.geocoder = function(lat, lng) {
  
    	var geocoder,
    		map,
    		latlng,
    		requestTimes = 0,
    		interval;
		
		
		geocoder = new google.maps.Geocoder();
		latlng = new google.maps.LatLng(lat, lng);
		  
		
		function codeAddress(me) {
			var address = me.find('span');
		  
		  	address.text('...');
		  	geocoder.geocode( { 'latLng': latlng}, function(results, status) {
		  		if (status == google.maps.GeocoderStatus.OK) {
		  			
		  			clearTimeout(requestTimes);
		  			adComp = results[0].address_components;
		  			
		      		address.text(adComp[1].short_name+", "+adComp[0].short_name+" - "+adComp[2].short_name);
		  		} else {
		  			if(requestTimes <= 5){
		  				requestTimes++;
		  				setTimeout(function(){
		  					codeAddress(me)
		  				}, 1000);
		  			}
		    	}
		  	});
		}
		
		codeAddress(this);
 
  	};
})( jQuery );