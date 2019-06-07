/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-05-01
*/
export { integrationSnapshots as snaps } from 'alpha-vantage-data-source/lib/test';
import { mapValues } from "lodash";

export const API_TOKEN = 'demo';

export const alphaVantageInterface = 'AlphaVantage';

export const fields = Object.keys;
//
// export const stockTimeSeriesFieldsAdjusted_fields = Object.keys(snaps.data.daily_adjusted);
// export const stockTimeSeriesFields = new Set(['information', 'last_refreshed', 'output_size', 'time_zone', 'data']);
// export const stockQuoteFields = new Set(['open', 'high', 'low', 'price', 'volume', 'date', 'close', 'change', 'change_percent']);
//
//
// export const quoteFields = new Set(['from_currency_code', 'from_currency_name', 'to_currency_code', 'to_currency_name', 'exchange_rate', 'last_refreshed', 'time_zone', 'bid_price', 'ask_price', 'from_currency_code', 'from_currency_name', 'to_currency_code', 'to_currency_name', 'exchange_rate', 'last_refreshed', 'time_zone', 'bid_price', 'ask_price']);
//
// export const timeSeriesFields = new Set(['information', 'digital_currency_code', 'digital_currency_name', 'market_code', 'market_name', 'last_refreshed', 'time_zone', 'information', 'from_symbol', 'to_symbol', 'last_refreshed', 'interval', 'output_size', 'time_zone', 'data']);
//
//
// export const techincalIndexes = new Set(['sma', 'ema', 'wma', 'dema', 'tema', 'trima', 'kama', 'mama', 'vwap', 't3', 'macd', 'macdext', 'stoch', 'stochf', 'rsi', 'stochrsi', 'willr', 'adx', 'adxr', 'apo', 'ppo', 'mom', 'bop', 'cci', 'cmo', 'roc', 'rocr', 'aroon', 'aroonosc', 'mfi', 'trix', 'ultosc', 'dx', 'minus_di', 'plus_di', 'minus_dm', 'plus_dm', 'bbands', 'midpoint', 'midprice', 'sar', 'trange', 'atr', 'natr', 'ad', 'adosc', 'obv', 'ht_trendline', 'ht_sine', 'ht_trendmode', 'ht_dcperiod', 'ht_dcphase', 'ht_phasor']);
//
//
