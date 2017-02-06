const csvStringifier = require('csv-stringify');
const csvParse = require('csv-parse');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const csvColumns = ['id', 'handle', 'title', 'body_html', 'product_type', 'tags'];

function deParagraph(val) {
	var response = val.replace('<p>', '');
	response = response.replace('</p>', '');
	return response;
}

function paragraph(val) {
	return '<p>'+val+'</p>';
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

function shopifyEntityFromCsvEntity(csvEntity) {
	return {
		id: csvEntity.id,
		handle: csvEntity.handle,
		title: entities.encode(csvEntity.title),
		body_html: paragraph(entities.encode(csvEntity.body_html)),
		product_type: csvEntity.product_type,
		tags: csvEntity.tags
	};
}
module.exports.shopifyEntityFromCsvEntity = shopifyEntityFromCsvEntity;

function shopifyEntityArrayFromCsvEntityArray(csvEntityArray) {
	return csvEntityArray.map(shopifyEntityFromCsvEntity);
}
module.exports.shopifyEntityArrayFromCsvEntityArray = shopifyEntityArrayFromCsvEntityArray;

function shopifyEntityArrayFromCsvEntityArrayCallback(callback) {
	return function(err, csvEntityArray) {
		if (err) { return callback(err); }
		return callback(null, shopifyEntityArrayFromCsvEntityArray(csvEntityArray));
	};
}

function fromShopifyEntityArray(shopifyEntityArray, callback) {
	var options = {
		header: true,
		columns: csvColumns
	};
	csvStringifier(csvEntityArrayFromShopifyEntityArray(shopifyEntityArray), options, callback);
}
module.exports.fromShopifyEntityArray = fromShopifyEntityArray;

function toShopifyEntityArray(csvData, callback) {
	var options = {
		columns: csvColumns
	};
	csvParse(csvData, options, shopifyEntityArrayFromCsvEntityArrayCallback(callback));

	// var options = {
	// 	header: true,
	// 	columns: ['id', 'handle', 'title', 'body_html', 'product_type', 'tags']
	// };
	// csvStringifier(csvEntityArrayFromShopifyEntityArray(shopifyEntityArray), options, callback);
}
module.exports.toShopifyEntityArray = toShopifyEntityArray;
