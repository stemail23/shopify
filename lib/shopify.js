const EventEmitter = require('events').EventEmitter;
const util = require('util');

function Shopify(config) {
	this.config = config;
}

util.inherits(Shopify, EventEmitter);

Shopify.prototype.foo = function() {
	console.log('bar');
};

exports.Shopify = Shopify;
