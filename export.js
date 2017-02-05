const async = require('async');
const path = require('path');
const fs = require('fs');
const csv = require('./lib/csv');
const config = require('./config.json');
const shopifyModule = require('./lib/shopify');

var shopify = new shopifyModule.Shopify(config);

var operations = {
	products: function(callback) {
		console.log('retrieving products');
		shopify.products.all(callback);
	},
	csv: ['products', function(results, callback) {
		console.log('generating csv');
		csv.fromShopifyEntityArray(results.products, callback);
	}],
	save: ['csv', function(results, callback) {
		console.log('saving csv');
		fs.writeFile(path.join(__dirname, './products.csv'), results.csv, callback);
	}]
};
async.auto(operations, function(err, results) {
	if (err) { return console.error(err); }
// console.log(results.products[0])
	console.log('export complete');
});
