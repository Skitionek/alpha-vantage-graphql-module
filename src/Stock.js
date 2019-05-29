/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { contains, fragmentResolver } from "./utilities";
import { alphaVantageInterface } from "./constants";
import { required, tryAccess } from "./utils";

const stockTimeSeriesFields = ['information', 'updated', 'size', 'zone', 'data'];

function getStockTimeSeries(parent, args, { injector }, info) {
	const { symbol, interval, ...rest } = {
		...parent,
		...args
	};
	if (!interval) return null;
	const adjusted_fields = ['adjusted_close', 'volume', 'dividend_amount', 'split_coefficient'];
	const adj_fields = (tryAccess(info, 'fieldNodes', 0, 'selectionSet', 'selections',
		e => tryAccess(e, 'name', 'value') === 'data',
		'selectionSet', 'selections') || [])
		.map(e => tryAccess(e, 'name', 'value'))
		.filter(e => contains(adjusted_fields, e));
	const func = adj_fields.length ? 'exchangeTimeSeries_adjusted' : 'exchangeTimeSeries';
	return injector.get(alphaVantageInterface).data[func]({ ...required({ symbol, interval }), ...rest })
}

const stockQuoteFields = ['open', 'high', 'low', 'price', 'volume', 'date', 'close', 'change', 'change_percent'];

function getStockQuote(parent, args, { injector }, info) {
	const { symbol, ...rest } = { ...parent, ...args };
	return injector.get(alphaVantageInterface).data.quote({ symbol: required({ symbol }), ...rest })//.then(setType("StockQuote"));
}

export default {
	...fragmentResolver(getStockQuote, undefined, stockQuoteFields),
	...fragmentResolver(getStockTimeSeries, undefined, stockTimeSeriesFields)
}