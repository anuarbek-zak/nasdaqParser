var compression = require('compression');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var router = express.Router();
var cheerio = require("cheerio");
var async = require('async');
const phantom = require('phantom');

// Middlewares

//Compress our responses
app.use(compression());
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 5000);

router.get('/apiForDayanchik',function (req,res) {
	var companies = [];
	(async function() {
  const instance = await phantom.create();
  const page = await instance.createPage();
  const status = await page.open('https://www.cnbc.com/nasdaq-100/');
  const content = await page.property('content');
  // console.log(content);
  var $ = cheerio.load(content)
  $('.quoteTable tbody tr').each(function(){
  	var company = []
  	var counter = 0
  	$(this).find('td').each(function(){
  		if(counter++>2) return
  		company.push($(this).text())
  	})
  	companies.push(company)
  })
  console.log(companies)
  await instance.exit();
   res.send(companies)

})();
});

app.use('/',router)

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, { message: err.message });
});

// Start server
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});