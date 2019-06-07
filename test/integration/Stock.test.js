/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import { generatedQueries, graphql, responseMatchesSchema, returnNoErrors, schema, variables } from "./utilities";

// get all queries to be tested
const { stock } = generatedQueries;

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
