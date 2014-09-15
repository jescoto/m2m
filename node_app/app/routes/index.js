/*
var conf = require('../../../config.ini.js');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  	res.render('index', conf);
});
router.post('/', function(req, res) {
	console.log(req);
  	res.redirect(req.url+'/', conf);
});

module.exports = router;
*/

module.exports = function(app){
	var conf = require('../../../config.ini.js');
	var multer = require('multer');
	//var upload = require('express-upload');

	/*
	var pub = upload()
	    .accept(['image/jpeg', 'application/pdf'])
	    .to('../../');
	*/
	//app.use(
		multer({
			dest: './temp',
			rename: function (fieldname, filename) {
		    	return filename.replace(/.+/g, 'documento').toLowerCase();
		  	},
		  	onFileUploadData: progress,
		  	onFileUploadComplete: complete,
		  	onFileUploadStart: start,
		  	onError: onError
		})
	//);

	app.route('/')
		.get(function(req, res) {
	  		res.render('index', conf);
		})
		.post(function(req, res) {
			console.log(req.files);
			if(!(!!~['pdf','doc','docx','xls','xlsx'].indexOf(req.files.upload.extension.toLowerCase()))){
				msg = "Extensão de arquivo não suportada";
				success = false;

			}

			conf.msg = msg;
			conf.success = success;

		  	res.render('index', conf);

		  	delete conf.success;
		  	delete conf.msg;
		  	msg = undefined;
		  	success = false;
		  	
		});


	function start(file, fileStream){
		console.log(file, fileStream);
	};

	function progress(file, data, fileStream){
		
		console.log(fileStream.unpipe().resume());

	};

	function complete(file){
		msg = "Arquivo enviado";
		success = true;
	};

	function onError(error, next){
		msg = error;
		success = false;
		next(error);
	};
}
