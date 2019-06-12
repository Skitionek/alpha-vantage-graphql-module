/* DOCUMENT INFORMATION
	- Author:   Dominik Maszczyk
	- Email:    Skitionek@gmail.com
	- Created:  23/04/2019
*/

import { generatedQueries, queryTesterFactory, variablesFieldsTupleByPath } from "./utils";

const { cryptocurrencyExchangeRate } = generatedQueries;

const test = queryTesterFactory(cryptocurrencyExchangeRate);

describe("crypto.exchangeRates", () => test(...variablesFieldsTupleByPath('crypto.exchangeRates')));