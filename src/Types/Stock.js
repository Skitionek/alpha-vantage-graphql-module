/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { contains, fragmentResolver, required } from "../utils";
import { alphaVantageInterface, fields, snaps } from "../constants";
import graphqlFields from "graphql-fields";

function getStockTimeSeries(parent, args, { injector }, info) {
	const { symbol, interval, ...rest } = {
		...parent,
		...args
	};
	if (!interval) return undefined;
	const adj_fields = Object.keys(graphqlFields(info))
		.filter(e => contains(fields(snaps.data.exchangeTimeSeries_adjusted), e));

	const func = adj_fields.length ? 'exchangeTimeSeries_adjusted' : 'exchangeTimeSeries';
	return injector.get(alphaVantageInterface).data[func]({ ...required({ symbol, interval }), ...rest })
}

function getStockQuote(parent, args, { injector }, info) {
	const { symbol, ...rest } = { ...parent, ...args };
	return injector.get(alphaVantageInterface).data.quote({ symbol: required({ symbol }), ...rest })// .then(setType("StockQuote"));
}

export default {
	...fragmentResolver(getStockQuote, undefined, fields(snaps.data.quote)),
	...fragmentResolver(getStockTimeSeries, undefined, fields(snaps.data.exchangeTimeSeries))
}