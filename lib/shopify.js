const EventEmitter = require('events').EventEmitter;
const util = require('util');
const request = require('request');

function storeBaseUrl(config) {
	return 'https://'+config.apiKey+':'+config.password+'@'+config.storeName+'.myshopify.com/';
}

function storeAdminUrl(config) {
	return storeBaseUrl(config)+'admin/';
}

function apiUrl(config, apiName, command) {
	var api = storeAdminUrl(config)+apiName;
	api += (command ? ('/'+command+'.json') : ('.json'));
	return api;
}

function Shopify(config) {
	this.config = config;
}

util.inherits(Shopify, EventEmitter);

Shopify.prototype.parseResponse = function(response, callback) {
	if (response.statusCode === 200) {
		var body = JSON.parse(response.body);
		callback(null, body);
	} else {
		return callback(new Error('unexpected code '+response.statusCode));
	}
};

Shopify.prototype.parseResponseCallback = function(callback) {
	var that = this;
	return function(err, response) {
		if (err) { return callback(err); }
		that.parseResponse(response, callback);
	};
};

Shopify.prototype.foo = function(callback) {
	var params = {
		url: apiUrl(this.config, 'smart_collections')
	};
	request.get(params, this.parseResponseCallback(callback));
};

exports.Shopify = Shopify;
