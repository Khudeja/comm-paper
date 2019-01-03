'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('app');
var buy = require('./buy.js');          //requires the exported buypaper function from buy.js
var redeem = require('./redeem.js');    //requires the exported redeempaper function from redeem.js
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var cors = require('cors');

var hfc = require('fabric-client');

const host = "localhost";
const port = 7000;

app.options('*', cors());

app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});
//logger.info('****************** SERVER STARTED ************************');
//logger.info('***************  http://%s:%s  ******************',host,port);
console.log('****************** SERVER STARTED ************************');
console.log('***************  http://%s:%s  ******************',host,port);
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

// Invoke transaction on chaincode on target peers
app.post('/orgname/:orgName/function/:funcName', async function(req, res) {
	logger.debug('==================== INVOKE ON CHAINCODE ==================');
	var orgName = req.params.orgName;
	var funcName = req.params.funcName;
	var args = req.body.args;
    //logger.debug('orgName  : ' + orgName);
    //logger.debug('functionname  : ' + funcName);
	//logger.debug('args  : ' + args);
	console.log('orgNameApp  : ' + orgName);
	console.log('funcNameApp  : ' + funcName);
    console.log('argsApp : ' + args);
	if (!orgName) {
		res.json(getErrorMessage('\'orgName\''));
		return;
	}
	if (!funcName) {
		res.json(getErrorMessage('\'funcName\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

    if (funcName == 'buy'){
	    let message = await buy.buypaper(orgName, funcName, args);
        res.send(message);
    }
	else if (funcName == 'redeem'){
        let message = await redeem.redeempaper(orgName, funcName, args);
        res.send(message);
    }
});