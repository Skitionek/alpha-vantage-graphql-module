/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-06-03
*/
import "@babel/polyfill";
import 'reflect-metadata';

import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import alphaVantageModule from '../../src';
// import AlphaVantage from "../src/dataSource";
import { generateAll as gqlGenerator } from "gql-generator-node";
import '../jest.extensions';
import { alphaVantageInterface, fields, snaps } from "../../src/constants";

import { AlphaVantageMock, variables } from "alpha-vantage-data-source/lib/test";

export { generateQuery } from "gql-generator-node";

export { variables, AlphaVantageMock };

// get module and inject mockup
export const { schema, injector } = alphaVantageModule;
injector
	.provide({
		provide: alphaVantageInterface,
		useFactory: () => new AlphaVantageMock(),
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
export const graphql = createTestClient(server).query;
schema.getQueryType().getFields();
export const { queries: generatedQueries } = gqlGenerator(schema, undefined, ({ args }) => {
	const o = {};
	(args || []).forEach(arg => {
		o[arg.name] = arg;
	});
	return o;
});

export const returnNoErrors = innerVariables => `returns no errors\t\t${JSON.stringify(innerVariables)}`;
export const responseMatchesSchema = innerVariables => `response matches schema\t\t${JSON.stringify(innerVariables)}`;

export function queryTesterFactory(query) {
	return function test(testVariables, customFields) {
		if (Array.isArray(testVariables)) {
			describe.each(testVariables)("%j", subTestVariables => test(subTestVariables, customFields));
		} else {
			let response;
			beforeAll(() => {
				response = graphql({ query, variables: testVariables })
			});

			it(returnNoErrors(testVariables), () => expect(response).resolves.toHaveProperty('errors', undefined));
			it(responseMatchesSchema(testVariables), () => expect(response).resolves.toMatchSchema(schema, { customFields: [customFields] }));
		}
	}
}

export function variablesFieldsTupleByPath(pathStr) {
	const path = pathStr.split('.');
	let variable = variables;
	let field = snaps;
	path.forEach(step => {
		variable = variable[step];
		field = field[step];
	});
	return [variable, fields(field)];
}

export function getNextLevelFields(field) {
	if (field.getFields) return field.getFields();
	if (field.type) return getNextLevelFields(field.type);
	if (field.ofType) return getNextLevelFields(field.ofType);
	console.assert(false, "Not reach");
}