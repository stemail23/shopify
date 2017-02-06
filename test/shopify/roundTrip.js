/* jshint expr:true */
const should = require("should");
const shopifyModule = require('./../../lib/shopify');
const config = require('./../../config.json');
const csv = require('./../../lib/csv');

describe('setup', function() {
	this.timeout(60000);
	var shopify;
	var shopifyProducts;
	var csvProducts;
	var roundTripProducts;
	before(function() {
		shopify = new shopifyModule.Shopify(config);
	});

	it('shopify module should exist', function() {
		should.exist(shopifyModule);
	});
	it('csv module should exist', function() {
		should.exist(csv);
	});
	it('config should exist', function() {
		should.exist(config);
	});
	it('shopify should exist', function() {
		should.exist(shopify);
	});
	it('export should work', function(done) {
		shopify.products.all(function(err, products){
			should.not.exist(err);
			shopifyProducts = products;
			should.exist(shopifyProducts);
			shopifyProducts.length.should.be.greaterThan(0);
			done();
		});
	});
	it('csv fromShopifyEntityArray should work', function(done) {
		csv.fromShopifyEntityArray(shopifyProducts, function(err, products){
			should.not.exist(err);
			csvProducts = products;
			should.exist(csvProducts);
			done();
		});
	});
	it('csv toShopifyEntityArray should work', function(done) {
		csv.toShopifyEntityArray(csvProducts, function(err, products){
			should.not.exist(err);
			roundTripProducts = products;
			should.exist(roundTripProducts);
			done();
		});
	});
	it('round tripped product array length should be the same as the original', function(done) {
		roundTripProducts.length.should.equal(shopifyProducts.length);
		done();
	});
});

