const EventEmitter = require('events').EventEmitter;
const util = require('util');
const request = require('request');
const async = require('async');

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

function ShopifyApi(config, api) {
	this.config = config;
	this.api = api;
	this.pageLimit = 250;
}

util.inherits(ShopifyApi, EventEmitter);

ShopifyApi.prototype.parseResponse = function(response, callback) {
	if (response.statusCode === 200) {
		var body = JSON.parse(response.body);
		callback(null, body[this.api]);
	} else {
		return callback(new Error('unexpected code '+response.statusCode));
	}
};

ShopifyApi.prototype.parseResponseCallback = function(callback) {
	var that = this;
	return function(err, response) {
		if (err) { return callback(err); }
		that.parseResponse(response, callback);
	};
};

ShopifyApi.prototype.getPage = function(page, callback) {
	var params = {
		url: apiUrl(this.config, this.api),
		qs: {
			limit: this.pageLimit,
			page: page
		}
	};
	request.get(params, this.parseResponseCallback(callback));
};

ShopifyApi.prototype.all = function(callback) {
	var that = this;
	var response;
	var done = false;
	var page = 1;
	async.whilst(
		function() { return !done; },
		function(callback) {
			that.getPage(page, function(err, results) {
				if (err) { return callback(err); }
				page += 1;
				if (!results) { done = true; }
				else {
					done = (results.length < that.pageLimit);
					if (!response) { response = results; }
					else { response = response.concat(results); }
				}
				callback(null, response);
			});
		},
		function(err, n) {
			callback(err, response);
		}
	);
};

function Shopify(config) {
	var that = this;
	this.config = config;
	const apis = ['products', 'custom_collections', 'smart_collections'];
	apis.forEach(function(api) {
		that[api] = new ShopifyApi(config, api);
	});
}

util.inherits(Shopify, EventEmitter);

exports.Shopify = Shopify;
