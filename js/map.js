var Map;

Map = (function() {
  Map.prototype.mapOptions = {
    zoom: 16,
    disableDefaultUI: true,
    panControl: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    overviewMapControl: true
  };

  function Map(mapId, opt) {
    var curr_opt;
    for (curr_opt in this.mapOptions) {
      if (opt[curr_opt] != null && typeof opt[curr_opt] != undefined && typeof this.mapOptions[curr_opt] != undefined) {
        this.mapOptions[curr_opt] = opt[curr_opt];
      }
    }
    this.map = new google.maps.Map(document.querySelector(mapId), this.mapOptions);
  }

  Map.prototype.getMap = function() {
    return this.map;
  };

  Map.prototype.addMarker = function(vehicle) {
    var busCord;
    busCord = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);
    
    
    return this.marker.push(new MarkerWithLabel({
      	position: busCord,
      	map: this.map,
      	id: vehicle.codigo,
      	icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAArCAYAAAA65tviAAAK80lEQVRoQ92ZC3BU5RXH/7t3389s3mEJKkkQFMgQkvAYRigwlTqoVDq2MhZb1JKh1rQgVNumMCBG0GoULB2mWsNIp2JbdUADQwoEKSXoIAgkCNoYIoQkkGSTzW52s4+ec3fvZvPYZW/AGad35tu7u/e73z2/7zy+c76rwP/JoRgBh2LXrl3KEdyX8C11dXXBdevWBRK+gTomBNLQ0KBTq9UzVCrVXLpnrEKh0Er30nc5z4vZNxgMRq7Rd08gEGikPw61tbUdyc/P77neQ64rxYULF3L0ev1aQRDuVyqVFknwmwUwWEAJiM8E0+P3+/e63e61eXl5Z+PBxAWpr6+/1WQy/YUA5rDg35TwsQRkGG4E80lvb+/ScePG1cfqGxOE/EBTVFT0CplTCd9MMNGqv56mb+h69ISRVsSxfD7f29euXVtWWFjoGm7wmCCnTp0qsFqt+2jQ1Fja4P+VShqi37xHDBAIz/5wphY2s26n03nfpEmTDskFWWE0GreSRhSsjcFmxT7edrUd57+6BIfLgwDFjRBP4lQ0Ko0LWE0GjBuThbTkpCF3hyHYvNDT01M2efLkZ2WBHD9+/Dnyj2d0Oh0IRgTphwni8PFTqDx4Gi3KVEBnwcRUAWNt6oQx2BQutPagzqGEWlDCbgjgR4WjMeuOMaCZC01JWEtkVvB4POju7t5eXFy8XBbI0aNHN5vN5tUGgwEajSYCoSSgxkvN+M2OA+jMmAKtyUoPBH46SY9FdyYjkKBCWNa/HjiJnQ1aqI1W+EnYdJULZfPsGJNipnHC+qWz1+uFy+VikNdnzpz5mCyQI0eObLZYLKvJvKDVaiMgAkmw5/BxbD3hgi4zl6YtIM7ckvEafC/PKIJELQmi6YRmN3SWfgv0ZVfNSfyj2QKNOVnsoCR9lhaaMDvXBn+4P4/NIGRWIwORNELmJWpEilos1/b3a/DPK1ayqGTx4ezwqf52mLovQlAEoabZVgsUCKhvm8svSm/TKuEjoXwUhHxEy8Hoai/gTBkPhcYgaoCFf2iCDksK0mnU0AwwCJsVg3R1dcnXCIOwRhgkWiMBvw/P7qyGKn0spuekQUsC60hyDQuvDIq/GUKjUooCbNxTB2NKJn45M020/T6S1iu2APoYKqhEL9Hx/7UN7VAJAlbNvQWseQmENUIRSwSZMWOGPNM6duzYENNiZ+eZeebNaiyeNx3z78iImIBkt6JF8Ee476rKw7COzsP6BbdAq1FFzHtw3BdIq1W1dfjgfA82PJAPk44CR9jZJRCHwzEyEFpHIj4iheDmljb8dudHWPngdzBpdFJc52bolW/WwGrPw4Z7bhsAMthh2TxP1DdgS00jnn2wCKNsBtGvok2LQaZNmyZPI7W1tZsZJNpHGObM+f/ihd2fYeNP5sOeHHpYrINBfvX6QVjsudh4Xy606n6NDAEhDX51uQVlfz+J1d8vxuRsm+g3krNLpkXZhnyQpKSkASBst9X/+RRvf9KMF5bNg0Uff91gkNLt1SJI+aLb42qEzbbT0YVVlUfw0Nwp+O7ETNFsB2tENsjHH38sakQKv6wNtuMdu2vw2VVg48OzyDHjlyUM8ott+2AZlYtNP5hAIOrY6qMr7AtPv/EvTLlzHB65KyccykNRS9II5VryNCKBREctTkI2VX4AwZqFpxZNjbuK8wzzw594bS+B5GDzgxOhI2ePu17SmlS+8yAEcxrW3D+JI8YA02IfuSkgvr4+/Pq1d1FYkI8fzxkfWX2Hn+ZQhFvx6h6Ys3Lw4pJ8ESTewQ7/5/f/jTNXgyh/eDrUKuHmg7BpURzHzyveQ3JqBm4z9oZBYpc0fQR+4HMHDBljMSvDDUXAK85yrIMT6c+/bofbaMcrj98Fq1HHxZVocqzdG9KI5CNUIaKJcqzlFR+iVZmBgNcdd3aliyqtHgqVBj63k7IZWuWvdygF3JJhw9ZlU2FPpZyLsoAb8pHo8MsrO4N80XARJVsPoEs7asi8xis1KYhywj4swmCf4XCeblYRSAFuzaBkMkojvLLLjlrSyi45u0AR6uKlKyh5ZT/akAYD5SQsGqcaBo0Ap8cfd00ZjoITSJNWgNvrJ3+grI0gXN4AspO12PpYIbI4Cx4EIntBlHKtftNSoqX1GkperkK3Kh0r7x0Hi0GNlk438rIs+OMHZ3DiontASRzPijhpLBxrRcmCPHzZ3IU0qx7dPW68+F4d0pPN2PKzYqRYKJkMg0hJo+xci9N4rkeklZ0Xw/ZOB1b8YQ9c6jS8/GgBbHolOrt7MCo9Bc+9UYWqC0qoNLrreYF4nW1/YUEannpgIq60XoXVbEYHjf8EmW5mdg45ezHMUc4ugcyaNUveOnLo0KFI9iul8U5eqV/ajfoOI3JsfZSDt6DLp0aWVYVzl3vgNXB1JyQEwr5hUPmRa3aC87ckWwoFBAe+6DKieHIeNj9aCL1WM0Qjs2fPlgdSXV09ZGXnELjypfdxtsMCk14FJdUeLDin9oLA5bC8DUgOAlwZ8vrB4cDvo7qcInRhjhXly4pg0DNIf2HFzj537lx5IPv37xdNi32ENcJRq6Hxazz50ofo1Y3GPflGMq1QLnQzDs4Erjlc+PCUE0lJVry8vAhjMim7jgLhUnf+/PnyQKqqqiL1iARy/stGlL56EE5FKrTBbqCvf4spVOLKgxK3k6SoTGcOAB6lBck2CypKipAzmkpeiorRNfvdd98tD2T37t0DnZ00cqm5Fdve/RSdfQZ8cdkJjy+kCxYmJ8sIM0WxRFk49DqcHjRccYlbSXxwpcnjpFo0WH7vBGSlmiIgUs2+cOFCeSDvvPPOJsp+13DU4i0hTlF4xn1kx81tHXh622G0uo3ipoRGpcDvH56IgtvTRVNI5OAoeOTE53j+b/XwCyZx7FEpOjz36BRk2Ey0BRXaS+PwG72yL168WB5IZWXlWqrZ1xEM2E/YR6S9rSstV7GKFsZWr02cS61agXWP5KNoAtUQiYLQAvtR7WlseOsMAhqbCGInkM3LC2kdMUaqQ96Y460gyrM419uydOnSJ4ddXGPNXkVFxQ9tNttbVFypGIbTFKncdbl7UXu6CW5/qL7gOmXq7WlITeKKMTGN8KS0kGZPnG9DUKkR63wjRcJi2gfQa/vrddYGJ6sdHR1BaitKS0v/JAtkzZo1o+12+z4CuYOAwCZG70giMBwyJT9l0YOkicQQ+sVgP+ENP+kQt0fDQYO/c/bMIZ8A0NnZ2djc3LygvLz8nCwQ6qwoKyt7nCAqCEZPZgZ6TyLCfJOvGKK3Sem9CG/KsVn10U582fr161/gpCBREJ4ibkra+TbPmzfvd5mZmSUEYmCnZxDJXxJxarl9pE1r1ga9E2Gz8ra0tOzYt29f2dmzZ9tpPK4FGGaAAQzOrUUAamS0MFCz0Aa2fc6cOYvHjx+/MCUlJZu0oiFfIaVc92WXXAaxvwRCvuFpb2+/fO7cub01NTW7CKqJLjuo8Ws4yo9EoAhMLBD2Ys7+zNSSqCVT5BqTnZ2dS2ZmJ42YKZroKTRq6czQahJAoN8Cn1mjdIj5Cv0nPoPg6ZIYCcRGvwPUx0+NV6M+Ontp0jw0tpu6dZE5XW5qarpAGmmk69fCEE4600Yr+J4BWok1rZJmWChuDMaNheYXodyk73zmYpyvS/0Zglv0+BGI8GzyjHJjobgG5ln2DGrS/9xH6i+Nw/MTOUZqH8NpMtFxhxSFUTfKDXw3DDJgNr4NP0aqkW+D7ANk+B9ekm530o1KrAAAAABJRU5ErkJggg==",
		title: vehicle.codigo,
	   	labelContent: vehicle.codigo,
	   	labelAnchor: new google.maps.Point(18, 2),
	   	labelClass: "markerLabel", // the CSS class for the label
	   	zIndex: 1
    }));
  };
  
  Map.prototype.addStopPoint = function(stop){
  	var stopCord;
    var me = this;
    
    stopCord = new google.maps.LatLng(stop.latitude, stop.longitude);
    
   
    if (this.stop != null && typeof this.stop != undefined) {
    	this.stop.setMap(null);
    }
    
  	this.stop = new google.maps.Marker({
		map: me.getMap(),
		position: stopCord,
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAlCAYAAABGWhk4AAABo0lEQVR42mNgoAdQUVBwAOIGZXmF/cRiFTmFfmUFhQCchirLKcyX8En8z9247j/T0kf/Gda9J4hB6ji7dv8XC837D7JEQUFBANWlQFv586cQZRguzFux8L+SvMJ5uKFAWxSknEMoMhSGwS5XUEiAhWsDyDZqGMw++cR/UJDCDQaFEzUMBmFQWBNlsMHeT/8dDn1GwWQbLLD5w//5D3/+xwfWP/sFtpQkgwkZCgP7X/8mzWCQhv47P/B6ueDiN7DhJBkMAglnvuI1GBTWIKCw4yNxBoPCFwQIRRLMAejqcBoMc0nD9e8E8ftf/0g3mFhAssGgyLv/9S9Ww0AuJdvFIINBGnEBWJIc+KAApQpYGj3/4Q9GdgZhmGtBNEg90ekYlDZBWRZXWgYZDspEJGdpupRupGCWOVcRBoMqQlDJTw2DwdWTgkIBvHoC1VWg0p8SQ0EVq6Km3nuUClVVQcEAJEhuFQUKSjkjm/cgczCqf5BNoPpKUVP/PqhyJRaDDATpA1XKJDVggJHxHx2DxCluGY0aPGrwqME4ACjvY+seYC0T0AAA7nlxWtjrEHEAAAAASUVORK5CYII=",
    	id: stop.id,
    	title: stop.nome,
    	zIndex: google.maps.Marker.MAX_ZINDEX
	});
	
	return this.centerAt(stop.latitude, stop.longitude);
  }

  Map.prototype.updateVehicles = function(data) {
    var err;
    var me = this;
    if (this.marker == null) {
      this.marker = new Array();
    }
    try {
      this.marker.forEach(function(e) {
        return e.setMap(null);
      });
    } catch (_error) {
      err = _error;
    } finally {
      this.marker = new Array();
      data.forEach(function(e) {
        me.addMarker(e);
      });
    }
  };
  
  Map.prototype.centerAt = function(latitude, longitude){
	    var myLatlng = new google.maps.LatLng(latitude,longitude);
		
	    this.getMap().panTo(myLatlng);
	    
  };

  return Map;

})();