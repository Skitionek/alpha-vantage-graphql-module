import alphaVantage from "./dataSource";
import { required } from './utils';
import { GraphQLModule } from '@graphql-modules/core';
import 'graphql-import-node';
import * as typeDefs from './schema.graphql';
import { alphaVantageInterface } from "./constants";
import { contains, forward, fragmentResolver } from "./utilities";

export const alphaVantageProviderFactory = (API_TOKEN, params) => ({
	provide: alphaVantageInterface,
	useFactory: () => new alphaVantage({key:API_TOKEN}), // Init database connector
	...params
});
const API_TOKEN = 'demo';
const alphaVantageProvider = alphaVantageProviderFactory(API_TOKEN);

function tryAccess(obj, arg, ...args) {
	switch (typeof arg) {
		case 'function':
			return tryAccess(obj.find(arg) || [], ...args);
		case 'undefined':
			return obj;
		default:
			return obj && tryAccess(obj[arg], ...args);
	}
}

const setType = type => r => (r.type = type) && r;

const stockTimeSeriesFields = ['information', 'updated', 'size', 'zone', 'data'];
function getStockTimeSeries(parent, args, { injector }, info) {
	const { symbol, symbols, outputsize, datatype, interval } = {
		...parent,
		...args
	};
	switch (interval) {
		case "1min":
		case "5min":
		case "15min":
		case "30min":
		case "60min":
			return injector.get(alphaVantageInterface).data.intraday({symbol: required({ symbol }), outputsize, datatype, interval})//.then(setType("StockTimeSeries"));
		case "daily":
		case "weekly":
		case "monthly":
			const adjusted_fields = ['adjusted_close', 'volume', 'dividend_amount', 'split_coefficient'];
			const adj_fields = (tryAccess(info, 'fieldNodes', 0, 'selectionSet', 'selections',
				e => tryAccess(e, 'name', 'value') === 'data',
				'selectionSet', 'selections') || [])
				.map(e => tryAccess(e, 'name', 'value'))
				.filter(e => contains(adjusted_fields, e));
			const adj_suffix = adj_fields.length ? '_adjusted' : '';
			return injector.get(alphaVantageInterface).data[interval + adj_suffix]({symbol: required({ symbol }), outputsize, datatype})//.then(setType("StockTimeSeries"));
		default:
			return Promise.resolve({});
			// return { symbol, symbols, outputsize, datatype, interval };
		// if (!interval || interval === "quote") {
		// 	return injector.get(alphaVantageInterface).data.quote(required({ symbol }), datatype).then(setType("StockQuote"));
		// } throw Error(`Interval value '${interval}' is not supported. Please choose one from [1min, 5min, 15min, 30min, 60min, daily, weekly, monthly, quote]. Default value is 'quote'.`)
	}
};

const stockQuoteFields = ['open', 'high', 'low', 'price', 'volume', 'date', 'close', 'change', 'change_percent'];

function getStockQuote(parent, args, { injector }, info) {
	const symbol = args.symbol || parent.symbol;
	const datatype = undefined;
	return injector.get(alphaVantageInterface).data.quote({symbol: required({ symbol }), datatype})//.then(setType("StockQuote"));
}

const StockData = {};
StockData.__resolveType = (data) => {
	return crossSearch(Object.keys(data), ['adjusted_close', 'dividend_amount']) ? 'StockAdjustedTimeSeriesData' : 'StockTimeSeriesData';
}

export const crossSearch = (arr1, arr2) => arr1.some(r => arr2.includes(r));

export const quoteFields = ['from_currency', 'from_currency_name', 'to_currency', 'to_currency_name', 'value', 'zone'];

function requestQuote(parent, args, { injector }, info) {
	const { from_currency = parent.Ticker, to_currency, from_symbol, to_symbol, interval = "daily", outputsize, datatype } = {
		...parent,
		...args
	};
	return injector.get(alphaVantageInterface).crypto.cryptoExchangeQuote(required({
		from_currency,
		to_currency
	}));
}

