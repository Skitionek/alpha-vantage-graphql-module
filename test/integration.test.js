/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import "@babel/polyfill";
import 'reflect-metadata';
import './jest.extensions';
import AlphaVantageAPI from "../src";
import * as variables from "./mocks";
import { obtainStructure } from "./jest.extensions";

describe('alphaVantage.module', () => {
	let alpha;
	beforeAll(() => {
		alpha = new AlphaVantageAPI({ key: 'demo' })
	});

	const alphaStructure = AlphaVantageAPI.prototype;
	const returnNoErrors = variables => `returns no errors\t\t${JSON.stringify(variables)}`;

	describe.each(['data', 'crypto', 'forex', 'performance', 'technical'])("%s", groupKey => {
		describe.each(Object.keys(alphaStructure[groupKey]))("%s", key => {
			let varSets = variables[groupKey][key];
			varSets = Array.isArray(varSets) ? varSets : [varSets];
			it.each(varSets)("%j", async varSet => {
				expect.assertions(2);
				const response = await alpha[groupKey][key](varSet);
				expect(obtainStructure(response)).toMatchSnapshot();
				expect(JSON.stringify(response).length).toBeGreaterThan(150);
			});
		})
	});
});