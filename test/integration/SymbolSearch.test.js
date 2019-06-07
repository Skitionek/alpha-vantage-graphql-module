/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import { generatedQueries, graphql, responseMatchesSchema, returnNoErrors, schema, variables } from "./utilities";


const { symbolSearch: query } = generatedQueries;


describe.each(variables.data.search)("%j", variables => {
	let response;
	beforeAll(() =>
		response = graphql({ query, variables })
	);

	it(returnNoErrors(variables), () => expect(response).resolves.toHaveProperty('errors', undefined));
	it(responseMatchesSchema(variables), () => expect(response).resolves.toMatchSchema(schema));
});
