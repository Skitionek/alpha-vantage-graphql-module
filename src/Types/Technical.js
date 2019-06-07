/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-29
*/

import { alphaVantageInterface } from "../constants";
import { required } from "../utilities";

const indx = ['sma', 'ema', 'wma', 'dema', 'tema', 'trima', 'kama', 'mama', 'vwap', 't3', 'macd', 'macdext', 'stoch', 'stochf', 'rsi', 'stochrsi', 'willr', 'adx', 'adxr', 'apo', 'ppo', 'mom', 'bop', 'cci', 'cmo', 'roc', 'rocr', 'aroon', 'aroonosc', 'mfi', 'trix', 'ultosc', 'dx', 'minus_di', 'plus_di', 'minus_dm', 'plus_dm', 'bbands', 'midpoint', 'midprice', 'sar', 'trange', 'atr', 'natr', 'ad', 'adosc', 'obv', 'ht_trendline', 'ht_sine', 'ht_trendmode', 'ht_dcperiod', 'ht_dcphase', 'ht_phasor'];

export default indx.reduce((o, n) => {
	o[n] = (p, a, { injector }, i) => {
		const { symbol, interval, ...rest } = { ...p, ...a };
		return injector.get(alphaVantageInterface).technical[n]({
			...required({
				symbol, interval
			}),
			...rest
		});
	};
	return o;
}, {});


function Technical(parent, { symbol = parent, market, outputsize, datatype, interval = "daily" }, { injector }, info) {
	console.log(arguments);
	return true;
}