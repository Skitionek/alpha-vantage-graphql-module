/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface } from "./constants";
import { required } from "./utils";

export function exchangeRates(parent, args, { injector }, info) {
	const { from_currency = parent.symbol, to_currency } = {
		...parent,
		...args
	};
	if (!from_currency || !to_currency) return null;
	return injector.get(alphaVantageInterface).crypto.exchangeRates(required({
		from_currency,
		to_currency
	}));
}

export default exchangeRates