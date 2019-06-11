/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import {
	generatedQueries,
	queryTesterFactory, variablesFieldsTupleByPath
} from "./utilities";

// get all queries to be tested
const { stock } = generatedQueries;

const test = queryTesterFactory(stock);

describe("quote", () => test(...variablesFieldsTupleByPath('data.quote')));
describe("exchangeTimeSeries", () => test(...variablesFieldsTupleByPath('data.exchangeTimeSeries')));
describe("exchangeTimeSeries_adjusted", () => test(...variablesFieldsTupleByPath('data.exchangeTimeSeries_adjusted')));