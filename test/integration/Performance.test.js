/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import {
	generatedQueries,
	queryTesterFactory, variablesFieldsTupleByPath
} from "./utils";

// get all queries to be tested
const { sectorPerformance } = generatedQueries;

const test = queryTesterFactory(sectorPerformance);

describe("performance", () => test(...variablesFieldsTupleByPath('performance.sector')));