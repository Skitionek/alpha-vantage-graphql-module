/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface, fields, snaps } from "../constants";
import { fragmentResolver, required } from "../utils";

function requestExchangeRates(parent, args, { injector }, info) {
	const { from_currency = parent.Ticker, to_currency } = {
		...parent,
		...args
	};
	if (!from_currency || !to_currency) return undefined;
	return injector.get(alphaVantageInterface).forex.exchangeRates(required({
		from_currency,
		to_currency
	}));
}

function requestTimeSeries(parent, args, { injector }, info) {
	const { from_symbol, to_symbol, interval = "daily", outputsize } = {
		...parent,
		...args
	};
	if (!from_symbol || !to_symbol) return undefined;
	return injector.get(alphaVantageInterface).forex.exchangeTimeSeries({
		...required({
			from_symbol,
			to_symbol,
			interval
		}), outputsize
	});
};

export default {
	...fragmentResolver(requestExchangeRates, undefined, fields(snaps.forex.exchangeRates)),
	...fragmentResolver(requestTimeSeries, undefined, fields(snaps.forex.exchangeTimeSeries))
}