export const timeSeriesFields = ['information', 'from_symbol', 'to_symbol', 'last_refreshed', 'data'];

function requestTimeSeries(parent, args, { injector }, info) {
	const { from_currency = parent.Ticker, to_currency, from_symbol: from_symbolVar, to_symbol: to_symbolVar, interval = "daily", outputsize, datatype } = {
		...parent,
		...args
	};
	const from_symbol = from_symbolVar || from_currency;
	const to_symbol = to_symbolVar || to_currency;
	switch (interval) {
		case "1min":
		case "5min":
		case "15min":
		case "30min":
		case "60min":
			return injector.get(alphaVantageInterface).crypto.cryptoExchangeTimeSeries({
				...required({
					from_symbol,
					to_symbol
				}), outputsize, datatype, interval
			});
			break;
		case "daily":
		case "weekly":
		case "monthly":
			return injector.get(alphaVantageInterface).crypto.cryptoExchangeTimeSeries({
				...required({
					from_symbol,
					to_symbol
				}), outputsize, datatype, interval
			});
			break;
		default:
			throw Error(`Interval value '${interval}' is not supported. Please choose one from [1min, 5min, 15min, 30min, 60min, daily, weekly, monthly, quote]. Default value is 'quote'.`)
	}
};

function ForeignExchange(parent, args, { injector }, info) {
	return injector.get(alphaVantageInterface).crypto.cryptoExchangeTimeSeries(args);
}

function Cryptocurrency(parent, { symbol = parent.symbol, market, outputsize, datatype, interval = "daily" }, { injector }, info) {
	return injector.get(alphaVantageInterface).crypto[interval]({symbol:required({ symbol }), market, outputsize, datatype});
}

function Technical(parent, { symbol = parent, market, outputsize, datatype, interval = "daily" }, { injector }, info) {
	console.log(arguments);
	return true;
}



const indx =	['sma', 'ema', 'wma', 'dema', 'tema', 'trima', 'kama', 'mama', 'vwap', 't3', 'macd', 'macdext', 'stoch', 'stochf', 'rsi', 'stochrsi', 'willr', 'adx', 'adxr', 'apo', 'ppo', 'mom', 'bop', 'cci', 'cmo', 'roc', 'rocr', 'aroon', 'aroonosc', 'mfi', 'trix', 'ultosc', 'dx', 'minus_di', 'plus_di', 'minus_dm', 'plus_dm', 'bbands', 'midpoint', 'midprice', 'sar', 'trange', 'atr', 'natr', 'ad', 'adosc', 'obv', 'ht_trendline', 'ht_sine', 'ht_trendmode', 'ht_dcperiod', 'ht_dcphase', 'ht_dcphasor'];

export default new GraphQLModule({
	typeDefs,
	resolvers: {
		Query: {
			symbolSearch: (parent, args, { injector }, ...rest) =>
				injector.get(alphaVantageInterface).data.search(args),
			stock: forward,
			cryptocurrency: Cryptocurrency,
			cryptocurrencyExchangeRate: forward,
			foreignExchange: ForeignExchange,
			technical: forward
		},
		Technical: indx.reduce((o,n)=>{
			o[n] = (p,a,{injector},i) => {
				const {symbol,interval,...rest} = {...p,...a};
				return injector.get(alphaVantageInterface).technical[n]({
					...required({
						         symbol,interval
					         }),
					...rest
				});
			}
			return o;
		},{}),
		Cryptocurrency,
		ForeignExchange,
		Stock: {
			...fragmentResolver(getStockQuote, undefined, stockQuoteFields),
			...fragmentResolver(getStockTimeSeries, undefined, stockTimeSeriesFields)
		},
		StockData,
		CryptocurrencyExchangeRate: {
			...fragmentResolver(requestQuote, undefined, quoteFields),
			...fragmentResolver(requestTimeSeries, undefined, timeSeriesFields)
		},
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
