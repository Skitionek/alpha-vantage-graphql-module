/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  2019-06-07
*/
import "@babel/polyfill";
import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import alphaVantageModule from '../src';
import { alphaVantageInterface } from "../src/constants";
import {AlphaVantageMock} from "alpha-vantage-data-source/lib/test";

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

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`)
});