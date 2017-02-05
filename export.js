const async = require('async');
const path = require('path');
const fs = require('fs');
const csvStringifier = require('csv-stringify');
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
		var options = {
			header: true,
			columns: ['id', 'handle', 'title', 'body_html', 'product_type', 'tags']
		};
		csvStringifier(results.products, options, callback);
	}],
	save: ['csv', function(results, callback) {
		console.log('saving csv');
		var filename = path.join(__dirname, './products.csv');
		fs.writeFile(filename, results.csv, callback);
	}]
};
async.auto(operations, function(err, results) {
	if (err) { return console.error(err); }
// console.log(results.products[0])
	console.log('export complete');
});
