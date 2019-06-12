/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import { generatedQueries, queryTesterFactory, variablesFieldsTupleByPath } from "./utils";

const { foreignExchange } = generatedQueries;

const test = queryTesterFactory(foreignExchange);

describe("forex.exchangeTimeSeries", ()=>test(...variablesFieldsTupleByPath('forex.exchangeTimeSeries')));