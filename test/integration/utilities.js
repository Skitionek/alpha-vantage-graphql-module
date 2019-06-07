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
import {generateAll as gqlGenerator} from "gql-generator-node";
export { generateQuery } from "gql-generator-node";

'gql-generator-node';
import '../jest.extensions';
import { alphaVantageInterface } from "../../src/constants";

import {variables, AlphaVantageMock} from "alpha-vantage-data-source/lib/test";
export {variables, AlphaVantageMock};


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

export const queries = schema.getQueryType().getFields();
export const { queries: generatedQueries } = gqlGenerator(schema, undefined, ({ args }) => {
	const o = {};
	(args || []).forEach(arg => {
		o[arg.name] = arg;
	});
	return o;
});

export const returnNoErrors = variables => `returns no errors\t\t${JSON.stringify(variables)}`;
export const responseMatchesSchema = variables => `response matches schema\t\t${JSON.stringify(variables)}`;