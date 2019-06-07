/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/


import { generatedQueries, graphql, responseMatchesSchema, returnNoErrors, variables, schema } from "./utilities";


const { foreignExchange } = generatedQueries;

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