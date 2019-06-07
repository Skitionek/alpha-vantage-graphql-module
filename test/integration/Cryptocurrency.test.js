/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import { generatedQueries, graphql, responseMatchesSchema, returnNoErrors, variables, schema } from "./utilities";


const { cryptocurrency } = generatedQueries;

describe.each(variables.crypto.exchangeTimeSeries)("%j", CryptocurrencyParams => {
	describe.each(variables.crypto.exchangeRates)("%j", CryptocurrencyExchangeRateParams => {
		function test(variables) {
			let response;
			beforeAll(() => {
				let variables = {
					...CryptocurrencyExchangeRateParams,
					...CryptocurrencyParams
				};
				if (Array.isArray(variables)) variables = variables[0];
				response = graphql({ query: cryptocurrency, variables })
			});

			it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
			it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
		}

		describe("exchangeTimeSeries", () => test(variables.crypto.exchangeTimeSeries));
		describe("exchangeTimeSeries_adjusted", () => test(variables.crypto.exchangeTimeSeries_adjusted));
	})
});


