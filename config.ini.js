var conf = {
	background_image: "img/bk-lg.png", // def "img/bk-lg.png"
	path_to_webservice: "http://173.224.125.206:8803/OperadorServiceRest/",
	client_name: "Parque das Rosas",
	website: "http://www.parquedasrosas.com.br/",
	client_logo: "img/util.jpg",
	require_auth: false, // def false
	file_to_iframe : null, // def null
	min_time_to_refresh: 60, // def 60
	er_line_filter: /^\d+(\/\d+)?\s?-\s?/ // def /.*/
};

















/**
  * NÃO MEXA A PARTIR DAQUI
  *
 **/


 if(typeof module !== 'undefined' && module.exports){
 	module.exports = conf;
 }else{
 	document.querySelector('html').style.backgroundImage = "url(" + conf.background_image + ")";
	document.querySelector('#sidr > img').src = conf.client_logo;
	document.querySelector('#compani-name').innerText = conf.client_name;

	if(conf.file_to_iframe){
		document.querySelector('#frame iframe').src = "//docs.google.com/gview?embedded=true&url=" + window.location.href.substring(0, window.location.href.indexOf('#') > 0 ? window.location.href.indexOf('#') : window.location.href.length) + conf.file_to_iframe;
	}else{
		document.querySelector('#frame iframe').src = conf.website;
	}	
 }
