import alphaVantage from "alpha-vantage-data-source";
import { required } from './utils';
import { GraphQLModule } from '@graphql-modules/core';
import 'graphql-import-node';
import * as typeDefs from './schema.graphql';
import { alphaVantageInterface } from "./constants";
import { contains, forward, fragmentResolver } from "./utilities";
import Stock from './Stock';
import ForeignExchange from './ForeignExchange';
import CryptocurrencyExchangeRate from './CryptocurrencyExchangeRate';
import Cryptocurrency from "./Cryptocurrency";

export const alphaVantageProviderFactory = (API_TOKEN, params) => ({
	provide: alphaVantageInterface,
	useFactory: () => new alphaVantage({ key: API_TOKEN }), // Init database connector
	...params
});
const API_TOKEN = 'demo';
const alphaVantageProvider = alphaVantageProviderFactory(API_TOKEN);


const setType = type => r => (r.type = type) && r;


const StockData = {};
StockData.__resolveType = (data) => {
	return crossSearch(Object.keys(data), ['adjusted_close', 'dividend_amount']) ? 'StockAdjustedTimeSeriesData' : 'StockTimeSeriesData';
}

export const crossSearch = (arr1, arr2) => arr1.some(r => arr2.includes(r));


function Technical(parent, { symbol = parent, market, outputsize, datatype, interval = "daily" }, { injector }, info) {
	console.log(arguments);
	return true;
}

const indx = ['sma', 'ema', 'wma', 'dema', 'tema', 'trima', 'kama', 'mama', 'vwap', 't3', 'macd', 'macdext', 'stoch', 'stochf', 'rsi', 'stochrsi', 'willr', 'adx', 'adxr', 'apo', 'ppo', 'mom', 'bop', 'cci', 'cmo', 'roc', 'rocr', 'aroon', 'aroonosc', 'mfi', 'trix', 'ultosc', 'dx', 'minus_di', 'plus_di', 'minus_dm', 'plus_dm', 'bbands', 'midpoint', 'midprice', 'sar', 'trange', 'atr', 'natr', 'ad', 'adosc', 'obv', 'ht_trendline', 'ht_sine', 'ht_trendmode', 'ht_dcperiod', 'ht_dcphase', 'ht_dcphasor'];

export default new GraphQLModule({
	typeDefs,
	resolvers: {
		Query: {
			symbolSearch: (parent, args, { injector }, ...rest) =>
				injector.get(alphaVantageInterface).data.search(args),
			stock: forward,
			cryptocurrency: Cryptocurrency,
			cryptocurrencyExchangeRate: forward,
			foreignExchange: forward,
			technical: forward
		},
		Technical: indx.reduce((o, n) => {
			o[n] = (p, a, { injector }, i) => {
				const { symbol, interval, ...rest } = { ...p, ...a };
				return injector.get(alphaVantageInterface).technical[n]({
					...required({
						symbol, interval
					}),
					...rest
				});
			}
			return o;
		}, {}),
		Cryptocurrency,
		ForeignExchange,
		Stock,
		StockData,
		CryptocurrencyExchangeRate,
		// StockData,
		// StockTimeSeries,
		Company: {
			stock: forward
		}
	},
	providers: [
		alphaVantageProvider
	]
});
