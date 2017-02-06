const async = require('async');
const path = require('path');
const fs = require('fs');
const csv = require('./lib/csv');
const config = require('./config.json');
const shopifyModule = require('./lib/shopify');

var shopify = new shopifyModule.Shopify(config);

var operations = {
	csvProducts: function(callback) {
		console.log('loading csv');
		fs.readFile(path.join(__dirname, './products.csv'), function(err, fileBuffer) {
			if (err) { return callback(err); }
			callback(null, fileBuffer.toString('utf8'));
		});
	},
	// existingProducts: function(callback) {
	// 	console.log('retrieving existing products');
	// 	shopify.products.all(callback);
	// },
	localProducts: ['csvProducts', function(results, callback) {
		console.log('retrieving csv products');
		csv.toShopifyEntityArray(results.csvProducts, callback);
	}]
};
async.auto(operations, function(err, results) {
	if (err) { return console.error(err); }
console.log(results.localProducts)
	console.log('export complete');
});
