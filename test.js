const config = require('./config.json');
const shopifyModule = require('./lib/shopify');

var shopify = new shopifyModule.Shopify(config);

shopify.smart_collections.all(function(err, result) {
	if (err) { return console.error(err); }
	console.log(result);
	// result.forEach(function(item) {
	// 	console.log(item.id, item.handle, item.title);
	// });
});
