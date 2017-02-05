const csvStringifier = require('csv-stringify');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

function deParagraph(val) {
	var response = val.replace('<p>', '');
	response = response.replace('</p>', '');
	return response;
}

function csvEntityFromShopifyEntity(shopifyEntity) {
	return {
		id: shopifyEntity.id,
		handle: shopifyEntity.handle,
		title: entities.decode(shopifyEntity.title),
		body_html: deParagraph(entities.decode(shopifyEntity.body_html)),
		product_type: shopifyEntity.product_type,
		tags: shopifyEntity.tags
	};
}
module.exports.csvEntityFromShopifyEntity = csvEntityFromShopifyEntity;

function csvEntityArrayFromShopifyEntityArray(shopifyEntityArray) {
	return shopifyEntityArray.map(csvEntityFromShopifyEntity);
}
module.exports.csvEntityArrayFromShopifyEntityArray = csvEntityArrayFromShopifyEntityArray;

function fromShopifyEntityArray(shopifyEntityArray, callback) {
	var options = {
		header: true,
		columns: ['id', 'handle', 'title', 'body_html', 'product_type', 'tags']
	};
	csvStringifier(csvEntityArrayFromShopifyEntityArray(shopifyEntityArray), options, callback);
}
module.exports.fromShopifyEntityArray = fromShopifyEntityArray;

