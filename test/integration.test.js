/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import "@babel/polyfill";
import 'reflect-metadata';

import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import alphaVantageModule from '../src';
// import alphaVantage from "../src/dataSource";
import gqlGenerator from 'gql-generator-node';
import * as variables from "./mocks/variableMocks";
import alphaVantageMock from "./mocks/alphaVantageMock";
import './jest.extensions';
import { alphaVantageInterface } from "../src/constants";
import alphaVantage from "alpha-vantage-data-source";
import {
	quoteFields as cryptocurrencyExchangeRateQuoteFields,
	timeSeriesFields as cryptocurrencyExchangeRatetimeSeriesFields
} from '../src/Cryptocurrency';

describe('alphaVantage.module', () => {
	// get module and inject mockup
	const { schema, injector } = alphaVantageModule;
	injector
		.provide({
			provide: alphaVantageInterface,
			useFactory: () => new alphaVantageMock(),
			overwrite: true
		});

	// create a test server to test against, using our production typeDefs,
	// resolvers, and dataSources.
	const server = new ApolloServer({
		schema: alphaVantageModule.schema,
		context: session => session,
		formatResponse: r => {
			return r; // hook for debugging
		},
		formatError: r => {
			return r; // hook for debugging
		}
	});
	// use the test server to create a query function
	const graphql = createTestClient(server).query;

	const queries = schema.getQueryType().getFields();
	const { queries: generatedQueries, mutations, subscriptions } = gqlGenerator(schema);

	// get all queries to be tested
	const { stock, cryptocurrencyExchangeRate, cryptocurrency, symbolSearch, foreignExchange, technical, ...rest } = generatedQueries;
	const queriesWithoutTests = Object.keys(rest);
	queriesWithoutTests.forEach(query => test.todo(`Query ${query} needs to be tested!`));

	const returnNoErrors = variables => `returns no errors\t\t${JSON.stringify(variables)}`;
	const responseMatchesSchema = variables => `response matches schema\t\t${JSON.stringify(variables)}`;

	describe('Stock', () => {
		function test(variables) {
			let response;
			beforeAll(() => {
				if (Array.isArray(variables)) variables = variables[0];
				response = graphql({ query: stock, variables })
			});

			it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
			it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
		}

		describe("quote", () => test(variables.data.quote));
		describe("exchangeTimeSeries", () => test(variables.data.exchangeTimeSeries));
		describe("exchangeTimeSeries_adjusted", () => test(variables.data.exchangeTimeSeries_adjusted));
	});

	describe('cryptocurrencyExchangeRate', () => {
		function test(variables) {
			let response;
			beforeAll(() => {
				if (Array.isArray(variables)) variables = variables[0];
				response = graphql({
					query: cryptocurrencyExchangeRate,
					variables
				})
			});
			describe('1', () => {
				const CryptocurrencyExchangeRateFieldsSchema = queries.cryptocurrencyExchangeRate.type.getFields();
				const expectedCryptocurrencyExchangeRate = {};
				cryptocurrencyExchangeRateQuoteFields.forEach(field => {
					expectedCryptocurrencyExchangeRate[field] = expect.toMatchSchema(CryptocurrencyExchangeRateFieldsSchema[field]);
				});
				it(`test only quoteFields\t\t${responseMatchesSchema(variables)}`, () => expect(response).resolves.toEqual(expect.customObjectContaining({
					data: {
						cryptocurrencyExchangeRate: expect.customObjectContaining(expectedCryptocurrencyExchangeRate)
					}
				})));
			});
			describe('2', () => {
				const CryptocurrencyExchangeRateFieldsSchema = queries.cryptocurrencyExchangeRate.type.getFields();
				const expectedCryptocurrencyExchangeRate = {};
				cryptocurrencyExchangeRatetimeSeriesFields.forEach(field => {
					expectedCryptocurrencyExchangeRate[field] = expect.toMatchSchema(CryptocurrencyExchangeRateFieldsSchema[field]);
				});
				it(`test only timeseriesFields\t${responseMatchesSchema(variables)}`, () => expect(response).resolves.toEqual(expect.customObjectContaining({
					data: {
						cryptocurrencyExchangeRate: expect.customObjectContaining(expectedCryptocurrencyExchangeRate)
					}
				})));
			});
			describe('3', () => {
				it(`test combination\t\t${responseMatchesSchema(variables)}`, () => expect(response).resolves.toMatchSchema(schema));
				it(`test combination\t\t${returnNoErrors(variables)}`, () => expect(response).resolves.toHaveProperty('errors', undefined));
			});
		}

		describe("exchangeRates", () => test({
			...variables.crypto.exchangeRates[0],
			...variables.crypto.exchangeTimeSeries[0]
		}));
	});

	describe('foreignExchange', () => {
		describe.each(variables.forex.exchangeTimeSeries)("%j", variables => {
			let response;
			beforeAll(() =>
				response = graphql({ query: foreignExchange, variables })
			);

			it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
			it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
		});
	});

	describe('cryptocurrency', () => {
		describe.each(variables.crypto.exchangeTimeSeries)("%j", CryptocurrencyParams => {
			describe.each(variables.crypto.exchangeRates)("%j", CryptocurrencyExchangeRateParams => {
				const variables = {
					...CryptocurrencyExchangeRateParams,
					...CryptocurrencyParams
				};
				let response;
				beforeAll(() =>
					response = graphql({
						query: cryptocurrency, variables
					})
				);
				// delete expectedCryptocurrency.sample.exchangeRate; //TODO selectively turn off fileds tests?

				const CryptocurrencyFieldsSchema = queries.cryptocurrency.type.getFields();
				const expectedCryptocurrency = {};
				Object.keys(CryptocurrencyFieldsSchema).forEach(field => {
					if (field !== 'exchangeRate') expectedCryptocurrency[field] = expect.toMatchSchema(CryptocurrencyFieldsSchema[field]);
				});

				it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
				it(responseMatchesSchema(variables), () => expect(response).resolves.toEqual(expect.customObjectContaining({
					data: {
						cryptocurrency: expect.customObjectContaining(expectedCryptocurrency)
					}
				})));
			})
		})
	});

	describe('symbolSearch', () => {
		describe.each(variables.data.search)("%j", variables => {
			let response;
			beforeAll(() =>
				response = graphql({ query: symbolSearch, variables })
			);

			it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
			it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
		})
	});

	// describe('Technical', () => {
	// 	const variables = {
	// 		// symbol52: 'MSFT', interval52: 'weekly',
	// 		// time_period: 10, series_type: 'open',
	// 		// time_period1: 10, series_type1: 'open',
	// 		// time_period2: 10, series_type2: 'open',
	// 		// time_period3: 10, series_type3: 'open',
	// 		// time_period4: 10, series_type4: 'open',
	// 		// time_period5: 10, series_type5: 'open',
	// 		// time_period6: 10, series_type6: 'open',
	// 		// interval7: 'daily', time_period7: 10, series_type7: 'close', fastlimit: 0.02,
	// 		// interval9: 'daily', time_period9: 10, series_type9: 'open',
	// 		// interval10: 'daily', time_period10: 10, series_type10: 'open',
	// 		// interval11: 'daily',
	// 		// interval12: 'daily',
	// 		// time_period8: 10, series_type11: 'open',
	// 		// interval14: 'daily', series_type12: 'close', fastkperiod2: 6, fastdmatype1: 1,
	// 		// interval15: 'daily',
	// 		// interval16: 'daily', time_period11: 10, series_type14: undefined,
	// 		// interval17: 'daily', time_period12: 10,
	// 		// interval18: 'daily', series_type16: 'close', fastperiod2: 10, matype: 1,
	// 		// interval19: 'daily', series_type17: 'close', fastperiod3: 10, matype1: 1,
	// 		// interval20: 'daily', time_period13: 10, series_type18: 'close',
	// 		// interval21: 'daily',
	// 		// interval22: 'daily', time_period15: 10,
	// 		//
	// 		//
	// 		//
	// 		// interval26: 'daily', time_period19: 14,
	// 		//
	// 		//
	// 		// interval29: 'daily', time_period22: 10,
	// 		//
	// 		// series_type27: 'close'
	//
	// 		/* SMA */            symbol: 'MSFT', interval: 'weekly', time_period: 10, series_type: 'open',
	// 		/* EMA */            symbol1: 'MSFT', interval1: 'weekly', time_period1: 10, series_type1: 'open',
	// 		/* WMA */            symbol2: 'MSFT', interval2: 'weekly', time_period2: 10, series_type2: 'open',
	// 		/* DEMA */            symbol3: 'MSFT', interval3: 'weekly', time_period3: 10, series_type3: 'open',
	// 		/* TEMA */            symbol4: 'MSFT', interval4: 'weekly', time_period4: 10, series_type4: 'open',
	// 		/* TRIMA */            symbol5: 'MSFT', interval5: 'weekly', time_period5: 10, series_type5: 'open',
	// 		/* KAMA */            symbol6: 'MSFT', interval6: 'weekly', time_period6: 10, series_type6: 'open',
	// 		/* MAMA */            symbol7: 'MSFT', interval7: 'daily', series_type7: 'close',
	// 		fastlimit: 0.02,
	// 		/* VWAP */            symbol8: 'MSFT', interval8: '15min',
	// 		/* T3 */            symbol9: 'MSFT', interval9: 'weekly', time_period7: 10, series_type8: 'open',
	// 		/* MACD */            symbol10: 'MSFT', interval10: 'daily', series_type9: 'open',
	// 		/* MACDEXT */        symbol11: 'MSFT', interval11: 'daily', series_type10: 'open',
	// 		/* STOCH */            symbol12: 'MSFT', interval12: 'daily',
	// 		/* STOCHF */        symbol13: 'MSFT', interval13: 'daily',
	// 		/* RSI */            symbol14: 'MSFT', interval14: 'weekly', time_period8: 10, series_type11: 'open',
	// 		/* STOCHRSI */        symbol15: 'MSFT', interval15: 'daily', time_period9: 10, series_type12: 'close',
	// 		fastkperiod2: 6, fastdmatype1: 1,
	// 		/* WILLR */            symbol16: 'MSFT', interval16: 'daily', time_period10: 10,
	// 		/* ADX */            symbol17: 'MSFT', interval17: 'daily', time_period11: 10,
	// 		/* ADXR */            symbol18: 'MSFT', interval18: 'daily', time_period12: 10,
	// 		/* APO */            symbol19: 'MSFT', interval19: 'daily', series_type16: 'close',
	// 		fastperiod2: 10, matype: 1,
	// 		/* PPO */            symbol20: 'MSFT', interval20: 'daily', series_type17: 'close',
	// 		fastperiod3: 10, matype1: 1,
	// 		/* MOM */            symbol21: 'MSFT', interval21: 'daily', time_period13: 10, series_type18: 'close',
	// 		/* BOP */            symbol22: 'MSFT', interval22: 'daily',
	// 		/* CCI */            symbol23: 'MSFT', interval23: 'daily', time_period15: 10,
	// 		/* CMO */            symbol24: 'MSFT', interval24: 'weekly', time_period16: 10, series_type21: 'close',
	// 		/* ROC */            symbol25: 'MSFT', interval25: 'weekly', time_period17: 10, series_type22: 'close',
	// 		/* ROCR */            symbol26: 'MSFT', interval26: 'daily', time_period18: 10, series_type23: 'close',
	// 		/* AROON */            symbol27: 'MSFT', interval27: 'daily', time_period19: 14,
	// 		/* AROONOSC */        symbol28: 'MSFT', interval28: 'daily', time_period20: 10,
	// 		/* MFI */            symbol29: 'MSFT', interval29: 'weekly', time_period21: 10,
	// 		/* TRIX */            symbol30: 'MSFT', interval30: 'daily', time_period22: 10, series_type27: 'close',
	// 		/* ULTOSC */        symbol31: 'MSFT', interval31: 'daily',
	// 		timeperiod1: 8,
	// 		/* DX */            symbol32: 'MSFT', interval32: 'daily', time_period23: 10,
	// 		/* MINUS_DI */        symbol33: 'MSFT', interval33: 'weekly', time_period24: 10,
	// 		/* PLUS_DI */        symbol34: 'MSFT', interval34: 'daily', time_period25: 10,
	// 		/* MINUS_DM */        symbol35: 'MSFT', interval35: 'daily', time_period26: 10,
	// 		/* PLUS_DM */        symbol36: 'MSFT', interval36: 'daily', time_period27: 10,
	// 		/* BBANDS */        symbol37: 'MSFT', interval37: 'weekly', time_period28: 5, series_type33: 'close',
	// 		nbdevup: 3, nbdevdn: 3,
	// 		/* MIDPOINT */        symbol38: 'MSFT', interval38: 'daily', time_period29: 10, series_type34: 'close',
	// 		/* MIDPRICE */        symbol39: 'MSFT', interval39: 'daily', time_period30: 10,
	// 		/* SAR */            symbol40: 'MSFT', interval40: 'weekly',
	// 		acceleration: 0.05, maximum: 0.25,
	// 		/* TRANGE */        symbol41: 'MSFT', interval41: 'daily',
	// 		/* ATR */            symbol42: 'MSFT', interval42: 'daily', time_period32: 14,
	// 		/* NATR */            symbol43: 'MSFT', interval43: 'weekly', time_period33: 14,
	// 		/* AD */            symbol44: 'MSFT', interval44: 'daily',
	// 		/* ADOSC */            symbol45: 'MSFT', interval45: 'daily',
	// 		fastperiod4: 5,
	// 		/* OBV */            symbol46: 'MSFT', interval46: 'weekly',
	// 		/* HT_TRENDLINE */    symbol47: 'MSFT', interval47: 'daily', series_type40: 'close',
	// 		/* HT_SINE */        symbol48: 'MSFT', interval48: 'daily', series_type41: 'close',
	// 		/* HT_TRENDMODE */    symbol49: 'MSFT', interval49: 'weekly', series_type42: 'close',
	// 		/* HT_DCPERIOD */    symbol50: 'MSFT', interval50: 'daily', series_type43: 'close',
	// 		/* HT_DCPHASE */    symbol51: 'MSFT', interval51: 'daily', series_type44: 'close',
	// 		/* HT_PHASOR */        symbol52: 'MSFT', interval52: 'weekly', series_type45: 'close',
	// 	};
	//
	// 	let response;
	// 	beforeAll(() =>
	// 		response = graphql({
	// 			query: technical, variables
	// 		})
	// 	);
	//
	// 	it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
	// 	it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
	// }); //TODO
});