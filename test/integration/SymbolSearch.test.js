/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import {
	generatedQueries,
	queryTesterFactory,
	variablesFieldsTupleByPath
} from "./utils";

const { symbolSearch } = generatedQueries;

const test = queryTesterFactory(symbolSearch);

describe("data.search", () => test(...variablesFieldsTupleByPath('data.search')));