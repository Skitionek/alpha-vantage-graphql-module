/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface } from "../constants";
import { required } from "../utilities";
import exchangeRates from "./CryptocurrencyExchangeRate"

export function exchangeRatesWrapper(parent, args, ctx, info) {
	args.from_symbol = args.from_symbol || parent.symbol;
	return exchangeRates(parent, args, ctx, info);
}

export function exchangeTimeSeries(parent, args, { injector }, info) {
	const { symbol, market, interval = "daily" } = {
		...parent,
		...args
	};
	if (!interval) return null;
	return injector.get(alphaVantageInterface).crypto.exchangeTimeSeries(
		required({
			symbol,
			market,
			interval
		})
	);
};

export default Object.assign(
	exchangeTimeSeries,
	{ exchangeRate: exchangeRatesWrapper }
)