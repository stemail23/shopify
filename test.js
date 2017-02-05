const config = require('./config.json');
const shopifyModule = require('./lib/shopify');

var shopify = new shopifyModule.Shopify(config);

shopify.foo();
