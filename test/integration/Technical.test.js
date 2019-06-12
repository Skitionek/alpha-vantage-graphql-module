/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import {
	generateQuery,
	getNextLevelFields,
	graphql,
	responseMatchesSchema,
	returnNoErrors,
	schema,
	variables
} from "./utils";

describe.each(Object.entries(variables.technical))("%s", (key, queryVariables) => {

	let field; let response;
	beforeAll(() => {
		field = schema.getQueryType().getFields().technical;
		response = graphql({
			query: generateQuery({
				field,
				skeleton: {
					[key]: false
				}
			}),
			variables: queryVariables
		})
	});
	it(returnNoErrors(queryVariables), () => expect(response).resolves.toHaveProperty('errors', undefined));

	it(`test only one field\t\t${responseMatchesSchema(queryVariables)}`, () => expect(response).resolves.toEqual(
		expect.customObjectContaining({
			data: {
				technical: expect.customObjectContaining({
					[key]: expect.toMatchSchema(
						getNextLevelFields(field)[key]
					)
				})
			}
		})
	));
});