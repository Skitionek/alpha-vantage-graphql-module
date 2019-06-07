/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface } from "../constants";
import { required, fragmentResolver } from "../utilities";

export const quoteFields = ['from_currency_code', 'from_currency_name', 'to_currency_code', 'to_currency_name', 'exchange_rate', 'last_refreshed', 'time_zone', 'bid_price', 'ask_price'];

function requestQuote(parent, args, { injector }, info) {
	const { from_currency = parent.Ticker, to_currency } = {
		...parent,
		...args
	};
	if (!from_currency || !to_currency) return null;
	return injector.get(alphaVantageInterface).forex.exchangeRates(required({
		from_currency,
		to_currency
	}));
}

export const timeSeriesFields = ['information', 'from_symbol', 'to_symbol', 'last_refreshed', 'interval','output_size', 'time_zone', 'data'];

function requestTimeSeries(parent, args, { injector }, info) {
	const { from_symbol, to_symbol, interval = "daily", outputsize } = {
		...parent,
		...args
	};
	if (!from_symbol || !to_symbol) return null;
	return injector.get(alphaVantageInterface).forex.exchangeTimeSeries({
		...required({
			from_symbol,
			to_symbol,
			interval
		}), outputsize
	});
};

export default {
	...fragmentResolver(requestQuote, undefined, quoteFields),
	...fragmentResolver(requestTimeSeries, undefined, timeSeriesFields)
}