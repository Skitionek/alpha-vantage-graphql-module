/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/


import { generatedQueries, graphql, schema, responseMatchesSchema, returnNoErrors, variables } from "./utilities";

const { cryptocurrencyExchangeRate } = generatedQueries;

function test(variables) {
	let response;
	beforeAll(() => {
		if (Array.isArray(variables)) variables = variables[0];
		response = graphql({
			query: cryptocurrencyExchangeRate,
			variables
		})
	});
	it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
	it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
};

describe("exchangeRates", () => test({
	...variables.crypto.exchangeRates[0],
	...variables.crypto.exchangeTimeSeries[0]
}));